import { Request, Response } from "express";
import { APP_NAME, APP_VERSION } from "../../config/config";
import HttpStatus from 'http-status-codes';

export const main = (_: Request, res: Response) => {
    return res.status(HttpStatus.OK).json({
        service: APP_NAME,
        version: APP_VERSION
    });
};

export const ping = (_: Request, res: Response) => {
    return res.status(HttpStatus.OK).send("PONG")
} 

export const checkHealth = (_: Request, res: Response) => {
    return res.status(HttpStatus.OK).send("OK")
}