import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDelete } from "../hook/useDelete";
import useUpdateTodo from "../hook/useUpdateTodo";

const Todos = () => {
  const { deleteMutate, deleting } = useDelete();
  const { deleteQueryParam, todoId } = useUpdateTodo();
  const navigate = useNavigate();
  // Get All Todos
  const { data, status, error } = useQuery<TodosResponseApi>({
    queryKey: ["todos-list"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:1337/api/todos");
      return res.data;
    },
  });
  const todos = data?.data;

  if (status === "pending") {
    return <p>Loading</p>;
  }
  if (status === "error") {
    return <p>Something went wrong {error.message}</p>;
  }
  return (
    <section className="py-4">
      <ul className="grid gap-4">
        {todos && todos?.length > 0 && status === "success" ? (
          todos?.map((todo) => (
            <li
              key={todo.documentId}
              className="flex gap-4"
            >
              <p className="text-green-600">{todo.title}</p>
              <button
                className="bg-blue-500 py-1 px-2 text-white"
                onClick={() => {
                  if (todoId) {
                    return deleteQueryParam("id");
                  }
                  return navigate(`/?id=${todo.documentId}`);
                }}
              >
                {todoId ? "Cancel" : "Edit"}
              </button>
              <button
                className="bg-red-500 py-1 px-2 text-white"
                onClick={() => deleteMutate(todo.documentId)}
                disabled={deleting}
              >
                {deleting ? "Loading..." : "Delete"}
              </button>
            </li>
          ))
        ) : (
          <li>No Todo found</li>
        )}
      </ul>
    </section>
  );
};

export default Todos;
export interface TodosResponseApi {
  data: Data[];
  meta: Meta;
}

export interface Data {
  id: number;
  documentId: string;
  title: string;
  isCompleted: boolean;
  username: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface Meta {
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}
