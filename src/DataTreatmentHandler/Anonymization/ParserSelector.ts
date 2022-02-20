import {ContentRepresentation} from "../ContentRepresentation";
import {EncapsulatedData} from "../EncapsulatedData";
import {JSONParser} from "./JSONParser";
import {XMLParser} from "./XMLParser";

/**
 * The `ParserSelector` component is responsible for forwarding the data it
 * receives to the correct {@link TacticParser}, based on the
 * content-representation of the data.
 */
export class ParserSelector {
  parse(data: EncapsulatedData): string {
    switch (data.contentRepresentation) {
      case ContentRepresentation.JSON:
        return new JSONParser().parseTactics(data);
      case ContentRepresentation.XML:
        return new XMLParser().parseTactics(data);
    }
  }
}
