import { useEffect, useState } from 'react';
import './App.css';

function TodoItem({todo, onToggle, onDelete}){
    return(
        <li style = {{textDecoration: todo.done ? 'line-through' : 'none'}}>
            <input
                type = 'checkbox'
                checked = {todo.done}
                onChange = {onToggle}
            />
            {todo.text} <button className="delete-btn" onClick = {onDelete}>削除</button>
        </li>
    );
}

export default function App(){
    const [text, setText] = useState('');
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() =>{
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    function addTodo() {
        setTodos([...todos, {text: text, done: false}]);
        setText('');
        //console.log(todos); // 実験的に追加
    }

    function toggleDone(index) {
        const newTodos = todos.map((todo, i) => {
            if (i === index) {
                return {...todo, done: !todo.done};
            } else {
                return todo;
            }
        });
        setTodos(newTodos);
    }

    function deleteTodo(index){
        const newTodos = todos.filter((todo, i) => i !== index);
        setTodos(newTodos);
    }

    return (
        <div className="todo-app">
            <h1>Hello, React ToDo App!</h1>
            <input
                value={text} 
                onChange={(e) => setText(e.target.value)} 
            /> 
            <button onClick={addTodo}>追加</button>
            <ul>
                {todos.map((todo, index) => (
                    <TodoItem 
                        key = {index}
                        todo = {todo} 
                        onToggle = {() => toggleDone(index)}
                        onDelete = {() => deleteTodo(index)}
                    />
                ))}
            </ul>
        </div>
    );
}