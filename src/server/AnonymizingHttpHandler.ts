import {
  Authorizer,
  AuthorizingHttpHandlerArgs,
  CredentialSet,
  CredentialsExtractor,
  getLoggerFor,
  Guarded,
  guardedStreamFrom,
  ModesExtractor,
  OkResponseDescription,
  OperationHttpHandler,
  OperationHttpHandlerInput,
  PermissionReader,
  RepresentationMetadata,
  ResponseDescription,
} from "@solid/community-server";
import internal from "stream";
import { ConfigurationManager } from "../ConfigurationManager/ConfigurationManager";
import { DataTreatmentHandler } from "../DataTreatmentHandler/DataTreatmentHandler";
export interface AnonymizingHttpHandlerArgs {
  /**
   * Extracts the credentials from the incoming request.
   */
  credentialsExtractor: CredentialsExtractor;
  /**
   * Extracts the required modes from the generated Operation.
   */
  modesExtractor: ModesExtractor;
  /**
   * Reads the permissions available for the Operation.
   */
  permissionReader: PermissionReader;
  /**
   * Verifies if the requested operation is allowed.
   */
  authorizer: Authorizer;
  /**
   * Handler to call if the operation is authorized.
   */
  operationHandler: OperationHttpHandler;
  /**
   * Handler to call to perform privacy-enhancing transformations on the data
   */
  dataTreatmentHandler: DataTreatmentHandler;
  /**
   *
   */
  configurationManager: ConfigurationManager;
}

/**
 * Handles all the necessary steps for an authorization.
 * Errors if authorization fails, otherwise passes the parameter to the operationHandler handler.
 * The following steps are executed:
 *  - Extracting credentials from the request.
 *  - Extracting the required permissions.
 *  - Reading the allowed permissions for the credentials.
 *  - Validating if this operation is allowed.
 */
export class AnonymizingHttpHandler extends OperationHttpHandler {
  private readonly logger = getLoggerFor(this);

  private readonly credentialsExtractor: CredentialsExtractor;
  private readonly modesExtractor: ModesExtractor;
  private readonly permissionReader: PermissionReader;
  private readonly authorizer: Authorizer;
  private readonly operationHandler: OperationHttpHandler;
  private readonly dataTreatmentHandler: DataTreatmentHandler;
  private readonly configurationManager: ConfigurationManager;

  public constructor(args: AnonymizingHttpHandlerArgs) {
    super();
    this.credentialsExtractor = args.credentialsExtractor;
    this.modesExtractor = args.modesExtractor;
    this.permissionReader = args.permissionReader;
    this.authorizer = args.authorizer;
    this.operationHandler = args.operationHandler;
    this.dataTreatmentHandler = args.dataTreatmentHandler;
    this.configurationManager = args.configurationManager;
  }

  public async handle(
    input: OperationHttpHandlerInput
  ): Promise<ResponseDescription | undefined> {
    this.logger.warn("Injection success!");
    const { request, operation } = input;
    const credentials: CredentialSet =
      await this.credentialsExtractor.handleSafe(request);
    this.logger.verbose(
      `Extracted credentials: ${JSON.stringify(credentials)}`
    );

    const modes = await this.modesExtractor.handleSafe(operation);
    this.logger.verbose(`Required modes are read: ${[...modes].join(",")}`);

    const permissionSet = await this.permissionReader.handleSafe({
      credentials,
      identifier: operation.target,
    });
    this.logger.verbose(
      `Available permissions are ${JSON.stringify(permissionSet)}`
    );

    try {
      await this.authorizer.handleSafe({
        credentials,
        identifier: operation.target,
        modes,
        permissionSet,
      });
      operation.permissionSet = permissionSet;
    } catch (error: unknown) {
      this.logger.verbose(`Authorization failed: ${(error as any).message}`);
      throw error;
    }

    this.logger.verbose(`Authorization succeeded, calling source handler`);

    let resource = this.operationHandler.handleSafe(input);

    if (
      operation.method == "GET" &&
      credentials.agent != undefined &&
      credentials.agent.webId != undefined
    ) {
      let res = await resource;
      if (res == undefined || res.data == undefined) return resource;
      if (res.statusCode != 200) return resource;
      let userPreference = await this.configurationManager.getPreferenceOf(
        credentials.agent.webId
      );
      // User is not registered to use PePSA middleware
      if (userPreference == undefined) return resource;
      //let data = "censored-data\n";
      let syncResource = await resource;

      if (syncResource?.data == undefined) return resource;

      this.logger.info(
        `Intercepting data request for user ${credentials.agent.webId} for file ${operation.target.path}`
      );
      let dataResponse = await this.dataTreatmentHandler.treatData({
        rawData: syncResource.data,
        owner: credentials.agent.webId,
        resource: operation.target.path,
        timestamp: Date.now(),
        userPreference: userPreference,
      });
      if (dataResponse.treatedData == undefined) return resource;
      let gs: Guarded<internal.Readable> = guardedStreamFrom(
        dataResponse.treatedData,
        {}
      );
      return new OkResponseDescription(
        res.metadata ?? new RepresentationMetadata(),
        gs
      );
    }

    return resource;
  }
}
