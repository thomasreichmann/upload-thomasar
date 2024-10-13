"use client";
import { List, ListItem, Paper, Skeleton } from "@mui/material";

export default function FileListSkeleton() {
	return (
		<Paper elevation={4} className="px-2">
			<List disablePadding className="max-w-[80vw]">
				<ListItem disablePadding disableGutters>
					<Skeleton height={48} width={600} />
				</ListItem>
			</List>
		</Paper>
	);
}
