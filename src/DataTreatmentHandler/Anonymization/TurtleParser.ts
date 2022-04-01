import { UnimplementedError } from "../../Errors/UnimplementedError";
import { ContentRepresentation } from "../ContentRepresentation";
import { PrivacyTacticRule } from "../../ConfigurationManager/PrivacyTactic";
import { EncapsulatedData } from "../EncapsulatedData";
import { TacticParser } from "./TacticParser";
import { guardedStreamFrom } from "@solid/community-server";

export class TurtleParser extends TacticParser {
  parses(): ContentRepresentation {
    return ContentRepresentation.XML;
  }

  async parseTactics(data: EncapsulatedData): Promise<string> {
    let stream = guardedStreamFrom(data.rawData);
    // TODO implement

    throw new UnimplementedError(`TurtleParser has not been implemented yet`);
  }

  constructQuery(tactic: PrivacyTacticRule): string {
    return "";
  }
}
