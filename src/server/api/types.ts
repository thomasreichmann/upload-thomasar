import { StorageClass } from "@aws-sdk/client-s3";
import { z } from "zod";

export const createMultiPartUploadSchema = z.object({
	filename: z.string().min(1),
	storageClass: z.nativeEnum(StorageClass),
});

export const abortMultipartUploadSchema = z.object({
	key: z.string().min(1),
	uploadId: z.string().min(1),
});

export const listPartsSchema = z.object({
	key: z.string().min(1),
	uploadId: z.string().min(1),
});

export const signPartSchema = z.object({
	filename: z.string().min(1),
	uploadId: z.string().min(1),
	partNumber: z.coerce.number().int().positive(),
});

export const completeMultipartUploadSchema = z.object({
	filename: z.string().min(1),
	uploadId: z.string().min(1),
	type: z.string().min(1),
	size: z.number().int().positive(),
	parts: z.array(
		z.object({
			PartNumber: z.number().int().positive().optional(),
			ETag: z.string().min(1).optional(),
		}),
	),
});
