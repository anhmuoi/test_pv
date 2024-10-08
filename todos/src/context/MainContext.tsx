import { TodoType } from "../types";
import { createContext, useState, useEffect, ReactNode } from "react";

interface MainContextInterface {
  todos: TodoType[];
  setTodos: React.Dispatch<React.SetStateAction<TodoType[]>>;
  markComplete: (id: string) => void;
  delTodo: (id: string) => void;
  deleteAll: () => void;
  editTodo: (id: string, text: string) => void;
  addTodo: (title: string) => void;
  moveTodo: (old: number, new_: number) => void;
  markStar: (id: string) => void;
}

interface Props {
  children: ReactNode;
}

export const MainContext = createContext<MainContextInterface | null>(null);

export const MainProvider = ({ children }: Props) => {
  const [todos, setTodos] = useState<TodoType[]>(
    JSON.parse(localStorage.getItem("todos")!) || []
  );
  const baseUrl = 'http://localhost:3000/api';
  const resourceName = 'todos';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImJydW5vQGVtYWlsLmNvbSIsInBhc3N3b3JkIjoiYnJ1bm8iLCJpYXQiOjE2NTE4Mzc3MjksImV4cCI6MTY1MTg0MTMyOX0.cI66qAN6oGO5vQBeufyRLvldaEE9aiHzvVJXIuN0T3E'; 

  useEffect(() => {
    // Fetch todos from the API
    const fetchTodos = async () => {
      try {
        const response = await fetch(`${baseUrl}/${resourceName}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTodos(data); // Set the todos state with the response
        } else {
          console.error('Failed to fetch todos:', response.status);
        }
      } catch (error) {
        console.error('Error fetching todos:', error);
        localStorage.setItem("todos", JSON.stringify(todos))
      }
    };

    fetchTodos();
  }, [todos]);

  const addTodo = async (title: string) => {

    try {
      //  api post to do
      if (title.trim()) {
        const newTodo = {
          id: String(Math.random() * 5000),
          title,
          completed: false,
          starred: false,
        };
        
        
        const response = await fetch(`${baseUrl}/${resourceName}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const createdTodo = await response.json();
        setTodos((prevTodos) => [...prevTodos, createdTodo]); // Add the new todo to the existing list
      } else {
        console.error('Failed to add new todo:', response.status);
        const newTodo = {
          id: String(Math.random() * 5000),
          title,
          completed: false,
          starred: false,
        };
        const orderTodos = [newTodo, ...todos];
        orderStarAndComplete(orderTodos);
        setTodos(orderTodos);
      }
    }
    } catch (error) {
      
      
      console.error('Error adding new todo:', error);
    }
  };



  const editTodo = async (id: string, text: string) => async (
    id: string,
    text: string
  ) => {
    try {
      if (!(text === null) && text.trim()) {
        const editingTodo = todos.find(t=> t.id === id);
        const updatedTodo = {
          ...editingTodo,
          title: text, // Update the title with the new value
        };
    
        const response = await fetch(`${baseUrl}/${resourceName}/${updatedTodo.id}`, {
          method: 'PUT', // You can use PATCH for partial updates
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTodo),
        });

        if (response.ok) {
          const updated = await response.json();
          setTodos((prevTodos) =>
            prevTodos.map((todo) => (todo.id === updated.id ? updated : todo))
          );
        } else {
          console.error('Failed to update todo:', response.status);
        }
      }
    } catch (error) {
      
      setTodos(
        todos.map((todo) => {
          if (todo.id === id) todo.title = text;
          return todo;
        })
      );
      console.error('Error updating todo:', error);
    }
  };


  
  const markComplete = (id: string) => {
    const orderTodos = todos.map((todo) => {
      if (todo.id === id) todo.completed = !todo.completed;
      return todo;
    });
    orderStarAndComplete(orderTodos);
    setTodos(orderTodos);
  };

  const markStar = (id: string) => {
    const orderTodos = todos.map((todo) => {
      if (todo.id === id) todo.starred = !todo.starred;
      return todo;
    });
    orderStarAndComplete(orderTodos);
    setTodos(orderTodos);
  };

  const orderStarAndComplete = (todos: TodoType[]) => {
    todos.sort((x, y) => y.starred - x.starred);
    todos.sort((x, y) => x.completed - y.completed);
  };

  const delTodo = (id: string) =>
    setTodos(todos.filter((todo) => todo.id !== id));
  const deleteAll = () => setTodos([]);
  const moveTodo = (old: number, new_: number) => {
    const copy = JSON.parse(JSON.stringify(todos));
    const thing = JSON.parse(JSON.stringify(todos[old]));
    copy.splice(old, 1);
    copy.splice(new_, 0, thing);
    setTodos(copy);
  };

  const mainContextValue: MainContextInterface = {
    todos,
    setTodos,
    markComplete,
    delTodo,
    deleteAll,
    editTodo,
    addTodo,
    moveTodo,
    markStar,
  };

  return (
    <MainContext.Provider value={mainContextValue}>
      {children}
    </MainContext.Provider>
  );
};
