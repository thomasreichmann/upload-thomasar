"use client";

import React, { useEffect, useState } from "react";
import { List, ListItem, Paper } from "@mui/material";
import FileListItem from "~/app/_components/files/fileListItem";
import FileInfoModal from "~/app/_components/files/fileInfoModal";
import { api } from "~/trpc/react";

interface FilesProps {}

function generate(element: React.ReactElement<typeof ListItem>) {
	return [0, 1, 2].map((value) =>
		React.cloneElement(element, {
			key: value,
		}),
	);
}

export default function FileList(props: FilesProps) {
	const [open, setOpen] = useState(false);
	const [user] = api.user.get.useSuspenseQuery();

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

	return (
		<>
			<List disablePadding className="flex max-w-screen-sm flex-col gap-3">
				{generate(
					<Paper elevation={4}>
						<FileListItem
							name="test name pleasdjaskdjkjlasjdlasdbaskhjdaksldjlasjdase ignore"
							onInfoClick={handleInfoClick}
						/>
					</Paper>,
				)}
			</List>
			<FileInfoModal open={open} onClose={() => setOpen(false)} />
		</>
	);
}
