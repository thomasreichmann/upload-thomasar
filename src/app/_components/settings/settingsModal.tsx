import React, { FormEvent, useEffect, useRef } from "react";
import { Backdrop, Fade, LinearProgress, Modal, Paper, Slide, Typography } from "@mui/material";
import { User } from "~/server/db/schema";
import ChangeFieldInput from "~/app/_components/changeFieldInput";
import { api } from "~/trpc/react";

interface SettingsModalProps {
	open: boolean;
	onClose?: () => void;
	user: User;
}

const isArrayOfObjects = (data: unknown): data is Array<User> => Array.isArray(data);

export default function SettingsModal(props: SettingsModalProps) {
	const updateUser = api.user.update.useMutation({
		onSuccess: (data) => {
			let user: User | undefined;

			if (isArrayOfObjects(data)) {
				if (data.length > 0 && data[0]?.sessionId) {
					user = data[0];
				}
			} else if (data && !isArrayOfObjects(data)) {
				user = data;
			}

			if (user) {
				utils.user.get.setData(undefined, () => user);
			}

			void utils.user.invalidate();
		},
	});
	const utils = api.useUtils();
	const formRef = useRef<HTMLFormElement>(null);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const newConfig: Record<string, string> = {};
		let sessionId = "";
		for (const data of formData) {
			if (data[0] === "sessionId") {
				sessionId = data[1] as string;
				continue;
			}
			newConfig[data[0]] = data[1] as string;
		}
		updateUser.mutate({
			...props.user,
			settings: newConfig,
			sessionId,
		});
	};

	useEffect(() => {
		formRef.current?.reset();
	}, [props.user]);

	return (
		<ModalBase open={props.open} onClose={props.onClose}>
			<Typography id="modal-modal-description" className="mt-2">
				Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
			</Typography>
			<form
				ref={formRef}
				onSubmit={(event) => {
					handleSubmit(event);
				}}
				className="flex gap-2"
			>
				<button className="hidden" type="submit" />
				<ChangeFieldInput
					name="sessionId"
					displayName="Session ID"
					loading={updateUser.isPending}
					currentValue={props.user.sessionId}
					type="number"
					maxLength={6}
				/>
				{Object.entries(props.user.settings ?? {}).map(([key, value]) => (
					<ChangeFieldInput
						key={key}
						currentValue={value}
						name={key}
						loading={updateUser.isPending}
					/>
				))}
			</form>
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
