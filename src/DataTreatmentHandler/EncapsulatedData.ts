import {Transformation} from "../ConfigurationManager/PrivacyTactic";
import {ContentRepresentation} from "./ContentRepresentation";

export interface EncapsulatedData {
  rawData: String;
  contentRepresentation: ContentRepresentation;
  dataScheme: String;
  transformation: Transformation;
}
