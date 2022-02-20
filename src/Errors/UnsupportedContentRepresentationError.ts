export class UnsupportedContentRepresentationError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(
      this,
      UnsupportedContentRepresentationError.prototype
    );
  }
}
