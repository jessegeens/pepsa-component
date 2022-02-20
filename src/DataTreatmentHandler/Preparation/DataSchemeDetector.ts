import { ConfigurationManager } from "../../ConfigurationManager/ConfigurationManager";
import { SchemeRule } from "../../ConfigurationManager/SchemeRule";
import { NoSuchDataSchemeError } from "../../Errors/NoSuchDataSchemeError";
import { UnsupportedContentRepresentationError } from "../../Errors/UnsupportedContentRepresentationError";
import { ContentRepresentation } from "../ContentRepresentation";

/**
 * The `DataSchemeDetector` is the component responsible for taking in raw data,
 * and then (using a set of {@link SchemeDetectionRule}s), determining which
 * scheme the data uses.
 */
export class DataSchemeDetector {
  configMgr: ConfigurationManager;

  constructor(cfgMgr: ConfigurationManager) {
    this.configMgr = cfgMgr;
  }

  detectDataScheme(resourceName: string, rawData: string): string {
    let loadedRules: SchemeRule[] = this.configMgr.getSchemeRules();
    for (let schemeRule of loadedRules) {
      let mechanism = schemeRule.detector.mechanism;
      switch (mechanism.mechanismName) {
        case "filenameExact":
          if (resourceName.split("/").slice(-1)[0] === mechanism.value)
            return mechanism.mechanismName;
          break;
        case "filenameContains":
          if (resourceName.includes(mechanism.value))
            return mechanism.mechanismName;
          break;
        case "bodyContains":
          if (rawData.includes(mechanism.value)) return mechanism.mechanismName;
          break;
      }
    }
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
