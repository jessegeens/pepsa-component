import { Transformation } from "../ConfigurationManager/PrivacyTactic";
import { ContentRepresentation } from "./ContentRepresentation";

export interface EncapsulatedData {
  rawData: string;
  contentRepresentation: ContentRepresentation;
  dataScheme: string;
  transformation: Transformation;
}
