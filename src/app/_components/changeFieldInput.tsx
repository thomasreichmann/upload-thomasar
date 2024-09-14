import React, { forwardRef, HTMLInputTypeAttribute } from "react";
import { Paper, TextField, Typography } from "@mui/material";

interface ChangeFieldInputProps {
	name: string;
	currentValue?: string | number | boolean;
	displayName?: string;
	loading?: boolean;
	type?: HTMLInputTypeAttribute;
	maxLength?: number;
}

const ChangeFieldInput = forwardRef<HTMLInputElement, ChangeFieldInputProps>((props, ref) => {
	const chooseValueToDisplay = () => {
		// Add a whitespace character to the end of the value so that when it is " " or null, the input still retains the correct height
		return (props.currentValue ?? "") + "‎";
	};

	return (
		<Paper elevation={2} className="flex w-min flex-col items-center justify-center gap-8 p-4">
			<Paper
				elevation={3}
				className="flex w-fit min-w-28 flex-col items-center justify-center"
			>
				<Typography className="whitespace-nowrap p-2">
					{props.displayName ?? props.name}
				</Typography>
				<Paper elevation={4} className="w-full p-2 text-center">
					<Typography color="text.secondary">{chooseValueToDisplay()}</Typography>
				</Paper>
			</Paper>
			<TextField
				name={props.name}
				defaultValue={props.currentValue}
				type={props.type ?? typeof props.currentValue}
				disabled={props.loading}
				slotProps={{ htmlInput: { maxLength: props.maxLength } }}
				inputRef={ref}
			/>
			type: {typeof props.currentValue}
		</Paper>
	);
});

// Set displayName for the forwardRef component (optional but good practice)
ChangeFieldInput.displayName = "ChangeFieldInput";

export default ChangeFieldInput;
