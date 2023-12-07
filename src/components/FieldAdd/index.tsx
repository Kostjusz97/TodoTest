import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import './fieldAdd.css';
import { addTodo } from '../../store/todoSlice.ts';
import { useDispatch } from 'react-redux';
import { addToIndexedDB } from '../../db/indexedDB.ts'; 

const FieldAdd: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [tagsForNewTodo, setTagsForNewTodo] = useState<string[]>([]);
  const dispatch = useDispatch();

  const addText = () => {
    dispatch(addTodo({ text }));
    addToIndexedDB({ id: new Date().toISOString(), text }); 
    setText('');
    setTagsForNewTodo([]);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    const tagsInInput = e.target.value.match(/#\w+/g) || [];
    setTagsForNewTodo(tagsInInput.map(tag => tag.slice(1)));
  };

  return (
    <>
      <div className='inputGroup'>
        <TextField
          value={text}
          onChange={handleTextChange}
          id="outlined-basic"
          label="Outlined"
          variant="outlined"
        />
        <div className='addBtn'>
          <Button onClick={addText} variant="contained" color="primary">
            Добавить заметку
          </Button>
        </div>
      </div>

      {tagsForNewTodo.length > 0 && (
        <div className='tagsField'>
          <span>Tags: </span>
          {tagsForNewTodo.map((tag, index) => (
            <span key={index}>#{tag} </span>
          ))}
        </div>
      )}
    </>
  );
};

export default FieldAdd;
