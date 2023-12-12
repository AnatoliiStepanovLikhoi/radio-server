const fs = require('fs');
const https = require('https');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4443;
app.use(cors());

// Зчитайте сертифікат та приватний ключ
const privateKey = fs.readFileSync('private-key.pem', 'utf8');
const certificate = fs.readFileSync('certificate.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const wsProxy = createProxyMiddleware('/borispilfm', {
  target: 'ws://91.219.253.226:8000',
  ws: true,
  changeOrigin: true,
});

app.use(wsProxy);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Audio Streaming</title>
    </head>
    <body>
      <audio controls autoplay>
        <source src="/borispilfm" type="audio/mpeg">
        Your browser does not support the audio element.
      </audio>
    </body>
    </html>
  `);
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
  console.log(`Proxy server is running on https://localhost:${port}`);
});
