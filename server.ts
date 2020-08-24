import 'zone.js/dist/zone-node';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { join } from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';
import { Request, Response } from 'express';
import * as express from 'express';
import * as fs from 'fs';
import * as path from 'path';
const bodyParser = require('body-parser');


export function appServer(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/zadanie/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(bodyParser.urlencoded({ extended: false }));
  server.use(bodyParser.json());

  server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  server.post('/api/get-file', (req: Request, res: Response) => {
    const file = req.body;
    fs.writeFile(path.join(__dirname) + file.name, file.content, (err) => {
      if (err) {
        res.status(500).json({
          success: false,
          message: 'Error code: ' + err.code + ' Error processing request ' + err
        });
      } else {
        const filePath = path.join(__dirname) + file.name;
        res.status(200).sendFile(filePath);
      }
    });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4200;
  const server = appServer();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}


declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
