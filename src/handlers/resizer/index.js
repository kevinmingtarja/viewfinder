const ResizeHandler = require("./resizeHandler");
const resizeHandler = new ResizeHandler();

exports.handler = async (event) => {
  try {
    const imagePath = await resizeHandler.process(event);
    const url = `http://${process.env.BUCKET}.s3.${process.env.REGION}.amazonaws.com`;

    return {
      headers: { location: `${url}/${imagePath}` },
      statusCode: 301,
      body: "",
    };
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
