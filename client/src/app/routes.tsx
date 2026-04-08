import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage.tsx";
import HistoirePage from "./pages/HistoirePage.tsx";
import ArticlesPage from "./pages/articles/page.tsx";
import ArticlePage from "./pages/articles/[id].tsx";
import MemberArticlesPage from "./pages/MemberArticlesPage.tsx";
import FormulairePage from "./pages/FormulairePage.tsx";
import GalleriePage from "./pages/GalleriePage.tsx";
import BackMemberPage from "./pages/BackMemberPage.tsx";
import { ProtectedRoute } from "../components/ProtectedRoute.tsx";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomePage,
  },
  {
    path: "/histoire",
    Component: HistoirePage,
  },
  {
    path: "/articles",
    Component: ArticlesPage,
  },
  {
    path: "/articles/:id",
    Component: ArticlePage,
  },
  {
    path: "/gallerie",
    Component: GalleriePage,
  },
  {
    path: "/membres/articles",
    Component: MemberArticlesPage,
  },
  {
    path: "/formulaire",
    Component: FormulairePage,
  },
  {
    path: "/backoffice/articles",
    Component: () => <ProtectedRoute><MemberArticlesPage /></ProtectedRoute>,
  },
  {
    path: "/backoffice/membres",
    Component: () => <ProtectedRoute><BackMemberPage /></ProtectedRoute>,
  },
]);