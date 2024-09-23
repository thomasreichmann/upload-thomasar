"use client";
import React from "react";
import { setCookie } from "cookies-next";

interface CookieSetterProps {
	name: string;
	value: string;
}

export default function CookieSetter(props: CookieSetterProps) {
	setCookie(props.name, props.value, { sameSite: true });

	return <></>;
}
