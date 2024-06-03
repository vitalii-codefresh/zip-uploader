import {Server} from "../server/Server";
import {RoutesConfigurator} from "../server/RoutesConfigurator";
import {UploadService} from "../services/upload-service/UploadService";

export class Bootstraper {
    configure(){
        const uploadService = new UploadService();
        const router = new RoutesConfigurator(uploadService).getRouter();
        const server = new Server(router);
        server.start();
    }
}
