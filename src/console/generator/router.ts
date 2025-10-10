import { writeFileSync, readFileSync } from "fs";
import { upperFirst } from "lodash";

export function createRouter (object: string) {
    let indexRouters = readFileSync(`${__dirname.replace('/console/generator', '/routes/api/')}index.ts`, `utf8`).split('\n')
    let routerIndexData = ``
    indexRouters.forEach((line) => {
        if (line.includes("require('express-group-routes')")) {
            routerIndexData += `import api${upperFirst(object)} from "./${object}-router";\n`
            routerIndexData += `require('express-group-routes')\n`
        } else if (line.includes("export default routes")) {
            routerIndexData += `
routes.group('/${object}s',(router: any) => {
    router.use("/", authorization, api${upperFirst(object)})
})

export default routes;`
        } else {
            routerIndexData += `${line}\n`
        }
    })
    
    writeFileSync(`${__dirname.replace('/console/generator', '/routes/api/')}index.ts`, routerIndexData, {
        flag: 'w',
    });

    var router = `
import express from "express";
import * as ${object} from "../../controllers/${object}-controller"
import ${upperFirst(object)}StoreRequest from "../../requests/${object}-store-request";
import ${upperFirst(object)}UpdateRequest from "../../requests/${object}-update-request";
import { validationBodyMiddleware } from "@dhc/bio-ts-base";

const router = express.Router();

router.get("/", ${object}.browse)
router.get("/:id", ${object}.show)
router.post("/", [validationBodyMiddleware(${upperFirst(object)}StoreRequest)],${object}.store)
router.put("/:id", [validationBodyMiddleware(${upperFirst(object)}UpdateRequest)], ${object}.update)
router.delete("/:id", ${object}.destroy)

export default router;
    `

    writeFileSync(`${__dirname.replace('/console/generator', '/routes/api/')}${object}-router.ts`, router, {
        flag: 'w',
    });
}
