import React, { type FormEvent, useEffect, useRef, useState } from "react";
import { type User } from "~/server/db/schema";
import ChangeFieldInput from "~/app/_components/changeFieldInput";
import { api } from "~/trpc/react";
import { setCookie } from "cookies-next";
import ModalBase from "~/app/_components/modalBase";

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
	const [loadingSessionId, setLoadingSessionId] = useState(false);

	const isLoading = updateUser.isPending || loadingSessionId;

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		const newConfig: Record<string, string | number | boolean> = {};
		let sessionId = "";

		for (const [key, value] of formData.entries()) {
			// Handle sessionId separately
			if (key === "sessionId") {
				sessionId = value as string;
				continue;
			}

			if (value === "true" || value === "false") {
				newConfig[key] = value === "true";
			} else if (!isNaN(Number(value))) {
				newConfig[key] = Number(value);
			} else {
				newConfig[key] = value as string;
			}
		}

		/**
		 * Check if we are updating the sessionId
		 * if we are, instead of updating the user, we should update the sessionId
		 * and then re-fetch the user ignoring the settings
		 */
		if (sessionId !== props.user.sessionId) {
			setLoadingSessionId(true);
			setCookie("sessionId", sessionId);
			void utils.user.invalidate().finally(() => {
				setLoadingSessionId(false);
			});
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
		<ModalBase open={props.open} onClose={props.onClose} loading={isLoading}>
			<form
				ref={formRef}
				onSubmit={(event) => {
					handleSubmit(event);
				}}
				className="flex flex-wrap content-around justify-around gap-4"
			>
				<button className="hidden" type="submit" />
				<ChangeFieldInput
					name="sessionId"
					displayName="Session ID"
					loading={isLoading}
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
						loading={isLoading}
					/>
				))}
			</form>
		</ModalBase>
	);
}
