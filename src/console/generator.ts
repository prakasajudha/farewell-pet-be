import { unlink  } from 'fs';
import { createRouter } from './generator/router';
import { createController } from './generator/controller';
import { createService } from './generator/service';
import { createModel } from './generator/model';
import { upperFirst } from 'lodash';
import { connection } from '../lib/database';
import { dbconnect } from './generator/connect';
import { createRequest } from './generator/request';

const arg = require('yargs').argv
var object: string = arg._[0]
var model: string = arg._[1]
var tables = null

if (!object || !model) {
    console.log('\x1b[33m%s\x1b[0m', 'Object / Model is required. Command : npx ts-node src/console/generator.ts <object> <models>');
}

const db: any = dbconnect(model)

setTimeout(() => {
    db.then((columns: any) => {
        if (columns.length) {
            unlink(`${__dirname.replace('/console', '/models/')}${upperFirst(object)}.ts`, (err) => {})
            unlink(`${__dirname.replace('/console', '/controllers/')}${object}-controller.ts`, (err) => {})
            unlink(`${__dirname.replace('/console', '/services/')}${object}-service.ts`, (err) => {})
            unlink(`${__dirname.replace('/console', '/routes/api/')}${object}-router.ts`, (err) => {})
            unlink(`${__dirname.replace('/console/generator', '/requests/')}${object}-store-request.ts`, (err) => {})
            unlink(`${__dirname.replace('/console/generator', '/requests/')}${object}-update-request.ts`, (err) => {})
            
            createModel(object, model, columns)
            createRouter(object)
            createController(object)
            createService(object)
            createRequest(object, columns)
        } else {
            console.log('invalid column')
        }
    })
    
}, 2000);