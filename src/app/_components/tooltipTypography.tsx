import React from "react";
import { Tooltip, Typography, type TypographyProps } from "@mui/material";

interface TooltipTypographyProps {
	text: string;
	className?: string;
	color?: TypographyProps["color"];
}

const TooltipTypography = (props: TooltipTypographyProps) => {
	return (
		<Tooltip title={props.text} enterDelay={500} enterNextDelay={500}>
			<Typography className={`truncate ${props.className ?? ""}`} color={props.color}>
				{props.text}
			</Typography>
		</Tooltip>
	);
};

export default TooltipTypography;
