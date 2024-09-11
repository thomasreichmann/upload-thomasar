"use client";

import React, { useState } from "react";
import { IconButton } from "@mui/material";
import SettingsModal from "~/app/_components/settings/settingsModal";
import { Settings } from "@mui/icons-material";
import { type InferSelectModel } from "drizzle-orm";
import { type users } from "~/server/db/schema";

interface SettingsButtonProps {
	user: InferSelectModel<typeof users>;
}

export default function SettingsButton(props: SettingsButtonProps) {
	const [open, setOpen] = useState(false);

	if (props.user.settings.autoOpen) {
		setTimeout(() => {
			setOpen(true);
		}, props.user.settings.delay);
	}

	return (
		<div className="fixed right-0 p-3">
			<IconButton size="medium" onClick={() => setOpen(true)}>
				<Settings fontSize="large" />
			</IconButton>
			<SettingsModal user={props.user} open={open} onClose={() => setOpen(false)} />
		</div>
	);
}
