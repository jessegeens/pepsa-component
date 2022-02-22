export interface Transformation {
  level: number;
  tactics: PrivacyTacticRule[];
}

export interface PrivacyTacticRule {
  field: string;
  transformation: PrivacyTactic;
}

/**
 * The `PrivacyTactic` is an abstract datatype that encapsulates all information
 * necessary to perform some transformation on the input data. It does not
 * perform this operation itself, since the implementation differs based on the
 * content-representation of the data.
 *
 * The actual transformations are done by the {@link TacticParser}
 */
export type PrivacyTactic = {
  transformationName: TransformationName;
  pseudonym?: string;
  equalsCondition: string[];
  aggregationBounds: number;
};

export type TransformationName =
  | "remove"
  | "pseudonymization"
  | "numAggregation"
  | "strAggregation"
  | "random";
