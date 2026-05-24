import { createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import Articles from "@/pages/Articles";
import ArticleDetail from "@/pages/ArticleDetail";
import Liked from "@/pages/Liked";
import ReadLater from "@/pages/ReadLater";
import Sources from "@/pages/Sources";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "articles", element: <Articles /> },
      { path: "articles/:id", element: <ArticleDetail /> },
      { path: "liked", element: <Liked /> },
      { path: "read-later", element: <ReadLater /> },
      { path: "sources", element: <Sources /> },
    ],
  },
]);
