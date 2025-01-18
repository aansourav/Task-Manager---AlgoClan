import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Task Manager | Algo Clan",
    description: "Simple task manager CRUD app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
