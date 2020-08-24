import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
const bodyParser = require('body-parser');
import {join} from 'path';
import { existsSync } from 'fs';
import { AppServerModule } from './src/app/app.server.module';
import { APP_BASE_HREF } from '@angular/common';
const fs = require('fs');
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';

export function app(): express.Express {
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

    server.post('/api/get-file', (req: Request, res: Response, next: NextFunction) => {
        const file = req.body;
        fs.writeFile(path.join(__dirname) +  '/' + file.name , file.content, (err) => {
            if (err) {
                console.error(err);
                res.sendStatus(500);
            } else {
                res.status(200);
                const filePath = path.join(__dirname) + '/' + file.name;
                res.sendFile(filePath);
            }
        });
    });
    return server;
}

function run(): void {
    const port = process.env.PORT || 4200;

    // Start up the Node server
    const server = app();
    server.listen(port, () => {
        console.log(`Node Express server listening on http://localhost:${port}`);
    });
}
// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
