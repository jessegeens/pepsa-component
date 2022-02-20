import {Transformation} from "../../ConfigurationManager/PrivacyTactic";
import {UnimplementedError} from "../../Errors/UnimplementedError";
import {EncapsulatedData} from "../EncapsulatedData";
import {TacticParser} from "./TacticParser";

export class XMLParser extends TacticParser {
  parseTactics(data: EncapsulatedData): string {
    throw new UnimplementedError("Method parseTactics not implemented.");
  }
}
