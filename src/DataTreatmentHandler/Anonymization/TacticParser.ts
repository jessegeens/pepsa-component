import {Transformation} from "../../ConfigurationManager/PrivacyTactic";
import {EncapsulatedData} from "../EncapsulatedData";

export abstract class TacticParser {
  abstract parseTactics(data: EncapsulatedData): string;
}
