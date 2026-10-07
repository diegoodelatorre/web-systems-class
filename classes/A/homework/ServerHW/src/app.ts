import { Server } from "./server";
import dotenv from "dotenv";
import routes from "./routes/index";
dotenv.config();

const port = Number(process.env.PORT) || 3000;

function main() {
    const server = new Server({ port, routes });
    server.start();
}

main();