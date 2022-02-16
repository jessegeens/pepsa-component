import {
    getLoggerFor,
    HttpHandler,
    HttpHandlerInput,
  } from "@solid/community-server";
  
  export class TestHandler extends HttpHandler {
    //private readonly config: RootConfiguration;
  
    public constructor(/*config: RootConfiguration*/) {
      super();
      //this.config = config;
    }
  
    public async handle({request, response}: HttpHandlerInput): Promise<void> {
      let logger = getLoggerFor(this);
      logger.warn(`AnonymizationHandler called on request: ${request.method}`);
    }
  }
  