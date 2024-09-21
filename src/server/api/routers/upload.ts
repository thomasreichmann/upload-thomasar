import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
	abortMultipartUploadSchema,
	completeMultipartUploadSchema,
	createMultiPartUploadSchema,
	listPartsSchema,
	signPartSchema,
} from "~/server/api/types";

export const uploadRouter = createTRPCRouter({
	createMultiPartUpload: publicProcedure
		.input(createMultiPartUploadSchema)
		.mutation(async ({ ctx, input }) => {
			throw new Error("TODO");
		}),

	signPart: publicProcedure.input(signPartSchema).query(async ({ ctx, input }) => {
		throw new Error("TODO");
	}),

	completeMultipartUpload: publicProcedure
		.input(completeMultipartUploadSchema)
		.mutation(async ({ ctx, input }) => {
			throw new Error("TODO");
		}),

	abortMultipartUpload: publicProcedure
		.input(abortMultipartUploadSchema)
		.mutation(async ({ ctx, input }) => {
			throw new Error("TODO");
		}),

	listParts: publicProcedure.input(listPartsSchema).query(async ({ ctx, input }) => {
		throw new Error("TODO");
	}),
});
