import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import HistoirePage from "./pages/HistoirePage";
import ArticlesPage from "./pages/ArticlesPage";
import MemberArticlesPage from "./pages/MemberArticlesPage";
import FormulairePage from "./pages/FormulairePage";
import GalleriePage from "./pages/GalleriePage";
import BackMemberPage from "./pages/BackMemberPage";

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
    Component: MemberArticlesPage,
  },
  {
    path: "/backoffice/membres",
    Component: BackMemberPage,
  },
]);