import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./styles/styles.css";

import DefaultLayout from './layouts/DefaultLayout';
import Root from './routes/root';

const router = createBrowserRouter([
	{
		element: <DefaultLayout />,
		children: [
			{
				path: "/",
				element: <Root />
			}
		]
	},
	{
		path: "*",
		element: "Not found"
	}
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
)
