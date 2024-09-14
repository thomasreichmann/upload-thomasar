"use client";

import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import SettingsModal from "~/app/_components/settings/settingsModal";
import { Settings } from "@mui/icons-material";
import { api } from "~/trpc/react";
import { setCookie } from "cookies-next";

export default function SettingsButton() {
	const [open, setOpen] = useState(false);

	const [user] = api.user.get.useSuspenseQuery();

	if (!user) throw new Error("User not found");

	setCookie("sessionId", user.sessionId);

	useEffect(() => {
		if (user.settings.autoOpen?.toString() == "true") {
			setTimeout(() => {
				setOpen(true);
			}, user.settings.delay);
		}
	});

	return (
		<div className="fixed right-0 p-3">
			<IconButton size="medium" onClick={() => setOpen(true)}>
				<Settings fontSize="large" />
			</IconButton>
			<SettingsModal user={user} open={open} onClose={() => setOpen(false)} />
		</div>
	);
}
