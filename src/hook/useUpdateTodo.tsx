import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import TodoContext from "../context/todoContext";

const useUpdateTodo = () => {
  const { setTitle } = useContext(TodoContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const deleteQueryParam = (param: string) => {
    const newParams = new URLSearchParams(searchParams);
    // Delete the specified query parameter
    newParams.delete(param);
    // Update the URL with the modified search params
    setSearchParams(newParams);
    return setTitle("");
  };
  const todoId = searchParams.get("id");
  const validateId = Boolean(todoId !== undefined && todoId !== null);
  // Access the client
  const queryClient = useQueryClient();

  const { mutate, isPending: updatingTodo } = useMutation({
    mutationFn: async (payload: Payload) => {
      // Update Todo
      if (validateId) {
        const res = await axios.put(
          `http://localhost:1337/api/todos/${todoId}`,
          payload
        );
        return res.data;
      }
    },
    onSuccess: () => {
      toast.success("Updated");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos-list"] });
      deleteQueryParam("id");
    },
    onError: (error) => {
      toast.error("Todo Fail to add");
      console.log(error);
    },
  });

  // Get Single Todo
  const { data: todo } = useQuery<SingleTodoResponse>({
    queryKey: ["todos-list", todoId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:1337/api/todos/${todoId}`);
      return res.data;
    },
  });

  const handleUpdateTodo = (event: React.FormEvent, title: string) => {
    event.preventDefault();
    if (!title.trim()) {
      return toast.error("Title Cannot be empty");
    }
    const payload = {
      data: {
        title,
        isCompleted: todo?.data?.isCompleted as boolean,
      },
    };
    mutate(payload);
  };
  // To update the state
  useEffect(() => {
    if (todo?.data?.title) {
      setTitle(todo?.data?.title);
    }
  }, [todo?.data, setTitle]);
  return {
    todo: todo?.data,
    handleUpdateTodo,
    deleteQueryParam,
    updatingTodo,
    todoId,
  };
};

export default useUpdateTodo;
interface Payload {
  data: {
    title: string;
    isCompleted: boolean;
  };
}
export interface SingleTodoResponse {
  data: Data;
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
