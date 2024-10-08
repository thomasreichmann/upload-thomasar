"use client";
import AwsS3Multipart from "@uppy/aws-s3";
import { Uppy } from "@uppy/core";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function useUpload() {
	const utils = api.useUtils();

	const createMutation = api.upload.createMultiPartUpload.useMutation();
	const abortMutation = api.upload.abortMultipartUpload.useMutation();
	const listPartMutation = api.upload.listParts.useMutation();
	const completeMutation = api.upload.completeMultipartUpload.useMutation({
		onSettled: () => utils.file.invalidate(),
	});
	const signPartMutation = api.upload.signPart.useMutation();

	const [uppy] = useState(() =>
		createUppyClient({
			createMutation,
			abortMutation,
			listPartMutation,
			completeMutation,
			signPartMutation,
		}),
	);

	return {
		uppy,
	};
}

function createUppyClient({
	createMutation,
	abortMutation,
	listPartMutation,
	completeMutation,
	signPartMutation,
}: UploadMutations) {
	return new Uppy().use(AwsS3Multipart, {
		shouldUseMultipart: true,
		abortMultipartUpload: async (file, opts) => {
			await abortMutation.mutateAsync({
				key: opts.key,
				uploadId: opts.uploadId,
			});
		},
		listParts: async (file, opts) => {
			return await listPartMutation.mutateAsync({
				key: opts.key,
				uploadId: opts.uploadId,
			});
		},
		completeMultipartUpload: async (file, opts) => {
			const response = await completeMutation.mutateAsync({
				filename: file.name ?? "",
				uploadId: opts.uploadId,
				parts: opts.parts,
				type: file.type,
				size: file.size ?? 0,
			});

			return {
				location: response.location,
			};
		},
		getChunkSize: () => 1024 ** 2,
		createMultipartUpload: async (file) => {
			const response = await createMutation.mutateAsync({
				filename: file.name ?? "",
				storageClass: "STANDARD",
			});

			return {
				key: response.key ?? "",
				uploadId: response.uploadId ?? "",
			};
		},
		signPart: async (file, opts) => {
			const response = await signPartMutation.mutateAsync({
				filename: file.name ?? "",
				partNumber: opts.partNumber,
				uploadId: opts.uploadId,
			});

			return {
				url: response,
			};
		},
	});
}

type UploadMutations = {
	createMutation: ReturnType<typeof api.upload.createMultiPartUpload.useMutation>;
	abortMutation: ReturnType<typeof api.upload.abortMultipartUpload.useMutation>;
	listPartMutation: ReturnType<typeof api.upload.listParts.useMutation>;
	completeMutation: ReturnType<typeof api.upload.completeMultipartUpload.useMutation>;
	signPartMutation: ReturnType<typeof api.upload.signPart.useMutation>;
};
