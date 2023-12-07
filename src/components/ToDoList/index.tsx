import React, { useState } from 'react';
import { TextField, List, ListItem, ListItemText, Checkbox, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import './todoList.css';
import { RootState } from '../../store';
import { removeTodo, toggleToDoComplete, editText } from '../../store/todoSlice.ts';
import { editInIndexedDB } from '../../db/indexedDB.ts'; 

const ToDoList: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [editId, setEditId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');
  const todos = useSelector((state: RootState) => {
    if (filter.length === 0) {
      return state.todos.todos;
    } else {
      return state.todos.todos.filter(todo => {
        return filter.split(/[,\s]+/).some(filter => todo.tags.includes(filter));
      });
    }
  });
  const dispatch = useDispatch();   

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const tags = input.split(/[,\s]+/).filter(tag => tag.trim() !== '');
    setFilter(tags.join(' '));
  };

  const renderColoredTags = (text: string, completed: boolean) => {
    const words = text.split(' ');
    return words.map((word, index) => {
      const style = completed ? { textDecoration: 'line-through' } : {};
      if (word.startsWith('#')) {
        return (
          <span key={index} style={{ ...style, color: '#47df27' }}>{word} </span>
        );
      }
      return (
        <span key={index} style={style}>{word} </span>
      );
    });
  };

  const handleEditSave = (id: string, newText: string) => {
    dispatch(editText({ id, newText }));
    editInIndexedDB(id, newText); 
    setEditId(null); 
    setText('');
  };
    
  return (
    <div>
      <div className='filterField'>
        <TextField
          label="Filter by hashtag"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>    
      <List>
        {todos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              checked={todo.completed}
              onChange={() => dispatch(toggleToDoComplete(todo))}
            />
            {editId === todo.id ? (
              <>
                <TextField
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <IconButton aria-label="save">
                  <CheckIcon onClick={() => handleEditSave(todo.id, text)} />
                </IconButton>
              </>
            ) : (
              <>
                <ListItemText primary={renderColoredTags(todo.text, todo.completed)} />
                <div className='tagsSpan'>
                  {todo.tags && todo.tags.map((tag, index) => (
                    <span key={index}>#{tag} </span>
                  ))}
                </div>
                <IconButton aria-label="edit">
                  <EditIcon onClick={() => {
                    setEditId(todo.id);
                    setText(todo.text);
                  }} />
                </IconButton>
              </>
            )}
            <IconButton aria-label="delete">
              <DeleteIcon onClick={() => dispatch(removeTodo(todo.id))} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ToDoList;
