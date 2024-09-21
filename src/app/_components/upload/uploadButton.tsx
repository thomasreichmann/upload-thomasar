"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import useUpload from "~/app/_hooks/useUpload";
import FileListDisplay from "~/app/_components/upload/fileListDisplay";

export const convertToUppyFiles = (files: FileList) => {
	return Array.from(files).map(convertToUppyFile);
};

export const convertToUppyFile = (file: File) => {
	return {
		name: file.name,
		size: file.size,
		data: file,
	};
};

const UploadButton = () => {
	const [files, setFiles] = useState<FileList>();
	const upload = useUpload();

	useEffect(() => {
		if (!files) return;
		if (files?.length == 0) return;

		upload.uppy.addFiles(convertToUppyFiles(files));
	}, [files]);

	return (
		<div>
			{upload.state.totalProgress}
			<FileListDisplay files={files} />
			<Button
				component="label"
				role={undefined}
				variant="contained"
				tabIndex={-1}
				startIcon={<CloudUpload />}
			>
				Upload files
				<input
					className="clip-rect clip-path-inset absolute bottom-0 left-0 h-[1px] w-[1px] overflow-hidden whitespace-nowrap"
					type="file"
					onChange={(event) => setFiles(event.target.files ?? undefined)}
					multiple
				/>
			</Button>
			{(files?.length ?? 0) > 0 && (
				<Button variant="contained" onClick={() => upload.uppy.upload()}>
					Trigger upload
				</Button>
			)}
		</div>
	);
};

export default UploadButton;
