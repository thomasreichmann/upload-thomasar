import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { UserCookieSetter } from "~/app/_components/cookieSetter";
import SettingsButton from "~/app/_components/settings/settingsButton";
import { api, HydrateClient } from "~/trpc/server";

async function Settings() {
	void api.user.get.prefetch();

	return (
		<HydrateClient>
			<ErrorBoundary fallback={<p>Error</p>}>
				<Suspense>
					<SettingsButton />
					<UserCookieSetter />
				</Suspense>
			</ErrorBoundary>
		</HydrateClient>
	);
}

export default Settings;
