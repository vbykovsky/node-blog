import http from "http";

import { appController } from "../controllers/app";
import { sequelizeInstance } from "../data-sources/sources/source";

import { RequestMethod, routes } from "./routes";
import { AuthenticatedRequest, Request, getAuthentication, parseQuery } from "./requests";

(async () => {
    await sequelizeInstance.sync();
    
    const server = http.createServer();
    
    server.on("request", async (_req, res) => {
        const req = _req as Request;

        const authentication = await getAuthentication(req);

        req["params"] = {};
        req["query"] =  parseQuery(_req);
        req["authentication"] = authentication;

        if(req.url){
            for(const route of routes){
                const { urlPattern, methods = ["GET"], requireAuth = false, handler } = route;

                const matchers = urlPattern.match(req.url);

                req.params = {
                    ...req.params,
                    ...matchers,
                }

                if(matchers && methods.includes(req.method as RequestMethod)){
                    if(requireAuth && !req.authentication.isAuthenticated){
                        appController.page401(req, res);
                        return;
                    }

                    await handler(req as AuthenticatedRequest, res);
                    return;
                }
            }
        }

        appController.page404(req, res);
    });

    server.listen(8000);

    console.log("Started http server on http://localhost:8000");
})();

