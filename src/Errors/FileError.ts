export class FileError extends Error {
  private path: string;
  constructor(msg: string, path: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, FileError.prototype);
    this.path = path;
  }

  getPath() {
    return this.path;
  }
}
