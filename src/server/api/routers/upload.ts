import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
	CreateMultipartUploadCommand,
	ListPartsCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	abortMultipartUploadSchema,
	completeMultipartUploadSchema,
	createMultiPartUploadSchema,
	listPartsSchema,
	signPartSchema,
} from "~/server/api/types";
import { env } from "~/env";
import s3Client from "~/server/lib/s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const uploadRouter = createTRPCRouter({
	createMultiPartUpload: publicProcedure
		.input(createMultiPartUploadSchema)
		.mutation(async ({ ctx, input }) => {
			const createMultipartUploadCommand = new CreateMultipartUploadCommand({
				Bucket: env.AWS_BUCKET_NAME,
				Key: input.filename,
				StorageClass: input.storageClass,
			});

			const upload = await s3Client.send(createMultipartUploadCommand);

			return {
				uploadId: upload.UploadId,
				key: upload.Key,
			};
		}),

	signPart: publicProcedure.input(signPartSchema).mutation(async ({ ctx, input }) => {
		const uploadPartCommand = new UploadPartCommand({
			Bucket: env.AWS_BUCKET_NAME,
			Key: input.filename,
			UploadId: input.uploadId,
			PartNumber: input.partNumber,
		});

		return await getSignedUrl(s3Client, uploadPartCommand, {
			expiresIn: 24 * 60 * 60,
		});
	}),

	completeMultipartUpload: publicProcedure
		.input(completeMultipartUploadSchema)
		.mutation(async ({ ctx, input }) => {
			const completeMultipartUploadCommand = new CompleteMultipartUploadCommand({
				Bucket: env.AWS_BUCKET_NAME,
				Key: input.filename,
				UploadId: input.uploadId,
				MultipartUpload: {
					Parts: input.parts.map((part, index) => ({
						ETag: part.ETag,
						PartNumber: index + 1,
					})),
				},
			});

			const response = await s3Client.send(completeMultipartUploadCommand);

			return { key: response.Key, location: response.Location };
		}),

	abortMultipartUpload: publicProcedure
		.input(abortMultipartUploadSchema)
		.mutation(async ({ ctx, input }) => {
			const abortMultipartUploadCommand = new AbortMultipartUploadCommand({
				Bucket: env.AWS_BUCKET_NAME,
				Key: input.key,
				UploadId: input.uploadId,
			});

			await s3Client.send(abortMultipartUploadCommand);
		}),

	listParts: publicProcedure.input(listPartsSchema).mutation(async ({ ctx, input }) => {
		const listPartsCommand = new ListPartsCommand({
			Bucket: env.AWS_BUCKET_NAME,
			Key: input.key,
			UploadId: input.uploadId,
		});

		const response = await s3Client.send(listPartsCommand);

		if (!response.Parts) {
			return [];
		}

		return response.Parts;
	}),
});
