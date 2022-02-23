import { getLoggerFor, Logger } from "@solid/community-server";
import internal from "stream";
import { ConfigurationManager } from "../ConfigurationManager/ConfigurationManager";
import { NoSuchDataSchemeError } from "../Errors/NoSuchDataSchemeError";

import { ParserSelector } from "./Anonymization/ParserSelector";
import { DataTreatmentRequest } from "./DataTreatmentRequest";
import { EncapsulatedData } from "./EncapsulatedData";
import { DataSchemeDetector } from "./Preparation/DataSchemeDetector";
import { RuleEncapsulator } from "./Preparation/RuleEncapsulator";

/**
 * The `DataTreatmentHandler` forms the most important part of the application
 * logic: it takes the received data from the {@link AnonymizingHTTPHandler}, and
 * passes it through the {@link DataAnonymizer} to apply the right
 * {@link PrivacyTactic}s, after which the transformed data is sent back.
 */
export class DataTreatmentHandler {
  private readonly log: Logger;
  private readonly configMgr: ConfigurationManager;
  private readonly ruleEncapsulator: RuleEncapsulator;
  private readonly parserSelector: ParserSelector;

  constructor(
    configMgr: ConfigurationManager,
    ruleEncapsulator: RuleEncapsulator,
    parserSelector: ParserSelector
  ) {
    this.log = getLoggerFor(this);
    this.configMgr = configMgr;
    this.ruleEncapsulator = ruleEncapsulator;
    this.parserSelector = parserSelector;
  }

  async treatData(
    request: DataTreatmentRequest
  ): Promise<DataTreatmentRequest> {
    let detector = new DataSchemeDetector(this.configMgr);
    let stringifiedData = await this.stringifyStream(request.rawData);
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

    let privacyTactics = this.ruleEncapsulator.encapsulate(
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

  /**
   * Turns the given readable stream asynchronously into a string
   *
   * @param {internal.Readable} stream  stream to turn into a string
   * @returns {Promise<string>} String formed by concatenating all elements
   * of the stream, until it is ended
   */
  async stringifyStream(stream: internal.Readable): Promise<string> {
    const chunks: Buffer[] = [];
    return new Promise((resolve, reject) => {
      stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on("error", (err) => reject(err));
      stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    });
  }
}
