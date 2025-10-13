import { Router } from "express";
import apiAuth from "./auth-router";
import apiPlant from "./plant-router";
import apiMessage from "./message-router";
import apiConfiguration from "./configuration-router";
import apiLeaderboard from "./leaderboard-router";
import apiEmail from "./email-router";
import { authMiddleware } from "../../middlewares/auth";

require('express-group-routes');

interface GroupRouter extends Router {
    group: (path: string, callback: (router: Router) => void) => void;
}

const userRoute = (router: Router) => {
    router.use("/", apiAuth);
};

const plantRoute = (router: Router) => {
    router.use("/", apiPlant);
};

const messageRoute = (router: Router) => {
    router.use("/", apiMessage);
};

const configurationRoute = (router: Router) => {
    router.use("/", apiConfiguration);
};

const leaderboardRoute = (router: Router) => {
    router.use("/", apiLeaderboard);
};

const emailRoute = (router: Router) => {
    router.use("/", apiEmail);
};

const createRoutes = () => {
    const router = Router() as GroupRouter;

    router.group('/user', userRoute);
    router.group('/plant', plantRoute);
    router.group('/message', messageRoute);
    router.group('/configuration', configurationRoute);
    router.group('/leaderboard', leaderboardRoute);
    router.group('/email', emailRoute);

    return router;
};

export default createRoutes();