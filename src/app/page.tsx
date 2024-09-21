import { Paper } from "@mui/material";
import React, { Suspense } from "react";
import Files from "~/app/_components/files";
import UploadButton from "~/app/_components/upload/uploadButton";

export default async function Home() {
	return (
		<main className="flex h-screen flex-col items-center justify-center gap-4">
			<h1>
				Test of a non-client component that for sure should be rendered in the front-end
			</h1>
			<Suspense fallback="Loading...">
				<UploadButton />
				<Paper className="p-3">
					<Files />
				</Paper>
			</Suspense>
		</main>
	);
}
