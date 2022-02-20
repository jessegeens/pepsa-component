export class NoSuchDataSchemeError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NoSuchDataSchemeError.prototype);
  }
}
