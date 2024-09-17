import React, { useRef } from "react";
import { Backdrop, Fade, LinearProgress, Modal, Paper } from "@mui/material";

export default function ModalBase(props: {
	open: boolean;
	onClose?: () => void;
	children: React.ReactNode;
	loading?: boolean;
}) {
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
					className="absolute left-1/2 top-1/2 max-h-[80vh] w-max max-w-[80vw] -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto p-3 focus-visible:outline-none"
					component="div"
					ref={containerRef}
				>
					<Fade className="absolute left-0 top-0 w-full" in={props.loading}>
						<LinearProgress />
					</Fade>

					{props.children}
				</Paper>
			</Fade>
		</Modal>
	);
}
