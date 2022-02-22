// TODO: documentation

import { Transformation } from "./PrivacyTactic";

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
  mechanismName: MechanismName;
  value: string;
}

export enum MechanismName {
  FILE_NAME_EXACT = "filenameExact",
  FILE_NAME_CONTAINS = "filenameContains",
  BODY_CONTAINS = "bodyContains",
  CONTAINER_NAME_EXACT = "containernameExact",
}
