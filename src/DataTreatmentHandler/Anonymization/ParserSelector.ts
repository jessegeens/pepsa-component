import { getLoggerFor, Logger } from "@solid/community-server";
import { UnsupportedContentRepresentationError } from "../../Errors/UnsupportedContentRepresentationError";
import { ContentRepresentation } from "../ContentRepresentation";
import { EncapsulatedData } from "../EncapsulatedData";
import { TacticParser } from "./TacticParser";

/**
 * The `ParserSelector` component is responsible for forwarding the data it
 * receives to the correct {@link TacticParser}, based on the
 * content-representation of the data.
 */
export class ParserSelector {
  private readonly parsers: TacticParser[];
  private readonly log: Logger;

  constructor(parsers: TacticParser[]) {
    this.parsers = parsers;
    this.log = getLoggerFor(this);
  }

  async parse(data: EncapsulatedData): Promise<string> {
    for (let parser of this.parsers) {
      if (parser.parses() == data.contentRepresentation)
        return await parser.parseTactics(data);
    }
    throw new UnsupportedContentRepresentationError(
      `No parser installed for content-representation ${data.contentRepresentation}`
    );
  }
}
