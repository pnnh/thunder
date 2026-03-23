import './index.css';

import * as React from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {Provider} from "jotai";
import {WelcomePage} from "@/pages/welcome/welcome";
import {NotePage} from "@/pages/note/page";
import {ViewPage} from "@/pages/note/viewer/viewer";
import {MarkdownEditorPage} from "@/pages/note/editor/page";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage/>,
    },
    {
        path: "/note",
        element: <NotePage/>,
    },
    {
        path: "/note/view",
        element: <ViewPage/>,
    },
    {
        path: "/note/editor",
        element: <MarkdownEditorPage/>,
    }
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
