import React from "react";
import FileList from "~/app/_components/files/fileList";
import { api, HydrateClient } from "~/trpc/server";

export default async function Files() {
	void api.user.get.prefetch();
	return (
		<HydrateClient>
			<FileList />
		</HydrateClient>
	);
}
