import http from "http";

import { appController } from "../controllers/app";
import { sequelizeInstance } from "../data-sources/sources/source";

import { routes } from "./routes";
import { Request, getAuthentication, getQuery } from "./requests";

(async () => {
    await sequelizeInstance.sync();
    
    const server = http.createServer();
    
    server.on("request", async (_req, res) => {
        const req = _req as Request;

        const authentication = await getAuthentication(req);

        req["params"] = {};
        req["query"] =  getQuery(_req);
        req["authentication"] = authentication;

        if(req.url){
            for(const route of routes){
                const { urlPattern, handler } = route;

                const matchers = urlPattern.match(req.url);

                req.params = {
                    ...req.params,
                    ...matchers,
                }

                if(matchers){
                    await handler(req, res);
                    return;
                }
            }
        }

        res.end(appController.page404(req, res));
    });

    server.listen(8000);

    console.log("Started http server on http://localhost:8000");
})();

