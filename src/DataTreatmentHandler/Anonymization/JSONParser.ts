import { EncapsulatedData } from "../EncapsulatedData";
import { TacticParser } from "./TacticParser";
import {
  PrivacyTactic,
  PrivacyTacticRule,
} from "../../ConfigurationManager/PrivacyTactic";
import { InvalidRuleError } from "../../Errors/InvalidRuleError";
import jp from "jsonpath";
import { createHash, randomBytes, createCipheriv } from "crypto";
import { ContentRepresentation } from "../ContentRepresentation";

export type JSONType =
  | string
  | number
  | boolean
  | Object
  | Array<JSONType>
  | undefined;
export class JSONParser extends TacticParser {
  parses(): ContentRepresentation {
    return ContentRepresentation.JSON;
  }

  async parseTactics(data: EncapsulatedData): Promise<string> {
    let concreteTactics: PrivacyTacticRule[] = data.transformation.tactics;
    let parsedData: object = JSON.parse(data.rawData);

    for (let rule of concreteTactics) {
      this.log.verbose(
        `Parsing rule ${rule.transformation} for field ${rule.field}`
      );
      jp.apply(
        parsedData,
        rule.field,
        this.getMatchingFunc(rule.transformation)
      );
    }
    return JSON.stringify(parsedData);
  }

  getMatchingFunc(tactic: PrivacyTactic): (val: JSONType) => JSONType {
    switch (tactic.transformationName) {
      case "pseudonym":
        return !this.hasCondition(tactic.equalsCondition)
          ? (_) => tactic.pseudonym
          : (v) =>
              v == undefined
                ? undefined
                : tactic.equalsCondition.includes(v.toString())
                ? tactic.pseudonym
                : v;
      case "remove":
        return !this.hasCondition(tactic.equalsCondition)
          ? (_) => undefined
          : (v) =>
              v == undefined
                ? undefined
                : tactic.equalsCondition.includes(v.toString())
                ? undefined
                : v;
      case "random":
        return !this.hasCondition(tactic.equalsCondition)
          ? (v) => this.randomString(v?.toString().length ?? 8)
          : (v) =>
              v == undefined
                ? undefined
                : tactic.equalsCondition.includes(v.toString())
                ? this.randomString(v?.toString().length ?? 8)
                : v;
      case "perturbation":
        return (value) => {
          if (!(typeof value === "number"))
            throw new InvalidRuleError(
              `Cannot perform perturbation on value of type ${typeof value}`
            );
          if (this.hasCondition(tactic.equalsCondition)) {
            if (tactic.equalsCondition.includes(value.toString())) {
              return this.valueInBounds(value, tactic.perturbationFactor);
            } else return value;
          }
          if (tactic.perturbationFactor == 0) return 0;
          return this.valueInBounds(value, tactic.perturbationFactor);
        };
      case "hash":
        return !this.hasCondition(tactic.equalsCondition)
          ? (v) =>
              createHash("sha256")
                .update(v?.toString() ?? "")
                .digest("hex")
          : (v) =>
              v == undefined
                ? undefined
                : tactic.equalsCondition.includes(v.toString())
                ? createHash("sha256")
                    .update(v?.toString() ?? "")
                    .digest("hex")
                : v;
      case "encrypt":
        // TODO: update to allow keys to be stored in config file
        const initVector = randomBytes(16);
        const key = randomBytes(32);
        const cipher = createCipheriv("aes-256-cbc", key, initVector);
        return !this.hasCondition(tactic.equalsCondition)
          ? (v) => cipher.update(v?.toString() ?? "", "utf-8", "hex")
          : (v) =>
              v == undefined
                ? undefined
                : tactic.equalsCondition.includes(v.toString())
                ? cipher.update(v?.toString() ?? "", "utf-8", "hex")
                : v;
      default:
        return (v) => v;
    }
  }
}
