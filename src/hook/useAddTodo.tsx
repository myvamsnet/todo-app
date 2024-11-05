import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { toast } from "react-toastify";
import useUpdateTodo from "./useUpdateTodo";
import TodoContext from "../context/todoContext";

export const useAddTodo = () => {
  const { title, setTitle } = useContext(TodoContext);
  const { todo, handleUpdateTodo, updatingTodo } = useUpdateTodo();
  // Access the client
  const queryClient = useQueryClient();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const { isPending, mutate } = useMutation({
    mutationFn: async (payload: Payload) => {
      // Create Todo
      const res = await axios.post("http://localhost:1337/api/todos", payload);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Added");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos-list"] });
      setTitle("");
    },
    onError: (error) => {
      toast.error("Todo Fail to add");
      console.log(error);
    },
  });

  const handleTodo = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim() === "") {
      return toast.error("Title Cannot be empty");
    }
    if (todo?.documentId) {
      handleUpdateTodo(event, title);
      setTitle("");
      return;
    }
    const payload = {
      data: {
        title,
        isCompleted: false,
      },
    };
    return mutate(payload);
  };

  return {
    handleTodo,
    handleChange,
    title,
    isPending,
    todo,
    handleUpdateTodo,
    updatingTodo,
  };
};
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
