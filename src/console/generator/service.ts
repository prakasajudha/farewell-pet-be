import { writeFileSync } from "fs";
import { upperFirst } from "lodash";

export function createService (object: string) {
    const service = 
`
import _ from "lodash";
import {NotFoundHandler} from "@dhc/bio-ts-base";
import {${upperFirst(object)}s} from "../models/${upperFirst(object)}";
import {Browse, Pages} from "../util/types";
import {message} from "../util/constants";

export default class ${upperFirst(object)}Service {
    browse = async (condition : object, sort : object, page : Pages): Promise < Browse > => {
        const ${object}s: ${upperFirst(object)}s[] = await ${upperFirst(object)}s.find({
            relations: [],
            where: condition,
            take: page.size,
            order: sort,
            skip: page.offset
        })
        const total: number = await await ${upperFirst(object)}s.countBy(condition)
        return {
            data: ${object}s, 
            total
        }
    }

    show = async (filter : object, relations : Array < string > = []): Promise < ${upperFirst(object)}s > => {
        const ${object} : ${upperFirst(object)}s = await ${upperFirst(object)}s
            .findOneOrFail({where: filter, relations})
            .catch(() => {
                throw NotFoundHandler(message.DATA_NOT_FOUND)
            })
        
        return ${object}
    }

    create = async (data : ${upperFirst(object)}s): Promise < ${upperFirst(object)}s > => {
        const ${object} = ${upperFirst(object)}s.create(data)
        return await ${upperFirst(object)}s
            .insert(${object})
            .then(() => {
                return ${object}
            })
    }

    update = async (id : string, data : ${upperFirst(object)}s): Promise < ${upperFirst(object)}s > => {
        await this.show({id})

        data.id = id
        data.updated_by = "system"
        data.updated_at = new Date()

        const ${object} = await ${upperFirst(object)}s.preload(data)
        return await ${upperFirst(object)}s.save(${object})
    }

    destroy = async (id : string): Promise < any > => {
        const ${object}: ${upperFirst(object)}s = await this.show({id})
        ${object}.deleted_by = "system"
        ${object}.deleted_at = new Date()
        const ${object}DeletedPayload = await ${upperFirst(object)}s.preload(${object})
        await ${upperFirst(object)}s.save(${object}DeletedPayload)

        return
    }
}
`
    writeFileSync(`${__dirname.replace('/console/generator', '/services/')}${object}-service.ts`, service, {
        flag: 'w',
    });
}