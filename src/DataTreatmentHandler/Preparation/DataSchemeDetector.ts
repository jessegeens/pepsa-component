import { getLoggerFor, Logger } from "@solid/community-server";
import { ConfigurationManager } from "../../ConfigurationManager/ConfigurationManager";
import {
  DetectionMechanism,
  MechanismName,
  SchemeRule,
} from "../../ConfigurationManager/SchemeRule";
import { NoSuchDataSchemeError } from "../../Errors/NoSuchDataSchemeError";
import { UnsupportedContentRepresentationError } from "../../Errors/UnsupportedContentRepresentationError";
import { ContentRepresentation } from "../ContentRepresentation";

/**
 * The `DataSchemeDetector` is the component responsible for taking in raw data,
 * and then (using a set of {@link SchemeRule}s), determining which
 * scheme the data uses.
 */
export class DataSchemeDetector {
  private readonly configMgr: ConfigurationManager;
  private readonly log: Logger;

  constructor(cfgMgr: ConfigurationManager) {
    this.configMgr = cfgMgr;
    this.log = getLoggerFor(this);
  }

  detectDataScheme(
    resourceName: string,
    rawData: string,
    strict: boolean
  ): string | undefined {
    let loadedRules: SchemeRule[] = this.configMgr.getSchemeRules();
    for (let schemeRule of loadedRules) {
      let mechanism = schemeRule.detector.mechanism;
      switch (mechanism.mechanismName) {
        case MechanismName.FILE_NAME_EXACT:
          if (
            mechanism.value.includes("/") &&
            resourceName.endsWith("/" + mechanism.value)
          )
            return schemeRule.schemeName;
          if (resourceName.split("/").slice(-1)[0] === mechanism.value)
            return schemeRule.schemeName;
          break;
        case MechanismName.FILE_NAME_CONTAINS:
          if (resourceName.includes(mechanism.value))
            return schemeRule.schemeName;
          break;
        case MechanismName.BODY_CONTAINS:
          if (rawData.includes(mechanism.value)) return schemeRule.schemeName;
          break;
        case MechanismName.CONTAINER_NAME_EXACT:
          if (resourceName.split("/").includes(mechanism.value))
            return schemeRule.schemeName;
          break;
      }
    }
    if (!strict) return undefined;
    throw new NoSuchDataSchemeError(
      `Could not detect data scheme for resouce ${resourceName}`
    );
  }

  getContentRepresentation(dataScheme: string): ContentRepresentation {
    let contentRepresentation = this.configMgr
      .getSchemeRules()
      .find((schemeRule) => schemeRule.schemeName === dataScheme)
      ?.detector.contentRepresentation;
    if (contentRepresentation === undefined)
      throw new NoSuchDataSchemeError(
        `Datascheme ${dataScheme} has not been configured while trying to get its content-representation`
      );
    switch (contentRepresentation.toUpperCase()) {
      case "XML":
        return ContentRepresentation.XML;
      case "JSON":
        return ContentRepresentation.JSON;
      default:
        throw new UnsupportedContentRepresentationError(
          `Content-representation ${contentRepresentation} is not supported`
        );
    }
  }
}
