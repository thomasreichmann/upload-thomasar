import React, { useRef } from "react";
import { Backdrop, Fade, LinearProgress, Modal, Paper, Slide, Typography } from "@mui/material";
import { InferSelectModel } from "drizzle-orm";
import { users } from "~/server/db/schema";

interface SettingsModalProps {
	open: boolean;
	onClose?: () => void;
	user: InferSelectModel<typeof users>;
}

const isArrayOfObjects = (data: unknown): data is Array<any> => Array.isArray(data);

export default function SettingsModal(props: SettingsModalProps) {
	return (
		<ModalBase open={props.open} onClose={props.onClose}>
			<Typography>Test of the modal</Typography>
			<Typography variant="caption">
				lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor sit amet,
				consectetur adipiscing elit lorem ipsum dolor sit amet, consectetur adipiscing elit
				lorem ipsum dolor sit amet, consectetur adipiscing elit
			</Typography>
		</ModalBase>
	);
}

function ModalBase(
	props: Partial<SettingsModalProps> & {
		children: React.ReactNode;
		loading?: boolean;
	},
) {
	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Modal
			open={props.open ?? false}
			onClose={props.onClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
			closeAfterTransition
			slots={{ backdrop: Backdrop }}
			slotProps={{
				backdrop: {
					timeout: 500,
				},
			}}
		>
			<Fade in={props.open}>
				<Paper
					className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform overflow-hidden p-4 focus-visible:outline-0"
					component="div"
					ref={containerRef}
				>
					{props.children}
					<Slide in={props.loading} direction="up" container={containerRef.current}>
						<LinearProgress className="mt-3" />
					</Slide>
				</Paper>
			</Fade>
		</Modal>
	);
}
