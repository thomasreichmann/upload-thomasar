import { Uppy } from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3";
import { api } from "~/trpc/react";
import { useUppyState } from "@uppy/react";
import { useState } from "react";

export default function useUpload() {
	// Call hooks at the top level of the hook
	const createMutation = api.upload.createMultiPartUpload.useMutation();
	const abortMutation = api.upload.abortMultipartUpload.useMutation();
	const listPartMutation = api.upload.listParts.useMutation();
	const completeMutation = api.upload.completeMultipartUpload.useMutation();
	const signPartMutation = api.upload.signPart.useMutation();

	// Now pass those mutation hooks as parameters to createUppyClient
	const [uppy] = useState(() =>
		createUppyClient({
			createMutation,
			abortMutation,
			listPartMutation,
			completeMutation,
			signPartMutation,
		}),
	);

	const state = useUppyState(uppy, (state) => state);

	return {
		state,
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
			});

			return {
				location: response.location,
			};
		},
		getChunkSize: (file) => 1024 ** 2,
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
