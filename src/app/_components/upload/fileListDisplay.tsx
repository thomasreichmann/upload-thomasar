import React from "react";

const FileListDisplay = (props: { files?: FileList }) => {
	if (!props.files || props.files.length === 0) {
		return <p>No files selected</p>;
	}

	const fileArray = Array.from(props.files).map((file, index) => (
		<li className="list-item" key={index}>
			<div>
				<p>
					<strong>File Name:</strong> {file.name}
				</p>
				<p>
					<strong>Size:</strong> {file.size} bytes
				</p>
				<p>
					<strong>Type:</strong> {file.type}
				</p>
			</div>
		</li>
	));

	return <ul className="max-h-20 list-inside list-disc overflow-y-auto">{fileArray}</ul>;
};

export default FileListDisplay;
