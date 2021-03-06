import {
  getLoggerFor,
  Logger,
  ResourceIdentifier,
  ResourceStore,
} from "@solid/community-server";
import { stringifyStream } from "../Util";
import { UserPreference } from "./UserPreference";

export class UserPreferenceStore {
  private readonly log: Logger;
  private readonly resourcestore: ResourceStore;
  private webidMap: Map<String, UserPreference | "None">;

  constructor(rs: ResourceStore) {
    this.log = getLoggerFor(this);
    this.webidMap = new Map();
    this.resourcestore = rs;
  }

  hasPreferences(webid: String): boolean | "unknown" {
    if (this.webidMap.has(webid)) {
      if (this.webidMap.get(webid) == "None") return false;
      return true;
    } else return "unknown";
  }

  async getPreference(webid: String): Promise<UserPreference | undefined> {
    if (this.hasPreferences(webid) == true)
      return this.webidMap.get(webid) as UserPreference;
    let identifier: ResourceIdentifier = {
      path: webid.replace("card#me", "pepsa.json"),
    };
    try {
      let prefsRep = await this.resourcestore.getRepresentation(identifier, {});
      let prefs = await stringifyStream(prefsRep.data);
      let userPreference = JSON.parse(prefs) as UserPreference;
      this.webidMap.set(webid, userPreference);
      this.log.info(`Found preferences of ${webid}`);
      return userPreference;
    } catch (e) {
      if (typeof e == "object")
        this.log.info(
          `Did not find preferences of ${webid}, error is ${e?.toString()}`
        );
      this.webidMap.set(webid, "None");
      return undefined;
    }
  }
}
