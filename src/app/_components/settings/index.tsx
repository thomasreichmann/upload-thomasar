import React from "react";
import SettingsButton from "~/app/_components/settings/settingsButton";
import CookieSetter from "~/app/_components/cookieSetter";
import { api } from "~/trpc/server";

async function Settings() {
	const user = await api.user.get();

	void api.user.get.prefetch();

	return (
		<>
			<SettingsButton />
			<CookieSetter name="sessionId" value={user.sessionId} />
		</>
	);
}

export default Settings;
