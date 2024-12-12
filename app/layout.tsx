// Import necessary types and dependencies
import type { Metadata } from "next"; 					// Type definition for metadata in Next.js
import { Geist, Geist_Mono } from "next/font/google"; 	// Import Google Fonts for styling
import "./globals.css"; 								// Global CSS file for styling

// Importing custom and pre-defined providers
import { ClerkProvider } from "@clerk/nextjs";
import RootProviders from "@/components/providers/RootProviders";

// Define custom font configurations using next/font/google
const geistSans = Geist({
	variable: "--font-geist-sans", 						// CSS variable for Geist Sans font
	subsets: ["latin"], 								// Specify the character subset
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono", 						// CSS variable for Geist Mono font
	subsets: ["latin"], 								// Specify the character subset
});

// Define metadata for the application
export const metadata: Metadata = {
	title: "Budgetly", 									
	description: "Track and manage your budget with ease.", 
};

// RootLayout component: wraps the application with common layouts and providers
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode; 
}>) {
	return (
		<ClerkProvider>
			<html lang="en" className="dark" style={{ colorScheme: "dark" }} >
				<head>
					<title>Budgetly</title>
					<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
				</head>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`} >
					<RootProviders>{children}</RootProviders>
				</body>
			</html>
		</ClerkProvider>
	);
}
