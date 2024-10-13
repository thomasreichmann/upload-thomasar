"use client";
import { setCookie } from "cookies-next";
import { api } from "~/trpc/react";

interface CookieSetterProps {
	name: string;
	value: string;
}

export function UserCookieSetter() {
	const [user] = api.user.get.useSuspenseQuery();

	return <CookieSetter name="sessionId" value={user.sessionId} />;
}

export default function CookieSetter(props: CookieSetterProps) {
	setCookie(props.name, props.value, { sameSite: true, path: "/" });

	return <></>;
}
