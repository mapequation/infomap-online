import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const exportDir = path.resolve(__dirname, "../out");
const basePath = "/infomap";
const port = Number(process.env.PORT || 4173);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function getFilePath(requestPath) {
  if (requestPath === "/") {
    return null;
  }

  if (!requestPath.startsWith(basePath)) {
    return false;
  }

  let relativePath = requestPath.slice(basePath.length) || "/";
  if (relativePath.endsWith("/")) {
    relativePath += "index.html";
  }

  const resolvedPath = path.resolve(exportDir, `.${relativePath}`);
  const relativeResolvedPath = path.relative(exportDir, resolvedPath);
  if (
    relativeResolvedPath === ".." ||
    relativeResolvedPath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativeResolvedPath)
  ) {
    return false;
  }

  return resolvedPath;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host}`);
  const filePath = getFilePath(url.pathname);

  if (filePath === null) {
    res.writeHead(302, { Location: `${basePath}/` });
    res.end();
    return;
  }

  if (filePath === false) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  let servedPath = filePath;

  try {
    const fileInfo = await stat(servedPath);
    if (!fileInfo.isFile()) {
      throw new Error("Not a regular file");
    }
  } catch {
    if (!path.extname(filePath)) {
      servedPath = `${filePath}.html`;
      try {
        const fileInfo = await stat(servedPath);
        if (!fileInfo.isFile()) {
          throw new Error("Not a regular file");
        }
      } catch {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
    } else {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
  }

  const extension = path.extname(servedPath);
  res.writeHead(200, {
    "Content-Type": MIME_TYPES[extension] || "application/octet-stream",
    "Cache-Control": "no-cache",
  });

  try {
    await pipeline(createReadStream(servedPath), res);
  } catch {
    if (!res.headersSent) {
      res.writeHead(500);
      res.end("Internal server error");
      return;
    }
    res.destroy();
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Serving static export on http://127.0.0.1:${port}${basePath}/`);
});
