import { PrivacyPreferences } from "./PrivacyPreferences";

/**
 * Describes the preferences of a single user
 *
 * @interface UserPreference
 * @field {string} `incomingWebId` contains a URI on which the server should listen
 * to incoming requests
 * @field {string} `forwardWebId` contains a URI to which requests are forwarded
 * to retrieve data
 * @field {string} `username` the user's username to authenticate himself on the
 * solid server specified by `forwardWebId`
 * @field {string} `password` the user's password to authenticate himself on the
 * solid server specified by `forwardWebId`
 * @field {PrivacyPreferences} `privacyPreferences` contains the user's
 * {@link PrivacyPreferences}
 */
export interface UserPreference {
  webId: string;
  privacyPreferences: PrivacyPreferences;
}

export interface UserConfig {
  userPreferences: UserPreference[];
}
