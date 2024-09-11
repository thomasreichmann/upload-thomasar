"use client";

import React, { useState } from "react";
import { Button } from "@mui/material";
import SettingsModal from "~/app/_components/settings/settingsModal";

interface SettingsButtonProps {
	user: {
		autoOpen: boolean;
		delay: number;
	};
}

export default function SettingsButton(props: SettingsButtonProps) {
	const [open, setOpen] = useState(false);

	if (props.user.autoOpen) {
		setTimeout(() => {
			setOpen(true);
		}, props.user.delay);
	}

	return (
		<div className="fixed right-0 p-3">
			<Button variant="contained" onClick={() => setOpen(true)}>
				open settings
			</Button>
			<SettingsModal open={open} onClose={() => setOpen(false)} />
		</div>
	);
}
