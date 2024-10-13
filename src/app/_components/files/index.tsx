"use client";
import { Collapse } from "@mui/material";
import { Suspense } from "react";
import { TransitionGroup } from "react-transition-group";
import FileList from "~/app/_components/files/fileList";
import { type User } from "~/server/db/schema";
import FileListSkeleton from "./fileListSkeleton";

export default function Files({ user }: { user: User }) {
	return (
		<TransitionGroup>
			<Suspense fallback={<FileListSkeleton />}>
				<Collapse key={1} in={true}>
					<FileList user={user} />
				</Collapse>
			</Suspense>
		</TransitionGroup>
	);
}
