import { createContext, Dispatch, SetStateAction, useState } from "react";

const TodoContext = createContext<TodosProps>({
  title: "",
  setTitle: () => {},
});

export const TodoContextProvider = ({ children }: Props) => {
  const [title, setTitle] = useState("");
  return (
    <TodoContext.Provider
      value={{
        title,
        setTitle,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export default TodoContext;
interface Props {
  children: React.ReactNode;
}

interface TodosProps {
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}
