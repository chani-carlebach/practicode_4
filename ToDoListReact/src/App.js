import React, { useEffect, useState } from 'react';
import service from './service.js';

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]); // כאן הגדרת setTodos

  async function getTodos() {
    const tasks = await service.getTasks();
    setTodos(tasks);
  }

  async function createTodo(e) {
    e.preventDefault();
    console.log("CreateTodo was triggered!"); // הוסיפי את זה
    if (!newTodo.trim()) return; // מניעת הוספת משימה ריקה
    await service.addTask(newTodo);
    setNewTodo(""); 
    await getTodos(); 
  }

async function updateCompleted(task) {
  // 1. עדכון בשרת
  await service.setCompleted(task.id, task.name, !task.isComplete);
  
  // 2. עדכון ה-UI בצורה חכמה בלי לקרוא ל-getTodos() מהשרת שוב
  setTodos(prevTodos => 
    prevTodos.map(t => t.id === task.id ? { ...t, isComplete: !t.isComplete } : t)
  );
}

  async function deleteTodo(id) {
    await service.deleteTask(id);
    await getTodos();
  }

  useEffect(() => {
    getTodos();
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <form onSubmit={createTodo}>
          <input 
            className="new-todo" 
            placeholder="Well, let's take on the day" 
            value={newTodo} 
            onChange={(e) => setNewTodo(e.target.value)} 
          />
        </form>
      </header>
      <section className="main" style={{ display: "block" }}>
        <ul className="todo-list">
          {todos.map(todo => {
            return (
              <li className={todo.isComplete ? "completed" : ""} key={todo.id}>
                <div className="view">
                  <input 
          className="toggle" 
          type="checkbox" 
          checked={todo.isComplete || false} 
          onChange={(e) => {
            e.stopPropagation(); // זה ימנע מהאירוע להפעיל את ה-form למעלה
            // כאן todo מוכר כי אנחנו בתוך ה-map
            updateCompleted(todo);
          }} 
        /> 
         <label>{todo.name}</label>
                  <button className="destroy" onClick={() => deleteTodo(todo.id)}></button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}

export default App;