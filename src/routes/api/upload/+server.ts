import type { RequestHandler } from '@sveltejs/kit';
import type { GeneratePresignedUrlRequest } from '$lib/types/uploadTypes';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import {
    AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY_SECRET,
    AWS_BUCKET_NAME,
    AWS_DEFAULT_REGION
} from '$env/static/private';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const POST: RequestHandler = async ({ request }) => {
    const data = (await request.json()) as GeneratePresignedUrlRequest;

    const client = new S3Client({
        region: AWS_DEFAULT_REGION,
        credentials: { accessKeyId: AWS_ACCESS_KEY_ID, secretAccessKey: AWS_ACCESS_KEY_SECRET }
    });
    const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: data.filename,
        ContentType: data.contentType
    });
    const url = await getSignedUrl(client, command, { expiresIn: 3600 });

    return new Response(JSON.stringify({ url }));
};
