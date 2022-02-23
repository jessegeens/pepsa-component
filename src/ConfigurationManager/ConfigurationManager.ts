import { getLoggerFor, Logger } from "@solid/community-server";
import { FileError } from "../Errors/FileError";
import { SchemaValidationError } from "../Errors/SchemaValidationError";
import { UserConfig, UserPreference } from "./UserPreference";
import { SchemeRule } from "./SchemeRule";
import schema from "json-schema";

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

  getPreferenceOf(webId: String): UserPreference | undefined {
    if (this.config == undefined) return undefined;
    let arr = (this.config as Array<UserPreference>).filter(
      (up) => up.webId == webId
    );
    return arr.length > 0 ? arr[0] : undefined;
  }

  constructor(
    rootScheme: string,
    detectionScheme: string,
    rootConfig: string,
    schemeRules: string
  ) {
    this.log = getLoggerFor(this);
    this.rootSchemaPath = rootScheme;
    this.detectionSchemaPath = detectionScheme;
    this.loadConfigurations(rootConfig, schemeRules);
  }

  /**
   * This method loads the configuration files into the class.
   * @param `rootFilePath` the path of the root configuration file, usually
   * "../config/config.json"
   * @param `detectionFilePath` the path of the folder containing the config
   * files for detection of data schemes, usually "../config/scheme_detection"
   */
  loadConfigurations(rootFilePath: string, detectionFilesPath: string) {
    const fs = require("fs");
    const path = require("path");
    //let v = new schema.validate
    //const log = getLoggerFor(this);

    /** Use `path.resolve(__dirname, "path/")` here because `fs.readFileSync`
     * is not file relative, see
     * https://stackoverflow.com/questions/44600943/fs-readfilesync-is-not-file-relative-node-js/44601028
     */

    // Read root configuration
    try {
      const rawRootData = fs.readFileSync(
        path.resolve(__dirname, rootFilePath)
      );
      const rootSchema = fs.readFileSync(
        path.resolve(__dirname, this.rootSchemaPath)
      );

      if (schema.validate(rawRootData, rootSchema).valid) {
        let cfg: UserConfig = JSON.parse(rawRootData);
        this.config = cfg.userPreferences;
      } else {
        throw new SchemaValidationError(
          `Root configuration file ${rootFilePath} 
        does not adhere to schema ${this.rootSchemaPath}: ${
            schema.validate(rawRootData, rootSchema).errors
          }`
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error) throw new FileError(err.message, rootFilePath);
      else
        throw new FileError(
          `An unknown error has occured while trying to read the root config file at ${path.resolve(
            __dirname,
            rootFilePath
          )}: ${err}`,
          rootFilePath
        );
    }

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
