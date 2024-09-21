import { useState } from "react";
import { Uppy } from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3";
import { api } from "~/trpc/react";

export interface UploadStatus {
	isUploading: boolean;
}

export default function useUpload() {
	const [status, setStatus] = useState<UploadStatus>({ isUploading: false });

	const uppy = createUppyClient();

	const uploadController = {
		cancel: async () => {
			throw new Error("TODO");
		},
		pause: async () => {
			throw new Error("TODO");
		},
		resume: async () => {
			throw new Error("TODO");
		},
	};

	const upload = async () => {};

	return {
		status,
		uploadController,
		upload,
		uppy,
	};
}

function createUppyClient() {
	return new Uppy().use(AwsS3Multipart, {
		// To use this, we would also need to be able to handle non-multipart uploads, which should be ok, but for now we'll just use multipart
		// shouldUseMultipart: (file) => (file.size ?? 0) > 50 * 1024 ** 2,
		shouldUseMultipart: true,
		abortMultipartUpload: async (file, opts) => {
			const abortMutation = api.upload.abortMultipartUpload.useMutation();

			await abortMutation.mutateAsync({
				key: opts.key,
				uploadId: opts.uploadId,
			});
		},
		listParts: async (file, opts) => {
			const listPartMutation = api.upload.listParts.useMutation();

			return await listPartMutation.mutateAsync({
				key: opts.key,
				uploadId: opts.uploadId,
			});
		},
		completeMultipartUpload: async (file, opts) => {
			const completeMutation = api.upload.completeMultipartUpload.useMutation();

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
			const createMutation = api.upload.createMultiPartUpload.useMutation();

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
			const signPartMutation = api.upload.signPart.useMutation();

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
