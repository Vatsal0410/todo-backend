import Router from "express";
import fs from "fs";
import path from "path";
import { Todo } from "../models/Todo";

const router = Router();
const filePath = path.join(process.cwd(), "src/data/todos.json");

const readTodos = (): Todo[] => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || "[]");
  } 
  catch (error) {
    console.log("Error reading todos:", error);
    return [];
  }
};

const writeTodos = (todos: Todo[]) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(todos));
  } 
  catch (error) {
    console.log("Error writing todos:", error);
  }
};

// Get all todos
router.get("/", (req, res) => {
  try {
    const todos = readTodos();
    res.json(todos);
  } 
  catch (error) {
    console.log("Error reading todos:", error);
    res.status(500).json({ error: "Error reading todos" });
  }
});

// Add new todo
router.post("/", (req, res) => {
  try {
    const todos = readTodos();
    const newTodo: Todo = { id: Date.now(), text: req.body.text, completed: false };
    todos.push(newTodo);
    writeTodos(todos);
    res.json(newTodo);
  }
  catch (error) {
    console.log("Error adding todo:", error);
    res.status(500).json({ error: "Error adding todo" });
  }
});

// Toggle todo
router.put("/:id", (req, res) => {
  try {
    const todos = readTodos();
    const id = Number(req.params.id);
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
      todo.completed = !todo.completed;
      writeTodos(todos);
      res.json(todo);
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.log("Error toggling todo:", error);
    res.status(500).json({ error: "Error toggling todo" });
  }
});

// Delete todo
router.delete("/:id", (req, res) => {
  try {
    const todos = readTodos();
    const id = Number(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex !== -1) {
      todos.splice(todoIndex, 1);
      writeTodos(todos);
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.log("Error deleting todo:", error);
    res.status(500).json({ error: "Error deleting todo" });
  }
});

export default router;
