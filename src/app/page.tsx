import { Paper } from "@mui/material";
import { Suspense } from "react";
import FileList from "~/app/_components/files/fileList";
import UploadButton from "~/app/_components/upload/uploadButton";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
	await api.user.get.prefetch();
	await api.file.get.prefetch();

	return (
		<HydrateClient>
			<main className="flex h-screen flex-col items-center justify-center gap-4">
				{/*{res ? <p>True!</p> : <p>False!</p>}*/}
				<UploadButton />
				<Paper className="p-3">
					<Suspense>
						<FileList />
					</Suspense>
				</Paper>
			</main>
		</HydrateClient>
	);
}
