import { EncapsulatedData } from "../EncapsulatedData";
import { TacticParser } from "./TacticParser";
import { PrivacyTacticRule } from "../../ConfigurationManager/PrivacyTactic";
import { InvalidRuleError } from "../../Errors/InvalidRuleError";
import { UnimplementedError } from "../../Errors/UnimplementedError";
import jp from "jsonpath";

export class JSONParser extends TacticParser {
  parseTactics(data: EncapsulatedData): string {
    let concreteTactics: PrivacyTacticRule[] = data.transformation.tactics;
    let parsedData: object = JSON.parse(data.rawData);
    let entries: [string, any][] = Object.entries(parsedData);
    for (let rule of concreteTactics) {
      this.log.info(`Parsing rule for ${rule.field}`);
      let field = rule.field;
      if (entries.map(([k, _]) => k).includes(field)) {
        let idx = entries.map(([k, _]) => k).indexOf(field);
        let val = this.parseRule(entries[idx][1], rule);
        if (val == undefined) entries.splice(idx);
        else entries[idx] = [entries[idx][0], val];
      }
    }
    return JSON.stringify(Object.fromEntries(entries));
  }

  parseRule(value: any, rule: PrivacyTacticRule): any {
    switch (rule.transformation.transformationName) {
      case "pseudonymization":
        return rule.transformation.pseudonym;
      case "remove":
        return undefined;
      case "random":
        return this.randomString(8);
      case "numAggregation":
        if (!(typeof value === "number"))
          throw new InvalidRuleError(
            `Cannot perform numerical aggregation on value of type ${typeof value}`
          );
        if (rule.transformation.aggregationBounds == 0) return 0;
        return this.valueInBounds(value, rule.transformation.aggregationBounds);
      case "strAggregation":
        throw new UnimplementedError(
          "String aggregation is not implemented yet"
        );
    }
  }
}
