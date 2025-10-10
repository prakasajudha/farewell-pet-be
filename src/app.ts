import "module-alias/register";
import "express-async-errors";
import express from "express";
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import { APP_ENV, ORIGIN, APP_PORT } from "./config/config";
import { connection } from "./lib/database";
import multer from 'multer';
import routes from "./api/routes";

const initializeDatabase = async () => {
    try {
        if (!connection.isInitialized) {
            await connection.initialize();
            console.log("Database connection has been initialized!");
        }
    } catch (err) {
        console.error("Error during database connection:", err);
        process.exit(1);
    }
};

const multerMiddleware = multer({
    storage: multer.memoryStorage()
});

const app = express();
const allowedOrigin: Array<string> = ORIGIN.split(',');

// Express configuration
app.set("port", APP_PORT);
app.set("env", APP_ENV);
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(compression());
app.use(multerMiddleware.single('file'));
app.use((req, res, next) => {
    bodyParser.json()(req, res, err => {
        if (err) {
            console.error("Bad request. Please make sure the payload is valid JSON.");
            return res.sendStatus(400);
        }
        next();
    });
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.raw({ type: "application/vnd.api+json" }));
app.use(bodyParser.text({ type: "text/html" }));

// Initialize database before registering routes
initializeDatabase().then(() => {
    // Register router
    routes.configure(app);
    // Handling 404
});

export default app;