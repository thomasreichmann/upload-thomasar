import React, { FormEvent, useEffect, useRef } from "react";
import { Backdrop, Fade, LinearProgress, Modal, Paper, Slide, Typography } from "@mui/material";
import { User } from "~/server/db/schema";
import ChangeFieldInput from "~/app/_components/changeFieldInput";
import { api } from "~/trpc/react";
import { setCookie } from "cookies-next";

interface SettingsModalProps {
	open: boolean;
	onClose?: () => void;
	user: User;
}

export default function SettingsModal(props: SettingsModalProps) {
	const updateUser = api.user.update.useMutation({
		async onMutate(updatedUser) {
			await utils.user.get.cancel();

			const previousUser = utils.user.get.getData();

			utils.user.get.setData(undefined, () => updatedUser as User);

			return { previousUser };
		},
		onError(error, variables, context) {
			utils.user.get.setData(undefined, context?.previousUser);
		},
		onSettled() {
			void utils.user.invalidate();
		},
	});
	const utils = api.useUtils();
	const formRef = useRef<HTMLFormElement>(null);
	const sessionIdInputRef = useRef<HTMLInputElement>(null);

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

		/**
		 * Check if we are updating the sessionId
		 * if we are, instead of updating the user, we should update the sessionId
		 * and then re-fetch the user ignoring the settings
		 */
		if (sessionId !== props.user.sessionId) {
			setCookie("sessionId", sessionId);
			void utils.user.invalidate();
		} else {
			updateUser.mutate({
				...props.user,
				settings: newConfig,
			});
		}
	};

	useEffect(() => {
		formRef.current?.reset();

		// Hack to make sure that the sessionId input is visually updated after being changed
		sessionIdInputRef.current?.blur();
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
					ref={sessionIdInputRef}
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
