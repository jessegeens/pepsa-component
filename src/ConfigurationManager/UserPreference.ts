import { PrivacyPreferences } from "./PrivacyPreferences";
import {
  UnsupportedContentRepresentationError,
  NoSuchDataSchemeError,
} from "../Errors/Errors";

/**
 * Describes the preferences of a single user
 *
 * @interface UserPreference
 * @field {string} `incomingWebId` contains a URI on which the server should listen
 * to incoming requests
 * @field {boolean} `strict` if `true` then data for which no data scheme or
 * content representation is found will not be exported, instead a {@link NoSuchDataSchemeError}
 * or {@link UnsupportedContentRepresentationError} will be thrown
 * @field {PrivacyPreferences} `privacyPreferences` contains the user's
 * {@link PrivacyPreferences}
 */
export interface UserPreference {
  webId: string;
  strict: boolean;
  privacyPreferences: PrivacyPreferences;
}

export interface UserConfig {
  userPreferences: UserPreference[];
}
