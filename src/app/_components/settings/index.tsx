import React from "react";
import SettingsButton from "~/app/_components/settings/settingsButton";
import CookieSetter from "~/app/_components/cookieSetter";
import { api } from "~/trpc/server";

interface SettingsProps {}

async function Settings(props: SettingsProps) {
	const user = await api.user.get();

	if (!user) throw new Error("User not found");

	return (
		<>
			<SettingsButton
				user={{
					autoOpen: user.settings.autoOpen ?? false,
					delay: user.settings.delay ?? 1000,
				}}
			/>
			<CookieSetter name="sessionId" value={user?.sessionId ?? "not found"} />
		</>
	);
}

export default Settings;
