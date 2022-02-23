import { Transformation } from "../../ConfigurationManager/PrivacyTactic";
import { UnimplementedError } from "../../Errors/UnimplementedError";
import { ContentRepresentation } from "../ContentRepresentation";
import { EncapsulatedData } from "../EncapsulatedData";
import { TacticParser } from "./TacticParser";

export class XMLParser extends TacticParser {
  parses(): ContentRepresentation {
    return ContentRepresentation.XML;
  }

  parseTactics(data: EncapsulatedData): string {
    throw new UnimplementedError("Method parseTactics not implemented.");
  }
}
