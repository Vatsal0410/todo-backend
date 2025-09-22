import Router from "express";
import fs from "fs";
import path from "path";
import { Todo } from "../models/Todo";

const router = Router();
const filePath = path.join(process.cwd(), "src/data/todos.json");

const readTodos = (): Todo[] => {
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data || "[]");
};

const writeTodos = (todos: Todo[]) => {
  fs.writeFileSync(filePath, JSON.stringify(todos, null, 2));
};

// Get all todos
router.get("/", (req, res) => {
  res.json(readTodos());
});

// Add new todo
router.post("/", (req, res) => {
  const todos = readTodos();
  const newTodo: Todo = {
    id: Date.now(),
    text: req.body.text,
    completed: false,
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// Toggle todo
router.put("/:id", (req, res) => {
  const todos = readTodos();
  const id = Number(req.params.id);

  const updated = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  writeTodos(updated);
  res.json(updated.find(todo => todo.id === id));
});

// Delete todo
router.delete("/:id", (req, res) => {
  const todos = readTodos();
  const id = Number(req.params.id);

  const filtered = todos.filter(todo => todo.id !== id);
  writeTodos(filtered);
  res.status(204).end();
});

export default router;
