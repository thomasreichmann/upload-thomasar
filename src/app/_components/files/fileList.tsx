import React from "react";
import { List, ListItem, Paper } from "@mui/material";
import FileListItem from "~/app/_components/files/fileListItem";

interface FilesProps {}

function generate(element: React.ReactElement<typeof ListItem>) {
	return [0, 1, 2].map((value) =>
		React.cloneElement(element, {
			key: value,
		}),
	);
}

export default function FileList(props: FilesProps) {
	return (
		<List disablePadding className="flex max-w-screen-sm flex-col gap-3">
			{generate(
				<Paper elevation={4}>
					<FileListItem name="test name pleasdjaskdjkjlasjdlasdbaskhjdaksldjlasjdase ignore" />
				</Paper>,
			)}
		</List>
	);
}
