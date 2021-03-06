import { getLoggerFor, Logger } from "@solid/community-server";
import { ContentRepresentation } from "../ContentRepresentation";
import { EncapsulatedData } from "../EncapsulatedData";

/**
 * A TacticParser parses {@link PrivacyTacticRule}s for a specific {@link ContentRepresentation}.
 */
export abstract class TacticParser {
  protected readonly log: Logger;

  constructor() {
    this.log = getLoggerFor(this);
  }

  /**
   * Apply the tactics specified in `transformation`,
   * on the raw data in `rawData`. The correct implementation
   * will be chosen based on the `contentRepresentation`
   *
   * @param data Encapsulated data, of the format:
   * ```
   * {
   *   rawData: string;
   *   contentRepresentation: ContentRepresentation;
   *   dataScheme: string;
   *   transformation: Transformation;
   * }
   * ```
   */
  abstract parseTactics(data: EncapsulatedData): Promise<string>;

  abstract parses(): ContentRepresentation;

  /**
   * Generate a random string of length `len`
   * From {@link https://gist.github.com/6174/6062387}
   *
   * @param len length of the returned string
   * @returns a random string
   */
  randomString(len: number): string {
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allUniqueChars = [..."~!@#$%^&*()_+-=[]{}|;:'\",./<>?"];
    const allNumbers = [..."0123456789"];

    const generator = (base: Array<string>, len: number) => {
      return [...Array(len)]
        .map((i) => base[(Math.random() * base.length) | 0])
        .join("");
    };

    return generator([...allLowerAlpha], len);
  }

  /**
   * Return a random value within aggregation bounds
   * Example: for v = 70, b = 1.1, the output will lie in [63, 77]
   *
   * @param value value for which the numerical aggregation should happen
   * @param bounds the aggregation bounds
   * @returns random value within the bounds
   */
  valueInBounds(value: number, bounds: number): number {
    let upper = value * bounds;
    let lower = value / bounds;
    return Math.random() * (upper - lower) + lower;
  }

  /**
   * Return whether a TacticRule has a condition
   *
   * @param equalsCondition A list of strings, to which the field should be equal
   * in order to satisfy the condition
   * @returns true if the tactic rule has a condition, false otherwise
   */
  hasCondition(equalsCondition: string[]): boolean {
    if (equalsCondition == undefined) return false;
    if (equalsCondition.length == 0) return false;
    return true;
  }
}
