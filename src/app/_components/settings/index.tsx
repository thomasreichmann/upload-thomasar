import React from "react";
import SettingsButton from "~/app/_components/settings/settingsButton";
import CookieSetter from "~/app/_components/cookieSetter";
import { api } from "~/trpc/server";

async function Settings() {
	const user = await api.user.get();

	if (!user) throw new Error("User not found");

	return (
		<>
			<SettingsButton user={user} />
			<CookieSetter name="sessionId" value={user?.sessionId ?? "not found"} />
		</>
	);
}

export default Settings;
