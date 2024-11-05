import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

export const useDelete = () => {
  // Access the client
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: async (id: string) => {
      // Create Todo
      const res = await axios.delete(`http://localhost:1337/api/todos/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Deleted");
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["todos-list"] });
    },
    onError: (error) => {
      toast.error("Todo Fail to Delete");
      console.log(error);
    },
  });

  return {
    deleting: isPending,
    deleteMutate: mutate,
  };
};
