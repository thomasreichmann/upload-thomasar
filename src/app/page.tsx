import { Button, Paper } from "@mui/material";
import React from "react";
import Files from "~/app/_components/files";

export default async function Home() {
	return (
		<main className="flex h-screen flex-col items-center justify-center gap-4">
			<Button variant="contained">Upload file</Button>
			<Paper className="p-3">
				<Files />
			</Paper>
		</main>
	);
}
