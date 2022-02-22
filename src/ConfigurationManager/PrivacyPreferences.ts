/**
 * Describes the privacy settings of the user, i.e. which privacy levels are
 * requested
 *
 * @interface PrivacyPreferences
 * @field {number} `default` determines the default privacy level the user wishes
 * to use
 * @field {Map<string, number>} `schemes` contains exceptions to the default
 * and is specified by a map that maps field names to privacy levels
 */
export interface PrivacyPreferences {
  default: number;
  schemes: Map<string, number>;
}
