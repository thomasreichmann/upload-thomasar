import { Paper } from "@mui/material";
import React from "react";
import Files from "~/app/_components/files";
import UploadButton from "~/app/_components/upload/uploadButton";

export default async function Home() {
	return (
		<main className="flex h-screen flex-col items-center justify-center gap-4">
			<UploadButton />
			<Paper className="p-3">
				<Files />
			</Paper>
		</main>
	);
}
