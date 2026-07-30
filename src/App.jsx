import { useEffect, useState } from 'react';
import './App.css';

// TodoItemコンポーネントを定義
function TodoItem({todo, onToggle, onDelete, onTagChange, tagOptions}) {
    return(
        <li className="todo-item" style = {{textDecoration: todo.done ? 'line-through' : 'none'}}>
            <div className="todo-content">
                <input
                    type = 'checkbox'
                    checked = {todo.done}
                    onChange = {onToggle}
                />
                {todo.text}
                <select 
                value =  {todo.tag} 
                className="tag-label"
                onChange = {(e) => onTagChange(e.target.value)}> //e.target.valueってどんな意味？
                    {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select> 
            </div>
            <button className="delete-btn" onClick = {onDelete}>削除</button>
        </li>
    );
}

export default function App(){
    const tagOptions = ['work', 'study', 'exercise', 'hobby']; // タグの選択肢を定義

    // useStateを使って、textとtodosの状態を管理
    const [text, setText] = useState('');
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos'); // ローカルストレージから保存されたtodosを取得
        if (!saved) {
            return [];
        }
        const parsedTodos = JSON.parse(saved);
        return parsedTodos.map((todo) => {
            let updatedTodo = todo;
            if (updatedTodo.id === undefined) {
                updatedTodo = { ...updatedTodo, id: Date.now() + Math.random() }; // idがない場合は新しいidを生成
            }
            if (updatedTodo.tag === undefined) {
                updatedTodo = { ...updatedTodo, tag: tagOptions[0] }; // tagがない場合は最初のタグを設定
            }
            return updatedTodo;
        });
    });
    const [filter, setFilter] = useState('all'); // フィルターの状態を管理
    const filteredTodos = todos.filter((todo) => {
        if (filter === 'active') return !todo.done;
        if (filter === 'completed') return todo.done;
        return true;
    });

    const [selectedTag, setSelectedTag] = useState(tagOptions[0]); // タグの状態を管理

    // todosが変更されるたびにローカルストレージに保存する
    useEffect(() =>{
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    //追加ボタンを押したときに呼ばれる関数
    function addTodo() {
        setTodos([...todos, {id: Date.now(), text: text, done: false, tag: selectedTag}]); // 新しいtodoを追加
        setText(''); // 入力欄を空にする
        //console.log(todos); // 実験的に追加
    }

    //チェックを入れる関数
    function toggleDone(id) {
        const newTodos = todos.map((todo) => {
            if (todo.id === id) {  // クリックされたtodoのIDと一致する場合
                return {...todo, done: !todo.done}; // ここでdoneの値を反転させる
            } else { // それ以外のtodoはそのまま返す
                return todo;
            }
        });
        setTodos(newTodos);
    }

    function updateTag(id, newTag) {
        const newTodos = todos.map((todo) => {
            if (todo.id === id) {  // クリックされたtodoのIDと一致する場合
                return {...todo, tag: newTag}; // ここでdoneの値を反転させる
            } else { // それ以外のtodoはそのまま返す
                return todo;
            }
        });
        setTodos(newTodos);
    }

    //削除ボタンを押したときに呼ばれる関数
    function deleteTodo(id){
        const newTodos = todos.filter((todo) => todo.id !== id); // クリックされたtodoのIDと一致しないものだけを残す
        setTodos(newTodos);
    }

    return (
        <div className="todo-app">
            <h1>Hello, React ToDo App!</h1>
            <div className="input-area">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <select value={selectedTag} onChange = {(e) => setSelectedTag(e.target.value)}>
                    {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <button onClick={addTodo}>追加</button>
            </div>

            <div className="filter-btns">
                <button 
                className={filter === 'all' ? 'active' : ''}
                onClick={() => setFilter('all')}
                >
                すべて
                </button>

                <button 
                className = {filter === 'active' ? 'active' : ''}
                onClick={() => setFilter('active')}
                >
                未完了
                </button>

                <button 
                className = {filter === 'completed' ? 'active' : ''}
                onClick={() => setFilter('completed')}
                >
                完了済み
                </button>
            </div>

            <ul>
                {filteredTodos.map((todo) => (
                    <TodoItem 
                        key = {todo.id}
                        todo = {todo} 
                        onToggle = {() => toggleDone(todo.id)}
                        onDelete = {() => deleteTodo(todo.id)}
                        onTagChange = {(newTag) => updateTag(todo.id, newTag)}
                        tagOptions = {tagOptions}
                    />
                ))}
            </ul>
        </div>
    );
}