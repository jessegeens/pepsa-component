import { getLoggerFor, Logger } from "@solid/community-server";
import internal from "stream";
import { ConfigurationManager } from "../ConfigurationManager/ConfigurationManager";
import { NoSuchDataSchemeError } from "../Errors/NoSuchDataSchemeError";
import { stringifyStream } from "../Util";

import { ParserSelector } from "./Anonymization/ParserSelector";
import { DataTreatmentRequest } from "./DataTreatmentRequest";
import { EncapsulatedData } from "./EncapsulatedData";
import { DataSchemeDetector } from "./Preparation/DataSchemeDetector";
import { TacticEncapsulator } from "./Preparation/TacticEncapsulator";

/**
 * The `DataTreatmentHandler` forms the most important part of the application
 * logic: it takes the received data from the {@link AnonymizingHTTPHandler}, and
 * passes it through the {@link DataAnonymizer} to apply the right
 * {@link PrivacyTactic}s, after which the transformed data is sent back.
 */
export class DataTreatmentHandler {
  private readonly log: Logger;
  private readonly configMgr: ConfigurationManager;
  private readonly tacticEncapsulator: TacticEncapsulator;
  private readonly parserSelector: ParserSelector;

  constructor(
    configMgr: ConfigurationManager,
    tacticEncapsulator: TacticEncapsulator,
    parserSelector: ParserSelector
  ) {
    this.log = getLoggerFor(this);
    this.configMgr = configMgr;
    this.tacticEncapsulator = tacticEncapsulator;
    this.parserSelector = parserSelector;
  }

  async treatData(
    request: DataTreatmentRequest
  ): Promise<DataTreatmentRequest> {
    let detector = new DataSchemeDetector(this.configMgr);
    let stringifiedData = await stringifyStream(request.rawData);
    let dataScheme = detector.detectDataScheme(
      request.resource,
      stringifiedData,
      request.userPreference.strict
    );
    // No data scheme found, only possible when in non-strict mode
    // In this case, the raw data can just be returned without modifying it

    if (dataScheme == undefined && !request.userPreference.strict)
      return {
        treatedData: stringifiedData,
        rawData: request.rawData,
        timestamp: request.timestamp,
        userPreference: request.userPreference,
        resource: request.resource,
        owner: request.owner,
      };
    else if (dataScheme == undefined)
      throw new NoSuchDataSchemeError(
        `Could not find data scheme matching requested resource`
      );
    this.log.info(`Detected datascheme: ${dataScheme}`);

    let privacyTactics = this.tacticEncapsulator.encapsulate(
      dataScheme,
      request.userPreference.privacyPreferences
    );

    let contentRepresentation = detector.getContentRepresentation(dataScheme);

    let data: EncapsulatedData = {
      rawData: stringifiedData,
      dataScheme: dataScheme,
      contentRepresentation: contentRepresentation,
      transformation: privacyTactics,
    };

    let parsedData = this.parserSelector.parse(data);
    let responseData: DataTreatmentRequest = {
      treatedData: parsedData,
      rawData: request.rawData,
      timestamp: request.timestamp,
      userPreference: request.userPreference,
      resource: request.resource,
      owner: request.owner,
    };
    return responseData;
  }
}
