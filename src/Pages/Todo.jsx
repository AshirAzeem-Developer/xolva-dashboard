import { SquarePen, Trash } from "lucide-react";
import React, { useState } from "react";

const Todo = () => {
  const [todos, setTodos] = useState(["Test"]);
  const [newTodo, setNewTodo] = useState("");
  const [editingIndex, setEditingIndex] = useState();

  function addTodo() {
    if (newTodo === "") return;

    if (editingIndex !== undefined) {
      //   const updatedTodos = [...todos];
      todos[editingIndex] = newTodo;
      setTodos(todos);
      setEditingIndex(undefined);
      setNewTodo("");
      return;
    }

    setTodos([...todos, newTodo]);
    setNewTodo("");
  }

  function deleteTodo(index) {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  }
  function updateTodo(index, todo) {
    setNewTodo(todo);
    setEditingIndex(index);
  }

  return (
    <>
      <div className="w-screen h-screen text-black flex flex-col items-center justify-center">
        <h1>TODO</h1>
        <div className="flex ">
          <div className="flex flex-col  items-center ">
            <input
              value={newTodo}
              type="text"
              className="bg-slate-200 p-4  w-2xl"
              onChange={(e) => setNewTodo(e.target.value)}
            />
            <div className="max-w-7xl w-2xl mt-4">
              {todos.map((todo, index) => {
                return (
                  <div
                    key={index}
                    className="mt-4  h-[60px] bg-amber-200 p-3 flex items-center justify-between   "
                  >
                    <h4 className="text-black text-2xl">{todo}</h4>
                    <div className="flex">
                      <button
                        className="mx-2"
                        onClick={() => deleteTodo(index)}
                      >
                        <Trash size={20} color="white" />
                      </button>
                      <button onClick={() => updateTodo(index, todo)}>
                        <SquarePen size={20} color="white" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <button
            className="w-34 h-14 mx-2 text-white"
            onClick={() => addTodo()}
          >
            {editingIndex === undefined ? "Add" : "Update"}
          </button>
        </div>

        {/* This is the Todos List */}
      </div>
    </>
  );
};

export default Todo;
