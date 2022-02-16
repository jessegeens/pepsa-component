import { HttpHandler, HttpHandlerInput } from "@solid/community-server";
export declare class TestHandler extends HttpHandler {
    constructor();
    handle({ request, response }: HttpHandlerInput): Promise<void>;
}
