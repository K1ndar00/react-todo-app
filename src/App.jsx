import { useEffect, useState } from 'react';
import './App.css';

// TodoItemコンポーネントを定義
function TodoItem({todo, onToggle, onDelete, onTagChange, tagOptions}) {
    return(
        <li className="todo-item">
            <div className="todo-info">
                <input
                    type = 'checkbox'
                    checked = {todo.done}
                    onChange = {onToggle}
                />
                <span style = {{textDecoration: todo.done ? 'line-through' : 'none'}}>
                    {todo.text}
                </span>
            </div>
            <div className="todo-actions">
                <select 
                value =  {todo.tag} 
                className="tag-label"
                onChange = {(e) => onTagChange(e.target.value)}> 
                    {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select> 
                <button className="delete-btn" onClick = {onDelete}>削除</button>
            </div>
        </li>
    );
}

export default function App(){
    //----------Selectの選択肢配列---------
    const tagOptions = ['work', 'study', 'exercise', 'hobby']; // タグの選択肢を定義
    const filterOptions = ['all', 'active', 'completed']; // フィルターの選択肢を定義
    const tagFilterOptions = ['all', ...tagOptions]; // フィルターのタグの選択肢を定義

    // ---------useStateの一覧---------
    const [text, setText] = useState('');
    const [selectedTag, setSelectedTag] = useState(tagOptions[0]); // タスク追加欄のタグの状態を管理
    const [filteredTag, setFilteredTag] = useState(tagFilterOptions[0]); // フィルターされたタグの状態を管理
    const [filter, setFilter] = useState('all'); // フィルターの状態を管理
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
    
    //----------フィルター処理---------
    const filteredTodos = todos.filter((todo) => {
        if (filter === 'active' && todo.done) return false;
        if (filter === 'completed' && !todo.done) return false;
        if (filteredTag !== 'all' && todo.tag !== filteredTag) return false;
        return true;
    });

    //----------useEffectの一覧---------
    // todosが変更されるたびにローカルストレージに保存する
    useEffect(() =>{
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    //-----------関数の一覧-------------
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

    function updateFilter(newFilter) {
        setFilter(newFilter);
    }

    //削除ボタンを押したときに呼ばれる関数
    function deleteTodo(id){
        const newTodos = todos.filter((todo) => todo.id !== id); // クリックされたtodoのIDと一致しないものだけを残す
        setTodos(newTodos);
    }

    return (
        <div className="todo-app">
            <h1>Hello, React ToDo App!</h1>

            {/* ToDo追加欄 */}
            <div className="input-area">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <select 
                className="filter-select" 
                value={selectedTag} 
                onChange = {(e) => setSelectedTag(e.target.value)}>
                    {tagOptions.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
                <button onClick={addTodo}>追加</button>
            </div>
            
            {/* フィルター選択欄 */}
            <div className="filter-btns">
                <select 
                className="filter-select"   
                value={filter} onChange={(e) => updateFilter(e.target.value)}>
                    {filterOptions.map((option) => (
                        <option key={option} value={option}>
                            {option === 'all' ? 'すべて' : option === 'active' ? '未完了' : '完了済み'}
                        </option>
                    ))}
                </select>
                <select 
                className="filter-select"   
                value={filteredTag} onChange={(e) => setFilteredTag(e.target.value)}>
                    {tagFilterOptions.map((tag) => (
                        <option key={tag} value={tag}>
                            {tag === 'all' ? 'すべてのタグ' : tag}
                        </option>
                    ))}
                </select>
            </div>

            {/* ToDoリスト表示 */}
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