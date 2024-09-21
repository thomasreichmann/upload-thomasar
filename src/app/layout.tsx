import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "~/app/_components/theme";
import Settings from "~/app/_components/settings";
import { HydrateClient } from "~/trpc/server";
import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

export const metadata: Metadata = {
	title: "Upload Thomasar",
	description: "Generated by create-t3-app",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={`${GeistSans.variable}`}>
			<body>
				over here
				<AppRouterCacheProvider>
					<ThemeProvider theme={theme}>
						<CssBaseline />
						<TRPCReactProvider>
							<HydrateClient>
								<Settings />
								{children}
							</HydrateClient>
						</TRPCReactProvider>
					</ThemeProvider>
				</AppRouterCacheProvider>
			</body>
		</html>
	);
}
