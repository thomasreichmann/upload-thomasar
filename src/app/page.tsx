import { Box, Button, Paper } from "@mui/material";
import React, { Suspense } from "react";
import UploadButton from "~/app/_components/upload/uploadButton";
import FileList from "~/app/_components/files/fileList";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
	await api.user.delay.prefetch();
	await api.user.get.prefetch();

	return (
		<HydrateClient>
			<main className="flex h-screen flex-col items-center justify-center gap-4">
				{/*{res ? <p>True!</p> : <p>False!</p>}*/}
				<UploadButton />
				<Paper className="p-3">
					<HydrateClient>
						<Suspense>
							<FileList />
						</Suspense>
					</HydrateClient>
				</Paper>
			</main>
		</HydrateClient>
	);
}
