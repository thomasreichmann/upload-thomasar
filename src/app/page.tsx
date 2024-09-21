import React from "react";

export default async function Home() {
	return (
		<main className="flex h-screen flex-col items-center justify-center gap-4">
			<h1>
				Test of a non-client component that for sure should be rendered in the front-end
			</h1>
			{/*<UploadButton />*/}
			{/*<Paper className="p-3">*/}
			{/*	<Suspense fallback="loading">*/}
			{/*		<Files />*/}
			{/*	</Suspense>*/}
			{/*</Paper>*/}
		</main>
	);
}
