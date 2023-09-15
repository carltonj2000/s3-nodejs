import "dotenv/config";
import { fileURLToPath } from "url";

import { CopyObjectCommand, S3Client } from "@aws-sdk/client-s3";

const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const Bucket = process.env.BUCKET;
const KeyIn = process.env.KEY;

if (!accessKeyId || !secretAccessKey) {
  console.error("accessKeyId or secretAccessKey missing!");
  process.exit(-1);
}

if (!Bucket || !KeyIn) {
  console.error("Bucket or Key missing!");
  process.exit(-1);
}

const client = new S3Client({
  region: "us-west-1",
  credentials: { accessKeyId, secretAccessKey },
});

/**
 *
 * @param {string} Body
 */
export const main = async (Body) => {
  if (!Body) {
    console.error("Body missing!");
    return;
  }

  const CopySource = `${Bucket}/${KeyIn}`;
  const Key =
    "old/" +
    KeyIn?.split(".")[0] +
    "-" +
    new Date().toISOString().split(".")[0].replaceAll(":", "-") +
    "." +
    KeyIn?.split(".")[1];
  console.log({ Key });
  const command = new CopyObjectCommand({ Bucket, Key, CopySource });

  try {
    const response = await client.send(command);
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main("Hello S3!");
}
