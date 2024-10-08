import "~/styles/globals.css";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "~/app/_components/theme";
import Settings from "~/app/_components/settings";
import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

import { Roboto } from "next/font/google";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Upload Thomasar",
	description: "Generated by create-t3-app",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={roboto.className}>
			<body>
				<TRPCReactProvider>
					<AppRouterCacheProvider>
						<ThemeProvider theme={theme}>
							<CssBaseline />
							<Settings />
							{children}
						</ThemeProvider>
					</AppRouterCacheProvider>
				</TRPCReactProvider>
			</body>
		</html>
	);
}
