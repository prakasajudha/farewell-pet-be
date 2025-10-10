import { writeFileSync } from "fs";
import { upperFirst } from "lodash";

export function createController(object: string) {
    const controller =
        `
import { Request, Response} from "express";
import ${upperFirst(object)}Service from '../services/${object}-service';
import { ${upperFirst(object)}s, allowedFilter, allowedSort } from '../models/${upperFirst(object)}';
import { getPagination, setFilter, setSort, response, responses } from '@dhc/bio-ts-base';
import { message} from '../util/constants';
import { Browse, Pages } from "../util/types";

const service = new ${upperFirst(object)}Service
export const browse = async (req : BioRequest, res : Response) => {
    const { page, limit, sort, filter } = req.query
    const pages: Pages = getPagination(page, limit)
    const filters: object = filter
        ? setFilter(allowedFilter, {}, filter)
        : {}
    const order: object = sort
        ? setSort(allowedSort, sort)
        : {}

    const {data, total} : Browse = await service.browse(filters, order, pages)
    return responses(req, res, pages, total, data)
};

export const show = async (req : BioRequest, res : Response) => {
    const id = req.params.id
    const data: ${upperFirst(object)}s = await service.show({
        id
    }, [])
    return response(req, res, data)
};

export const store = async (req : BioRequest, res : Response) => {
    const payload = req.body.data.data
    payload.created_by = req.user.name

    const data: any = await service.create(payload)
    return response(req, res, data, message.SUCCESS)
};

export const update = async (req : Request, res : Response) => {
    const id = req.params.id
    const payload = req.body.data.data
    const data = await service.update(id, payload)
    return response(req, res, data, message.SUCCESS)
};

export const destroy = async (req : Request, res : Response) => {
    const id = req.params.id
    await service.destroy(id)
    return response(req, res, null, message.SUCCESS)
}
`
    writeFileSync(`${__dirname.replace('/console/generator', '/controllers/')}${object}-controller.ts`, controller, {
        flag: 'w',
    });
}