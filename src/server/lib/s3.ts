import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/env";

const s3Client = new S3Client({
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_ACCESS_KEY_SECRET,
	},
	region: env.AWS_REGION,
});

export default s3Client;
