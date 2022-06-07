import xml2js from "xml2js";
import { ContentRepresentation } from "../ContentRepresentation";
import { EncapsulatedData } from "../EncapsulatedData";
import { TacticParser } from "./TacticParser";
import { JSONParser } from "./JSONParser";

export class XMLParser extends TacticParser {
  parses(): ContentRepresentation {
    return ContentRepresentation.XML;
  }

  async parseTactics(data: EncapsulatedData): Promise<string> {
    //let cleanedData = data.replace("\ufeff", "");
    let parsedData: object = await xml2js.parseStringPromise(data.rawData);
    this.log.warn(`Parsed JSON: ${JSON.stringify(parsedData)}`);
    let parsedJson = await new JSONParser().parseTactics({
      dataScheme: data.dataScheme,
      contentRepresentation: ContentRepresentation.JSON,
      transformation: data.transformation,
      rawData: JSON.stringify(parsedData),
    });

    let builder = new xml2js.Builder();
    return builder.buildObject(JSON.parse(parsedJson));
  }
}
