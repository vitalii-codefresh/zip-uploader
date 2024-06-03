import express, {Express, Router} from 'express'
import {ILogger} from "../../libs/logger/ILogger";
import {Logger} from "../../libs/logger/Logger";

export class Server {
    private readonly _logger: ILogger;
    private readonly _port: number;
    private readonly _server: Express;
    private _router: Router;

    constructor(router: Router) {
        this._logger = new Logger("Server");
        this._server = express();
        this._port = Number(process.env.PORT) || 3000;
        this._router = router;
    }

    async start(){
        this._server.use(this._router);
        this._server.listen(this._port);
        this._logger.info("Server started on port " + this._port);
    }


}
