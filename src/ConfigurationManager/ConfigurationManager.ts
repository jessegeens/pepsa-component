import { getLoggerFor, Logger } from "@solid/community-server";
import { FileError } from "../Errors/FileError";
import { SchemaValidationError } from "../Errors/SchemaValidationError";
import { UserConfig, UserPreference } from "./UserPreference";
import { SchemeRule } from "./SchemeRule";
import schema from "json-schema";
import { UserPreferenceStore } from "./UserPreferenceStore";

/**
 * The ConfigurationManager is a class responsible for parsing and storing all
 * user-configurable parts of PePSA, such as privacy preferences, scheme rules
 * and software configuration.
 */
export class ConfigurationManager {
  private rootSchemaPath: string;
  private detectionSchemaPath: string;
  private config?: UserPreference[];
  private rules: SchemeRule[] = [];
  private userPrefStore: UserPreferenceStore;
  private log: Logger;

  /**
   * Get the SchemeRules currently loaded in to the ConfigurationManager
   *
   * @returns A list of `SchemeRule`s that determine how to detect a data scheme
   * and what transformations to apply to it
   */
  getSchemeRules(): SchemeRule[] {
    return this.rules;
  }

  async getPreferenceOf(webId: String): Promise<UserPreference | undefined> {
    return this.userPrefStore.getPreference(webId);
    /*if (this.config == undefined) return undefined;
    let arr = (this.config as Array<UserPreference>).filter(
      (up) => up.webId == webId
    );
    return arr.length > 0 ? arr[0] : undefined;*/
  }

  constructor(
    rootScheme: string,
    detectionScheme: string,
    schemeRules: string,
    ups: UserPreferenceStore
  ) {
    this.log = getLoggerFor(this);
    this.rootSchemaPath = rootScheme;
    this.detectionSchemaPath = detectionScheme;
    this.loadConfigurations(schemeRules);
    this.userPrefStore = ups;
  }

  /**
   * This method loads the scheme detection files into the class.
   * @param `detectionFilePath` the path of the folder containing the config
   * files for detection of data schemes, usually "../config/scheme_detection"
   */
  loadConfigurations(detectionFilesPath: string) {
    const fs = require("fs");
    const path = require("path");

    /** Use `path.resolve(__dirname, "path/")` here because `fs.readFileSync`
     * is not file relative, see
     * https://stackoverflow.com/questions/44600943/fs-readfilesync-is-not-file-relative-node-js/44601028
     */

    // Read detection config files
    const absDetectionFilesPath = path.resolve(__dirname, detectionFilesPath);
    const detectionSchema = fs.readFileSync(
      path.resolve(__dirname, this.detectionSchemaPath)
    );
    let fileArr = fs.readdirSync(absDetectionFilesPath);
    if (fileArr === undefined)
      throw new FileError(
        `Directory not found: ${absDetectionFilesPath}`,
        absDetectionFilesPath
      );
    fileArr.forEach((file: string) => {
      const rawData = fs.readFileSync(
        path.resolve(absDetectionFilesPath, file)
      );
      if (schema.validate(rawData, detectionSchema).valid) {
        let rule: SchemeRule = JSON.parse(rawData);
        //log?.info(`Registered scheme rule: ${rule.schemeName}`);
        this.rules.push(rule);
      } else {
        throw new SchemaValidationError(
          `Scheme detector ${file} does not adhere to schema ${this.detectionSchemaPath}`
        );
      }
    });
  }
}
