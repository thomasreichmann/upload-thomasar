import { Paper } from "@mui/material";
import UploadButton from "~/app/_components/upload/uploadButton";
import { api } from "~/trpc/server";
import Files from "./_components/files";

export default async function Home() {
	const user = await api.user.get();

	return (
		<main className="flex h-screen flex-col items-center justify-center gap-4">
			{/*{res ? <p>True!</p> : <p>False!</p>}*/}
			<UploadButton />
			<Paper className="p-3">
				<Files user={user} />
			</Paper>
		</main>
	);
}
