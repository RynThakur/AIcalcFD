import { createBrowserRouter, RouterProvider } from "react-router-dom";
import '@mantine/core/styles.css';
import { MantineProvider } from "@mantine/core";

import Home from "./screens/home";
import '@/index.css'

const path = [
  {
    path:'/',
    element:(
      <Home/>
    ),
  },
];

const BrowserRouter = createBrowserRouter(path);

const App = ()=>{
  return(
    <MantineProvider>
      <RouterProvider router={BrowserRouter}/>
    </MantineProvider>
  );
}
export default App;
