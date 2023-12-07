import './App.css';
import ToDoList from './components/ToDoList/index.tsx';
import FieldAdd from './components/FieldAdd/index.tsx';
import { getAllNotesFromDB } from './db/indexedDB.ts';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import {loadTodosFromDB} from './store/todoSlice.ts';

function App() {
  const dispatch = useDispatch(); 
  
  useEffect(() => { 
    const fetchData = async () => {
      try {
        const notes = await getAllNotesFromDB(); 
        console.log(notes)
        dispatch(loadTodosFromDB(notes)); 
      } catch (error) {
        console.error('Error fetching notes:', error);
      }
    };
  
    fetchData();
  }, [dispatch]);
  return (
    <div className="App">
      <FieldAdd />
      <ToDoList />
    </div>
  );
}

export default App;
