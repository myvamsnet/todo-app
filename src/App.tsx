import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import TodoEdit from "./pages/TodoEdit";
import Todos from "./pages/Todos";

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      children: [
        {
          element: <Todos />,
          index: true,
        },
        {
          path: ":id",
          element: <TodoEdit />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
};

export default App;
