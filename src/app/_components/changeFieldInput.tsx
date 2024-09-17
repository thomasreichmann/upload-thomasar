import React, { forwardRef, type HTMLInputTypeAttribute } from "react";
import { Paper, TextField } from "@mui/material";
import TooltipTypography from "~/app/_components/tooltipTypography";

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

	const chooseTooltipTitle = () => props.displayName ?? props.name;

	return (
		<Paper elevation={2} className="flex w-36 flex-col items-center justify-center gap-8 p-4">
			<Paper elevation={3} className="flex w-full flex-col items-center justify-center">
				<div className="w-full truncate p-2 text-center">
					<TooltipTypography text={chooseTooltipTitle()} />
				</div>
				<Paper elevation={4} className="w-full truncate p-2 text-center">
					<TooltipTypography text={chooseValueToDisplay()} color="text.secondary" />
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
		</Paper>
	);
});

// Set displayName for the forwardRef component (optional but good practice)
ChangeFieldInput.displayName = "ChangeFieldInput";

export default ChangeFieldInput;
