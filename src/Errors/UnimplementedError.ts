export class UnimplementedError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, UnimplementedError.prototype);
  }
}
