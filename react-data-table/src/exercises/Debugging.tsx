import React from "react";
import { Grid, Typography, Paper } from "@mui/material";
import { useState } from "react";
import { useRef } from "react";

/// -------------------- Begin Exercise Code -------------------- ///
/// Code in this block (ended by the similar comment several lines below),
/// are relevant to the exercise. You can ignore all other code

interface TodoListAppProps {}

interface TodoInterface {
  id: number;
  body: string;
  isComplete?: boolean;
}

const INITIAL_TODOS = [
  {
    id: 0,
    body: "I am the body of a default todo.",
  },
  {
    id: 1,
    body: "I am the body of a complete todo",
    isComplete: true,
  },
];

// TODO (...a todo haha) more decomposition would be nice - a separate todo item component
const TodoListApp: React.FC<TodoListAppProps> = () => {
  const counter = useRef(INITIAL_TODOS.length);
  const [todos, setTodos] = useState<TodoInterface[]>(INITIAL_TODOS);
  const [input, setInput] = useState("");

  const submitNewTodo = () => {
    const newTodo = {
      id: counter.current,
      body: input,
    };
    counter.current += 1;
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodoComplete = (id: number) => {
    setTodos((prev) => {
      const index = prev.findIndex((todo) => todo.id === id);
      // update the nested property without mutatiting the original state
      const newState = [...prev];
      newState.splice(index, 1, {...(prev[index]), isComplete: !prev[index].isComplete});
      return newState;
    });
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => id !== todo.id));
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{ display: "flex", justifyContent: "center", marginBottom: 50 }}
      >
        <form onSubmit={(e) => {
              submitNewTodo();
              setInput("");
              e.preventDefault()
            }}>
          <input type="text" placeholder="Add a todo!" value={input} onChange={(e) => setInput(e.target.value)} />
          <button type="submit">
            Submit Todo
          </button>
        </form>
      </div>
      {todos.map((todo) => (
        <div
          style={{
            border: todo.isComplete ? "1px solid darkgreen" : "1px solid grey",
            display: "flex",
            padding: 5,
            width: 500,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: todo.isComplete ? "green" : "initial",
            color: todo.isComplete ? "white" : "initial",
          }}
          key={todo.id}
        >
          <p style={{ textOverflow: "wrap", maxWidth: "75%" }}>{todo.body}</p>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              <label
                id={`${todo.body}-label`}
                htmlFor={`${todo.body}-checkbox`}
              >
                Complete
              </label>
              <input
                id={`${todo.body}-checkbox`}
                type="checkbox"
                checked={Boolean(todo.isComplete)}
                onChange={() => toggleTodoComplete(todo.id)}
              />
            </div>
            <button
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
/// -------------------- End Exercise Code -------------------- ///

interface TodoProps {}

const Todo: React.FC<TodoProps> = () => {
  return (
    <Grid container direction="column">
      <Paper style={{ padding: 25, marginBottom: 75 }}>

        <Typography variant="h3" align="center">
          Debugging
        </Typography>

        <Typography paragraph component="div">
          This exercise is to dig into existing code and find the issues with it.
          There are several problems with this small app. Fix any and all problems
          that you discover, even if they aren't 100% necessary to get the app working.
        </Typography>

        <Typography paragraph component="div">
          In terms of what we mean by the "app working", here's exactly what you
          should be able to do:
          <ul>
            <li>
              <b>Add:</b> the "Submit Todo" button should add a new todo. This
              todo should be shown on the screen, and a user should be able to
              continue adding as many new todos as they want.
            </li>
            <li>
              <b>Complete:</b> checking the "Complete" checkbox should mark it
              as complete. The todo should turn green when that happens.
            </li>
            <li>
              <b>Delete:</b> clicking the delete button should remove that todo
              and <strong>only</strong> that todo.
            </li>
          </ul>
        </Typography>

      </Paper>
      <TodoListApp />
    </Grid>
  );
};

export default Todo;
