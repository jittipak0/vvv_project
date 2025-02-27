import { AuthProvider } from "@/context/AuthContext";
import "@/styles/globals.css";

export const metadata = {
  title: "VVV Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
