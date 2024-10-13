"use client";

import { List, type ListItem, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import FileInfoModal from "~/app/_components/files/fileInfoModal";
import FileListItem from "~/app/_components/files/fileListItem";
import { type User } from "~/server/db/schema";
import { api } from "~/trpc/react";

interface FilesProps {
	user: User;
}

function generate(element: React.ReactElement<typeof ListItem>) {
	return [0, 1, 2].map((value) =>
		React.cloneElement(element, {
			key: value,
		}),
	);
}

export default function FileList(props: FilesProps) {
	const [open, setOpen] = useState(false);
	const [files] = api.file.get.useSuspenseQuery();
	const { user } = props;

	function handleInfoClick() {
		setOpen(true);
	}

	useEffect(() => {
		if (user.settings.autoOpenInfo) {
			setTimeout(() => {
				setOpen(true);
			}, user.settings.delay);
		}
	}, [user.settings.autoOpenInfo, user.settings.delay]);

	function displayFiles() {
		// if (files.length === 0) {
		// 	return generate(
		// 		<Paper elevation={4}>
		// 			<FileListItem
		// 				name="file list was empty so this was rendered instead (PLACEHOLDER)"
		// 				onInfoClick={handleInfoClick}
		// 			/>
		// 		</Paper>,
		// 	);
		// }

		return files.map((file) => (
			<Paper elevation={4} key={file.id}>
				<FileListItem name={file.fileName} onInfoClick={handleInfoClick} key={file.id} />
			</Paper>
		));
	}

	return (
		<div>
			<List disablePadding className="flex max-w-[80vw] flex-col gap-3">
				{displayFiles()}
			</List>
			<FileInfoModal open={open} onClose={() => setOpen(false)} />
		</div>
	);
}
