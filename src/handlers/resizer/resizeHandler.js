const sharp = require("sharp");
const S3Handler = require("./s3Handler");
const s3Handler = new S3Handler();

class ResizerHandler {
  constructor() {}

  /**
   *
   * @param {*} event raw HTTP event from the HTTP handler
   * @returns
   */
  async process(event) {
    // Derive size and name of the image from the parameters
    const { size, image } = event.pathParameters;

    return await this.resize(size, image);
  }

  async resize(size, path) {
    try {
      const sizeArray = size.split("x");
      const width = parseInt(sizeArray[0]);
      const height = parseInt(sizeArray[1]);
      const Key = path;
      const newKey = "" + width + "x" + height + "/" + path;

      const Bucket = process.env.BUCKET;
      const streamResize = sharp().resize(width, height).toFormat("png");

      const readStream = s3Handler.readStream({ Bucket, Key });
      const { writeStream, uploaded } = s3Handler.writeStream({
        Bucket,
        Key: newKey,
      });

      readStream.pipe(streamResize).pipe(writeStream);
      await uploaded;

      return newKey;
    } catch (error) {
      console.log(error);
      return new Error(error);
    }
  }
}

module.exports = ResizerHandler;
