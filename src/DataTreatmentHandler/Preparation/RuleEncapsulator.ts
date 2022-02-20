import { ConfigurationManager } from "../../ConfigurationManager/ConfigurationManager";
import { PrivacyPreferences } from "../../ConfigurationManager/PrivacyPreferences";
import { Transformation } from "../../ConfigurationManager/PrivacyTactic";
import { UserPreference } from "../../ConfigurationManager/UserPreference";
import { NoSuchDataSchemeError } from "../../Errors/NoSuchDataSchemeError";
import { NoRulesForSchemeError } from "../../Errors/NoRulesForLevelError";
import { UnimplementedError } from "../../Errors/UnimplementedError";

/**
 * The RuleEncapsulator is responsible for asking the {@link ConfigurationManager}
 * which  privacy level corresponds to the given DataType. Then, it asks the
 * ConfigurationManager for a List of {@link PrivacyTactic}s, which specify how
 * the given  data should be treated. Finally, an encapsulation datatype is
 * constructed that  contains all necessary information for the correct
 * {@link TacticParser} to complete its work.
 */
export class RuleEncapsulator {
  configMgr: ConfigurationManager;

  constructor() {
    // TODO use dependency injection here
    this.configMgr = new ConfigurationManager();
  }

  encapsulate(
    dataScheme: string,
    privacyPrefs: PrivacyPreferences
  ): Transformation {
    let privacyLevel = Array.from(privacyPrefs.schemes.keys()).includes(
      dataScheme
    )
      ? privacyPrefs.schemes.get(dataScheme)!
      : privacyPrefs.default;
    let schemeRules = this.configMgr
      .getSchemeRules()
      .find((rule) => rule.schemeName == dataScheme);
    if (schemeRules === undefined)
      throw new NoSuchDataSchemeError(
        `No scheme rules have been loaded for dataScheme${dataScheme}`
      );
    let transformation = schemeRules.transformations.find(
      (transformation) => transformation.level == privacyLevel
    );
    if (transformation === undefined)
      throw new NoRulesForSchemeError(
        `In scheme ${dataScheme}, no rules have been defined for level ${privacyLevel}`
      );
    throw new UnimplementedError("encapsulate is not implemented");
  }
}
