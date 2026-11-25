import http from "node:http"; import fs from "node:fs"; import path from "node:path";
const root = path.resolve(process.argv[2]);
const T = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".mp4": "video/mp4" };
http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split("?")[0]); if (p === "/") p = "/index.html";
  const f = path.join(root, p); if (!f.startsWith(root)) { r.writeHead(403); return r.end(); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { r.writeHead(404); return r.end("nf"); }
    const type = T[path.extname(f)] || "application/octet-stream";
    const m = /bytes=(\d*)-(\d*)/.exec(q.headers.range || "");
    if (m) {
      const start = m[1] ? +m[1] : 0, end = m[2] ? +m[2] : st.size - 1;
      r.writeHead(206, { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${st.size}`, "Content-Length": end - start + 1 });
      return fs.createReadStream(f, { start, end }).pipe(r);
    }
    r.writeHead(200, { "Content-Type": type, "Accept-Ranges": "bytes", "Content-Length": st.size });
    fs.createReadStream(f).pipe(r);
  });
}).listen(5173, "127.0.0.1", () => console.log("http://127.0.0.1:5173"));
