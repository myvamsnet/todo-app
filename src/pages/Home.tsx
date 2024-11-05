import { Outlet } from "react-router-dom";
import { useAddTodo } from "../hook/useAddTodo";

const Home = () => {
  const { handleChange, handleTodo, title, isPending, todo, updatingTodo } =
    useAddTodo();

  return (
    <main className="container mx-auto py-10">
      <form
        className=" space-x-4"
        onSubmit={handleTodo}
      >
        <input
          type="text"
          className="px-4 py-2 border-gray-200 h-[44px] border"
          onChange={handleChange}
          value={title}
        />
        <button
          disabled={isPending || updatingTodo}
          className="bg-green-500 text-white py-2 px-4"
        >
          {" "}
          {isPending || updatingTodo
            ? "Loading..."
            : todo?.documentId
            ? "Update Todo"
            : "add Todo"}
        </button>
      </form>
      <Outlet />
    </main>
  );
};

export default Home;
