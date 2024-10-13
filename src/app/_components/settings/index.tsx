import { UserCookieSetter } from "~/app/_components/cookieSetter";
import SettingsButton from "~/app/_components/settings/settingsButton";
import { api, HydrateClient } from "~/trpc/server";

async function Settings() {
	void api.user.get.prefetch();

	return (
		<HydrateClient>
			<SettingsButton />
			<UserCookieSetter />
		</HydrateClient>
	);
}

export default Settings;
