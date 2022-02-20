export class NoRulesForSchemeError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NoRulesForSchemeError.prototype);
  }
}
