import { getLoggerFor, NotImplementedHttpError, OkResponseDescription, OperationHandler, OperationHandlerInput, ResourceStore, ResponseDescription } from "@solid/community-server";

/**
 * Handles GET {@link Operation}s.
 * Calls the getRepresentation function from a {@link ResourceStore}.
 */
export class GetOperationHandler extends OperationHandler {
  private readonly store: ResourceStore;

  public constructor(store: ResourceStore) {
    super();
    this.store = store;
  }

  public async canHandle({ operation }: OperationHandlerInput): Promise<void> {
    if (operation.method !== 'GET') {
      throw new NotImplementedHttpError('This handler only supports GET operations');
    }
  }

  public async handle({ operation }: OperationHandlerInput): Promise<ResponseDescription> {
    const body = await this.store.getRepresentation(operation.target, operation.preferences, operation.conditions);
    const logger = getLoggerFor(this);
    logger.warn(`Running GETOperationHandler`);
    const { data, metadata } = body;
    const meta = metadata.identifier;
    logger.warn(`Metadata is ${meta.value}`);
    return new OkResponseDescription(metadata, data);
  }
}
