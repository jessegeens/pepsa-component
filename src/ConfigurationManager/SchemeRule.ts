// TODO: documentation

import {Transformation} from "./PrivacyTactic";

export interface SchemeRule {
  schemeName: string;
  detector: SchemeDetector;
  transformations: Transformation[];
}

export interface SchemeDetector {
  contentRepresentation: string;
  scheme: string;
  mechanism: DetectionMechanism;
}

export interface DetectionMechanism {
  mechanismName: string;
  value: string;
}
