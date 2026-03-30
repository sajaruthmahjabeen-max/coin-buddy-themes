import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, 'coin-buddy-debug.apk');
const server = http.createServer((req, res) => {
  if (req.url === '/coin-buddy-debug.apk' || req.url === '/') {
    res.writeHead(200, { 
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Disposition': 'attachment; filename="coin-buddy-debug.apk"'
    });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(9090, '0.0.0.0', () => {
  console.log('Server running at http://10.249.168.71:9090/coin-buddy-debug.apk');
});
