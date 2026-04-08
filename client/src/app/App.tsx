import { RouterProvider } from "react-router";
import { AuthProvider } from "../contexts/AuthContext.tsx";
import { LanguageProvider } from "../contexts/LanguageContext.tsx";
import { router } from "./routes.tsx";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </LanguageProvider>
  );
}
