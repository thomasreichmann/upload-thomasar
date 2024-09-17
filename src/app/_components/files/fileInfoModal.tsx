import React from "react";
import ModalBase from "~/app/_components/modalBase";

interface FileInfoModalProps {
	open: boolean;
	onClose: () => void;
}

export default function FileInfoModal(props: FileInfoModalProps) {
	return (
		<ModalBase open={props.open} onClose={props.onClose}>
			<h1 className="mb-6 text-xl font-bold">nome do arquivo que foi clicado info</h1>
			<LabeledValue label="Upload Date" value={new Date().toLocaleString()} />
			<LabeledValue label="Times downloaded" value={"2"} />
		</ModalBase>
	);
}

function LabeledValue(props: { label: string; value: string }) {
	return (
		<p>
			<span className="mr-1 font-bold">{props.label}:</span>
			{props.value}
		</p>
	);
}
