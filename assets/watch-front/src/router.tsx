import { createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import Articles from "@/pages/Articles";
import Sources from "@/pages/Sources";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "articles", element: <Articles /> },
      { path: "sources", element: <Sources /> },
    ],
  },
]);
