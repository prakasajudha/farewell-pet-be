import { Express } from 'express';
import publicRoutes from "./public";
import apiRoutes from "./api/index";

const configure = (app: Express): void => {
    app.use("/", publicRoutes)
    app.use("/v1", apiRoutes)
}

export default {
    configure
};