const faker = require('faker');
const fs = require('fs');

// Set locale to use Vietnamese
faker.locale = 'vi';



const randomTodoList = (numberOfTodos) => {
  if (numberOfTodos <= 0) return [];

  const todoList = [];

  Array.from(new Array(numberOfTodos)).forEach(() => {
    const todo = {
      id: faker.random.uuid(),
      "title": `title ${numberOfTodos}`,
      "completed": false,
      "starred": false
    };

    todoList.push(todo);
  });

  return todoList;
};

// IFFE
(() => {
  // random data
  const todoList = randomTodoList(5);

  // prepare db object
  const db = {
    todo: todoList,
  
  };

  // write db object to db.json
  fs.writeFile('todo.json', JSON.stringify(db), () => {
    console.log('Generate data successfully =))');
  });
})();
