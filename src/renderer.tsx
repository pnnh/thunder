import './index.css';

import * as React from "react";
import {createRoot} from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    Link,
} from "react-router-dom";
import {Provider} from "jotai";
import {WelcomePage} from "@/welcome/welcome";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage/>,
    },
]);

const rootElement = document.getElementById("root")
if (!rootElement) {
    throw new Error("Root element not found");
}

createRoot(rootElement).render(

    <Provider>
        <RouterProvider router={router}/>
    </Provider>
);
