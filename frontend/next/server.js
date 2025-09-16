// server.js

const express = require("express");
const next = require("next");
const http = require("http"); // Biblioteca nativa do Node.js
const url = require("url"); // Biblioteca nativa do Node.js

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Middleware para o proxy manual
  server.use("/angular", (req, res) => {
    const targetUrl = `http://localhost:4200${req.url}`;
    const options = url.parse(targetUrl);
    options.method = req.method;
    options.headers = req.headers;

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    req.pipe(proxyReq);

    proxyReq.on("error", (e) => {
      console.error(`Problema com a requisição: ${e.message}`);
      res.status(500).send("Erro no proxy reverso.");
    });
  });

  // Regra para todas as outras rotas do Next.js
  server.use((req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
