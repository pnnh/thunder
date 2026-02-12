import './index.css';

import * as React from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import {Provider} from "jotai";
import {WelcomePage} from "@/pages/welcome/welcome";
import {NotebookPage} from "@/pages/notebook/page";
import {NotesPage} from "@/pages/notes/page";
import {NoteEditorPage} from "@/pages/notes/editor/page";

const router = createBrowserRouter([
    {
        path: "/",
        element: <WelcomePage/>,
    },
    {
        path: "/notebook",
        element: <NotebookPage/>,
    },
    {
        path: "/notes",
        element: <NotesPage/>,
    },
    {
        path: "/editor",
        element: <NoteEditorPage/>,
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
