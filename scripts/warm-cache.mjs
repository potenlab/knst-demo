#!/usr/bin/env node
/**
 * Warm the public page cache (worker/page-cache.ts) after a deploy.
 *
 * Every deploy is a new Worker version and the Workers Cache is keyed per version, so the first request
 * to each page renders (expensive on the Workers Free plan's 10 ms CPU limit → occasional 503 / error 1102).
 * This script requests every URL in sitemap.xml (+ feeds, list pages and their ?page=N / ?category= links),
 * retrying 5xx responses until each one is cached, then checks that a second request is a cache HIT.
 *
 * Usage:
 *   node scripts/warm-cache.mjs [origin] [options]
 *
 *   origin                 default https://knst.co.kr
 *   --resolve host:port:ip pin DNS like curl --resolve (e.g. knst.co.kr:443:104.21.50.33)
 *   --version <id>         send Cloudflare-Workers-Version-Overrides for an uploaded version that is in the
 *                          active deployment (e.g. at 0%), to warm it before it takes traffic
 *   --worker <name>        Worker name for --version (default knst-demo)
 *   --concurrency <n>      parallel requests (default 3)
 *   --retries <n>          attempts per URL on 5xx/network errors (default 8)
 *   --no-verify            skip the second (HIT check) pass
 *
 * Exit code 0 when every URL ended in a non-5xx status, 1 otherwise.
 */
import https from "node:https";
import http from "node:http";

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const opt = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const origin = (argv.find((a) => /^https?:\/\//.test(a)) ?? "https://knst.co.kr").replace(/\/+$/, "");
const resolve = opt("resolve", null); // host:port:ip
const version = opt("version", null);
const worker = opt("worker", "knst-demo");
const concurrency = Math.max(1, Number(opt("concurrency", 3)));
const retries = Math.max(1, Number(opt("retries", 8)));
const verify = !flag("no-verify");

const pinned = resolve ? resolve.split(":") : null; // [host, port, ipv4]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** GET with optional DNS pinning; resolves { status, headers, body } (body only when wanted). */
function get(path, { wantBody = false } = {}) {
  const url = new URL(path, origin);
  const lib = url.protocol === "http:" ? http : https;
  const headers = {
    "user-agent": "knst-warm-cache/1.0",
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-encoding": "identity",
  };
  if (version) headers["Cloudflare-Workers-Version-Overrides"] = `${worker}="${version}"`;
  const options = { method: "GET", headers, timeout: 60_000 };
  if (pinned && pinned[0] === url.hostname) {
    const ip = pinned[2];
    options.lookup = (_host, o, cb) => (o && o.all ? cb(null, [{ address: ip, family: ip.includes(":") ? 6 : 4 }]) : cb(null, ip, ip.includes(":") ? 6 : 4));
  }
  return new Promise((resolvePromise, reject) => {
    const req = lib.request(url, options, (res) => {
      const chunks = [];
      res.on("data", (c) => wantBody && chunks.push(c));
      res.on("end", () => resolvePromise({ status: res.statusCode ?? 0, headers: res.headers, body: wantBody ? Buffer.concat(chunks).toString("utf8") : "" }));
      res.on("error", reject);
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", reject);
    req.end();
  });
}

/** Retries network errors and 5xx (error 1102 = CPU limit on a cache miss) with backoff. */
async function warmOne(path, opts) {
  let last = { status: 0, headers: {}, body: "", error: "" };
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      last = await get(path, opts);
      if (last.status < 500) return { ...last, attempts: attempt };
    } catch (e) {
      last = { status: 0, headers: {}, body: "", error: String(e?.message ?? e) };
    }
    await sleep(Math.min(8000, 500 * 2 ** (attempt - 1)));
  }
  return { ...last, attempts: retries };
}

async function pool(items, fn) {
  const queue = [...items];
  const out = [];
  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, async () => {
      while (queue.length) {
        const item = queue.shift();
        out.push(await fn(item));
      }
    }),
  );
  return out;
}

const toPath = (loc) => {
  const u = new URL(loc.replace(/&amp;/g, "&"), origin);
  return u.pathname + u.search;
};

async function main() {
  console.log(`warming ${origin}${version ? ` (version ${version})` : ""}${resolve ? ` via ${resolve}` : ""}`);
  const sitemap = await warmOne("/sitemap.xml", { wantBody: true });
  if (sitemap.status !== 200) {
    console.error(`sitemap.xml: HTTP ${sitemap.status} ${sitemap.error ?? ""}`);
    process.exit(1);
  }
  const paths = new Set(["/", "/sitemap.xml", "/blog/rss.xml", "/robots.txt", "/manifest.webmanifest"]);
  for (const m of sitemap.body.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) paths.add(toPath(m[1]));

  // list pages: also warm their pagination (?page=N) and category tabs (?category=…)
  const lists = ["/blog/", "/notices/", "/news/"];
  for (const list of lists) {
    const res = await warmOne(list, { wantBody: true });
    for (const m of res.body.matchAll(/href="(\/(?:blog|notices|news)\/\?[^"#]+)"/g)) paths.add(toPath(m[1]));
  }

  const started = Date.now();
  const results = await pool([...paths], async (path) => ({ path, ...(await warmOne(path)) }));
  const failed = results.filter((r) => r.status >= 500 || r.status === 0);
  const retried = results.filter((r) => r.attempts > 1);
  const byStatus = {};
  for (const r of results) byStatus[r.status] = (byStatus[r.status] ?? 0) + 1;
  const gatewayRetried = results.filter((r) => Number(r.headers?.["x-page-cache-attempts"] ?? 1) > 1).length;
  console.log(
    `pass 1: ${results.length} URLs in ${((Date.now() - started) / 1000).toFixed(1)}s, status ${JSON.stringify(byStatus)}, ` +
      `retried by this script ${retried.length}, retried inside the Worker ${gatewayRetried}`,
  );
  for (const r of retried) console.log(`  retried x${r.attempts - 1}: ${r.status} ${decodeURI(r.path)}`);
  for (const r of failed) console.log(`  FAILED: ${r.status} ${r.error ?? ""} ${decodeURI(r.path)}`);

  if (verify) {
    const check = await pool(
      results.filter((r) => r.status < 500 && r.status !== 0).map((r) => r.path),
      async (path) => {
        const res = await warmOne(path);
        return { path, status: res.status, cache: String(res.headers["x-page-cache"] ?? "-") };
      },
    );
    const cacheCounts = {};
    for (const r of check) cacheCounts[r.cache] = (cacheCounts[r.cache] ?? 0) + 1;
    console.log(`pass 2 (x-page-cache): ${JSON.stringify(cacheCounts)}`);
    for (const r of check.filter((r) => r.cache !== "HIT")) console.log(`  not HIT: ${r.cache} ${r.status} ${decodeURI(r.path)}`);
  }
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
