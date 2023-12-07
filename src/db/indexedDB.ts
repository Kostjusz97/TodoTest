interface Todo {
  id: string;
  text: string;
  completed: boolean;
  tags: string[];
}

export const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('notes_database', 1);
  
      request.onerror = (event: Event) => {
        reject('Error opening database');
      };
  
      request.onsuccess = (event: Event) => {
        const db = (event.target as IDBRequest<IDBDatabase>).result;
        resolve(db);
      };
  
      request.onupgradeneeded = (event: Event) => {
        const db = (event.target as IDBRequest<IDBDatabase>).result;
        const store = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
        store.createIndex('text', 'text', { unique: false });
        store.createIndex('completed', 'completed', { unique: false });
      };
    });
  };
  
  export const addToIndexedDB = (note: { id: string; text: string }): void => {
    openDB().then((db) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      store.add(note);
    });
  };
  
  export const deleteFromIndexedDB = (id: string): void => {
    openDB().then((db) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      store.delete(id);
    });
  };
  
  export const editInIndexedDB = (id: string, newText: string): void => {
    openDB().then((db) => {
      const transaction = db.transaction(['notes'], 'readwrite');
      const store = transaction.objectStore('notes');
      const request = store.get(id);
      request.onsuccess = () => {
        const note = request.result;
        note.text = newText;
        store.put(note);
      };
    });
  };
  
  export const getAllNotesFromDB = (): Promise<Todo[]> => {
    return new Promise((resolve, reject) => {
      openDB().then((db) => {
        const transaction = db.transaction(['notes'], 'readonly');
        const store = transaction.objectStore('notes');
        const request = store.getAll();
        request.onsuccess = () => {
          const notes = request.result;
          resolve(notes);
        };
        request.onerror = () => {
          reject('Error retrieving notes from IndexedDB');
        };
      });
    });
  };
  