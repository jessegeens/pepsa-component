import { Transformation } from "../ConfigurationManager/PrivacyTactic";
import { ContentRepresentation } from "./ContentRepresentation";

/**
 * @interface EncapsulatedData
 *
 * This interface represents raw (untransformed) data encapsulated with a
 * {@link Transformation}, i.e., with a number of {@link PrivacyTacticRule}s.
 */
export interface EncapsulatedData {
  rawData: string;
  contentRepresentation: ContentRepresentation;
  dataScheme: string;
  transformation: Transformation;
}
