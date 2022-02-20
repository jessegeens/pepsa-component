import { getLoggerFor, Logger } from "@solid/community-server";
import { ConfigurationManager } from "../ConfigurationManager/ConfigurationManager";

import { ParserSelector } from "./Anonymization/ParserSelector";
import { DataTreatmentRequest } from "./DataTreatmentRequest";
import { EncapsulatedData } from "./EncapsulatedData";
import { DataSchemeDetector } from "./Preparation/DataSchemeDetector";
import { RuleEncapsulator } from "./Preparation/RuleEncapsulator";

/**
 * The `DataTreatmentHandler` forms the most important part of the application
 * logic: it takes the received data from the {@link OutgoingHTTPHandler}, and
 * passes it through the {@link DataAnonymizer} to apply the right
 * {@link PrivacyTactic}s, after which the transformed data is sent to the
 * requesting application through the {@link IncomingHTTPHandler}.
 */
export class DataTreatmentHandler {
  log: Logger;

  constructor(/*configMgr: ConfigurationManager*/) {
    this.log = getLoggerFor(this);
    //this.log.info("Initialised DataTreatmentHandler");
    //this.configMgr = configMgr;
  }

  async treatData(
    request: DataTreatmentRequest
  ): Promise<DataTreatmentRequest> {
    this.log.warn(`Treating data: ${request.rawData}`);
    return request;
    /*let detector = new DataSchemeDetector();
    let dataScheme = detector.detectDataScheme(
      request.resource,
      request.rawData
    );
    let ruleEncapsulator = new RuleEncapsulator();

    let privacyTactics = ruleEncapsulator.encapsulate(
      dataScheme,
      request.userPreference.privacyPreferences
    );

    let contentRepresentation = detector.getContentRepresentation(dataScheme);

    let data: EncapsulatedData = {
      rawData: request.rawData,
      dataScheme: dataScheme,
      contentRepresentation: contentRepresentation,
      transformation: privacyTactics,
    };

    let parser = new ParserSelector();
    let parsedData = parser.parse(data);
    let responseData: DataTreatmentRequest = {
      treatedData: parsedData,
      rawData: request.rawData,
      timestamp: request.timestamp,
      userPreference: request.userPreference,
      resource: request.resource,
      owner: request.owner,
    };
    return responseData;*/
  }
}
