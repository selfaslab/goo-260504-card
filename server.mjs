/**
 * Serves the static app and POST /api/wisdom (OpenAI Chat Completions).
 * Set OPENAI_API_KEY in `.env` or the environment (see https://developers.openai.com/api/docs ).
 * Optional: OPENAI_MODEL (default gpt-4o-mini), PORT (default 8787).
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Loads `.env` into process.env without overriding existing variables. */
function loadEnvFromFile(envPath) {
  try {
    let raw = fs.readFileSync(envPath, "utf8");
    if (raw.charCodeAt(0) === 0xfeff) {
      raw = raw.slice(1);
    }
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }
      const eq = trimmed.indexOf("=");
      if (eq === -1) {
        continue;
      }
      const key = trimmed.slice(0, eq).trim();
      if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
        continue;
      }
      if (process.env[key] !== undefined) {
        continue;
      }
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      process.env[key] = value.trimEnd();
    }
  } catch {
    /* missing or unreadable .env */
  }
}

loadEnvFromFile(path.join(__dirname, ".env"));

const PORT = Number(process.env.PORT) || 8787;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
};

function safeResolvePath(urlPath) {
  let pathname = urlPath || "/";
  try {
    pathname = decodeURIComponent(pathname.split("?")[0] || "/");
  } catch {
    return null;
  }
  const rel = pathname === "/" || pathname === "" ? "index.html" : pathname.replace(/^\/+/, "");
  const base = path.resolve(__dirname);
  const resolved = path.resolve(base, rel);
  const relToBase = path.relative(base, resolved);
  if (relToBase.startsWith("..") || path.isAbsolute(relToBase)) {
    return null;
  }
  return resolved;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseModelJsonObject(content) {
  let s = typeof content === "string" ? content.trim() : "";
  if (!s) {
    throw new Error("empty model content");
  }
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  }
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first !== -1 && last > first) {
    s = s.slice(first, last + 1);
  }
  return JSON.parse(s);
}

async function handleWisdom(res) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    res.writeHead(503, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "OPENAI_API_KEY is not set on the server." }));
    return;
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const system = `You are a careful assistant. Reply with a single JSON object only, no markdown.
Use real, notable historical or contemporary figures. Prefer well-attributed quotes; if uncertain, choose a different figure.
All descriptive strings meant for the user interface must be in Korean except "original" which stays in the figure's source language when not Korean.`;

  const user = `Generate ONE short inspirational quote and biographical metadata.
Return JSON with exactly these keys:
- "text" (string): Korean translation or Korean rendering of the quote.
- "original" (string): Quote in original language; if the source is Korean, use an empty string "".
- "originalLang" (string): BCP-47 tag like "ko", "en", "la", "de".
- "figureNameKo" (string): Person name in Korean, e.g. "소크라테스".
- "achievementKo" (string): One concise Korean phrase for their main fame, e.g. "그리스의 철학자, 문답법으로 윤리를 탐구함".
- "birthYear" (number or null): Gregorian year; use negative integers for BCE (e.g. -470 for 470 BC).
- "deathYear" (number or null): Gregorian year; negative for BCE; null if unknown or living.`;

  let upstream;
  try {
    upstream = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });
  } catch (e) {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Could not reach OpenAI." }));
    return;
  }

  const raw = await upstream.text();
  if (!upstream.ok) {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: raw || upstream.statusText }));
    return;
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Invalid response from OpenAI." }));
    return;
  }

  const content = parsed?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Unexpected OpenAI payload." }));
    return;
  }

  let wisdom;
  try {
    wisdom = parseModelJsonObject(content);
  } catch {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Model did not return valid JSON." }));
    return;
  }

  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify({ wisdom }));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || "/", `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/api/wisdom") {
    await readBody(req);
    await handleWisdom(res);
    return;
  }

  if (req.method !== "GET") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed");
    return;
  }

  const filePath = safeResolvePath(url.pathname);
  if (!filePath) {
    res.writeHead(403);
    res.end();
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }
    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500);
        res.end();
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      res.end(data);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Quote app: http://localhost:${PORT}/`);
  if (process.env.OPENAI_API_KEY) {
    console.log("POST /api/wisdom is enabled (OPENAI_API_KEY loaded).");
  } else {
    console.log("Add OPENAI_API_KEY to .env to enable POST /api/wisdom.");
  }
});
