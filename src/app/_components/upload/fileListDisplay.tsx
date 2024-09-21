import React from "react";

const FileListDisplay = (props: { files?: FileList }) => {
	if (!props.files || props.files.length === 0) {
		return <p>No files selected</p>;
	}

	const fileArray = Array.from(props.files).map((file, index) => (
		<li key={index}>
			<p>
				<strong>File Name:</strong> {file.name}
			</p>
			<p>
				<strong>Size:</strong> {file.size} bytes
			</p>
			<p>
				<strong>Type:</strong> {file.type}
			</p>
		</li>
	));

	return <ul>{fileArray}</ul>;
};

export default FileListDisplay;
