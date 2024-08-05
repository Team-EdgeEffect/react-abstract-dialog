import { createBrowserRouter } from "react-router-dom";
import HomeContainer from "../_home-container";
import HelloWorldContainer from "../_hello-world-container";
import AppContent from "../app-content";

export const router = createBrowserRouter([
    {
        Component: AppContent,
        children: [
            {
                path: "/",
                element: <HomeContainer />,
            },
            {
                path: "/hello-world",
                element: <HelloWorldContainer />,
            },
        ],
    },
]);
