import React from "react";
import { Box, IconButton, ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import {
	DeleteOutline,
	Folder as FolderIcon,
	InfoOutlined,
	Link as LinkIcon,
} from "@mui/icons-material";

interface FileListItemProps {
	id?: string;
	name: string;
	onInfoClick?: () => void;
}

export default function FileListItem(props: FileListItemProps) {
	return (
		<ListItem
			secondaryAction={
				<Box className="flex gap-2">
					<IconButton edge="end" aria-label="delete">
						<LinkIcon />
					</IconButton>
					<IconButton edge="end" aria-label="delete" onClick={props.onInfoClick}>
						<InfoOutlined />
					</IconButton>
					<IconButton edge="end" aria-label="folder">
						<DeleteOutline color="error" />
					</IconButton>
				</Box>
			}
		>
			<ListItemIcon>
				<FolderIcon />
			</ListItemIcon>
			<Tooltip title={props.name} enterDelay={500} enterNextDelay={500}>
				<ListItemText
					primary={props.name}
					className="mr-20 truncate"
					primaryTypographyProps={{ className: "truncate" }}
				/>
			</Tooltip>
		</ListItem>
	);
}
