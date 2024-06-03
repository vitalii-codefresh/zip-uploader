import log4js from "log4js";
import {ILogger} from "./ILogger";

export class Logger implements ILogger {
    private readonly _logger: log4js.Logger;

    constructor (name: string) {
        log4js.configure({
            appenders: {console: {type: "console"}},
            categories: {default: {appenders: ["console"], level: "info" }}
        });
        this._logger = log4js.getLogger(name);
    }

    info(message: string): void {
        this._logger.info(message);
    }

    error(message: string): void {
        this._logger.error(message);
    }

    warn(message: string): void {
        this._logger.warn(message);
    }
}
