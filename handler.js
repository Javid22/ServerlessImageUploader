
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

const BUCKET_NAME = process.env.BUCKET_NAME;

module.exports.uploadFile = async (event) => {
    console.log(event);

    const response = {
        isBase64Encoded: false,
        statusCode: 200,
        headers: {
            // Add the CORS headers
            "Access-Control-Allow-Origin": "*",  // Or specify your front-end URL (e.g., "http://localhost:3001")
            "Access-Control-Allow-Methods": "OPTIONS, POST",  // Allow the methods you are using
            "Access-Control-Allow-Headers": "Content-Type, x-file-name",  // Allow any custom headers you use
        },
        body: JSON.stringify({ message: "Successfully uploaded file to S3" }),
    };

    try {
        const parsedBody = JSON.parse(event.body);
        console.log("parsedBody  -- ", parsedBody);
        const base64File = parsedBody.file;
        const decodedFile = Buffer.from(base64File.replace(/^data:image\/\w+;base64,/, ""), "base64");
        const params = {
            Bucket: BUCKET_NAME,
            Key: `images/${parsedBody.fileName}.jpeg`,
            Body: decodedFile,
            ContentType: "image/jpeg",
        };

        const uploadResult = await s3.upload(params).promise();

        response.body = JSON.stringify({ statusCode: 200, message: "Successfully uploaded file to S3", uploadResult });
    } catch (e) {
        console.error(e);
        response.body = JSON.stringify({ message: "File failed to upload", errorMessage: e });
        response.statusCode = 500;
    }

    return response;
};