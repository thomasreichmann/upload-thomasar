import { useState } from "react";
import { Uppy } from "@uppy/core";
import AwsS3Multipart from "@uppy/aws-s3";

export interface UploadStatus {
	isUploading: boolean;
}

export default function useUpload() {
	const [status, setStatus] = useState<UploadStatus>({ isUploading: false });

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

	const upload = async () => {
		throw new Error("TODO");
	};

	return {
		status,
		uploadController,
		upload,
	};
}

function createUppyClient() {
	return new Uppy().use(AwsS3Multipart, {
		shouldUseMultipart: true,
		abortMultipartUpload: () => {
			throw new Error("TODO");
		},
		listParts: () => {
			throw new Error("TODO");
		},
		completeMultipartUpload: () => {
			throw new Error("TODO");
		},
		getChunkSize: (file) => 25 * 1024 ** 2,
		createMultipartUpload: () => {
			throw new Error("TODO");
		},
		signPart: () => {
			throw new Error("TODO");
		},
	});
}
