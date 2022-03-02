import internal from "stream";

/**
 * Turns the given readable stream asynchronously into a string
 *
 * @param {internal.Readable} stream  stream to turn into a string
 * @returns {Promise<string>} String formed by concatenating all elements
 * of the stream, until it is ended
 */
export async function stringifyStream(
  stream: internal.Readable
): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}
