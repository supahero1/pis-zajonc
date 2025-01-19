import localFont from "next/font/local";
import "./globals.css";
import {AuthContext, AuthProvider} from "@/app/AuthContext";
import NavBar from "@/app/front-page/NavBar";


const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export const metadata = {
    title: "Sigma Store",
    description: "Sigma store",
};
export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >

        <AuthProvider>

            <NavBar/>
            {children}

        </AuthProvider>

        </body>
        </html>
    );
}
