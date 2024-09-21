import React from "react";
import SettingsButton from "~/app/_components/settings/settingsButton";
import CookieSetter from "~/app/_components/cookieSetter";
import { api, HydrateClient } from "~/trpc/server";

async function Settings() {
	const user = await api.user.get();

	void api.user.get.prefetch();

	return (
		<>
			<HydrateClient>
				<SettingsButton />
				<CookieSetter name="sessionId" value={user.sessionId} />
			</HydrateClient>
		</>
	);
}

export default Settings;
