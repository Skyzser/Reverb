import "./globals.css";

import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "Reverb",
  description: "Online web-application for editing audio",
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen mainBg mainTextColour">
        {/* This is the container for all toast alerts (custom alerts instead of the default alert) */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2000,
          }}
        />
        {children}
      </body>
    </html>
  );
}
