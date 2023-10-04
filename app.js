//localStorage.clear();

document.addEventListener('DOMContentLoaded', function () {
  const listsContainer = document.getElementById('lists'); // Define the listsContainer
  const currentListTodos = document.getElementById('current-list-todos'); // Define the currentListTodos

    // Initialize an empty array to store the lists
    let lists = [];
    let currentList = null; // Track the current list

    load();
  
    // Function to add a new list to the array
    function addList() {
      const listNameInput = document.getElementById('listName');
      const listName = listNameInput.value.trim();
  
      if (listName === '') {
        alert('Please enter a name for the list.');
        return;
      }
  
      // Generate a unique ID for the list
      const listId = Date.now().toString();
      const newList = {
        id: listId,
        name: listName,
        todos: [] // Initialize the todos property as an empty array
      };
  
      lists.push(newList);
  
      // Clear the input field
      listNameInput.value = '';
      save();
      render();
    }
  
    // Function to remove a list item
    function removeList(listId) {
      lists.splice(lists.findIndex(list => list.id === listId), 1);
      save();
      render();
    }
  
    // Function to add a new todo item
    function addTodo() {
      const todoTextInput = document.getElementById('todoText');
      const todoText = todoTextInput.value.trim();
  
      if (todoText === '') {
        alert('Please enter a todo item.');
        return;
      }
  
      if (currentList === null) {
        alert('Please select a list first.');
        return;
      }
  
      // Create a new todo object for the current list
      const todoId = Date.now().toString();
      const todo = {
        id: todoId,
        text: todoText,
        completed: false,
      };
  
      // Add the todo to the current list's todos array
      currentList.todos.push(todo);
  
      save();

      // Render the current list to update the todos
      render();
  
      // Clear the input field
      todoTextInput.value = '';
    }

    // Function to remove a todo item by its unique ID
    function removeTodo(todoId) {
        if (currentList === null) {
            return; // No list selected, do nothing
        }

        // Find the index of the todo item to remove
        const todoIndex = currentList.todos.findIndex((todo) => todo.id === todoId);

        if (todoIndex !== -1) {
            // Remove the todo item from the current list's todos array
            currentList.todos.splice(todoIndex, 1);

            save();

            render(); // Re-render to update the display

            // Remove the corresponding <li> element from the DOM
            const todoElement = document.getElementById(`todo-${todoId}`);
            if (todoElement) {
                todoElement.remove();
            }
        }
    }

    // Function to mark a todo item as completed or incomplete
    function markCompletedTodo(todoId) {
      if (currentList === null) {
        return; // No list selected, do nothing
      }

      // Find the todo item by its unique ID
      const todo = currentList.todos.find((todo) => todo.id === todoId);

      if (todo) {
        // Toggle the completed status
        todo.completed = !todo.completed;

        save();

        // Re-render the current list to update the display
        render();
      }
    }

    // Add an event listener to handle removing completed todos when the button is clicked
    const removeCompletedButton = document.getElementById('removeCompletedButton');
    removeCompletedButton.addEventListener('click', function() {
        removeCompletedTodos();
    });

    // Function to remove completed todos in the current list
    function removeCompletedTodos() {
      if (currentList === null) {
        return; // No list selected, do nothing
      }
    
      // Filter out completed todos and keep only the uncompleted ones
      const uncompletedTodos = currentList.todos.filter((todo) => !todo.completed);
    
      // Remove the corresponding <li> elements from the DOM for completed todos
      currentList.todos.forEach((todo) => {
        if (todo.completed) {
          const todoElement = document.getElementById(`todo-${todo.id}`);
          if (todoElement) {
            todoElement.remove();
          }
        }
      });

      // Set the current list's todos to only the uncompleted ones
      currentList.todos = uncompletedTodos;

      save();

      render(); // Re-render to update the display
    }

  
    // Render function to display the current list and its todos
    function render() {
      let listsHtml = '<ul class="list-group">';
      lists.forEach((list) => {
        listsHtml += `<li class="list-group-item bg-secondary text-white" data-list-id="${list.id}">
          <span class="fas fa fa-trash text-danger" data-list-id="${list.id}"></span>
          ${list.name}
        </li>`;
      });
      listsHtml += '</ul>';
      listsContainer.innerHTML = listsHtml;
    
      // Iterate over the list items and add a click event listener to each one
      const listItems = listsContainer.querySelectorAll('.list-group-item');
      listItems.forEach((listItem) => {
        listItem.addEventListener('click', function(event) {
          const listId = listItem.getAttribute('data-list-id');
          const clickedList = lists.find((list) => list.id === listId);
          if (clickedList) {
            document.getElementById('current-list-name').innerText = clickedList.name;
          }
        });
      });
  
      // Inside your event listener for handling clicks on list items
      listsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('list-group-item')) {
          const listId = event.target.getAttribute('data-list-id');
          currentList = lists.find((list) => list.id === listId);
          if (currentList) {
            document.getElementById('current-list-name').innerText = currentList.name;
          }
        }
      });
  
      if(currentList){
        // Iterate over the todos in the current list
        let todosHtml = '<ul class="list-group-flush">';
        if (currentList) {
          currentList.todos.forEach((todo) => {
              const todoId = `todo-${todo.id}`; // Unique ID for each todo item
            todosHtml += `<li class="list-group-item border p-3" id="${todoId}">
            <input type="checkbox" id="${'todo-' + todo.id}" ${todo.completed ? 'checked' : ''}>
            ${todo.text}
            <span class="fas fa fa-trash text-danger" data-todo-id="${todo.id}"></span>
            </li>`;
          });
        }

        // print out the todos
        document.getElementById('current-list-todos').innerHTML = todosHtml;

            // Add an event listener to the parent container for handling clicks on checkboxes in currentListTodos
        currentListTodos.addEventListener('change', function (event) {
          if (event.target.type === 'checkbox') {
            /*const todoId = event.target.getAttribute('data-todo-id');
            markCompletedTodo(todoId);*/
          }
        });

        // Inside your render function, add event listeners to the checkboxes
        currentList.todos.forEach((todo) => {
          const checkbox = document.getElementById(`todo-${todo.id}`);
          if (checkbox) {
            checkbox.checked = todo.completed; // Set the checkbox state
            checkbox.addEventListener('change', function () {
              markCompletedTodo(todo.id);
            });
          }
        });
      }

      save();
    }

    document.getElementById("todoText").addEventListener("keydown", addingtodo);
    function addingtodo(event) {
        if (event.keyCode === 13) {
          addTodo();
        }
        render();
    }

    // Add an event listener to the parent container for handling clicks on trash icons in the currentListTodos
    //const currentListTodos = document.getElementById('current-list-todos');
    currentListTodos.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-trash')) {
            const todoId = event.target.getAttribute('data-todo-id');
            removeTodo(todoId); // Call the removeTodo function
        }
    });
  
    // Rest of your code...
    document.getElementById("listName").addEventListener("keydown", handleKeyPress);
  
    function handleKeyPress(event) {
      if (event.keyCode === 13) {
        addList();
      }
      render();
    }
  
    // Add an event listener to the parent <ul> element for handling clicks on trash icons
    //const listsContainer = document.getElementById('lists');
    listsContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('fa-trash')) {
        const listId = event.target.getAttribute('data-list-id');
        removeList(listId);
      }
    });
  
    // Add an event listener to set the current list when a list item is clicked
    listsContainer.addEventListener('click', function(event) {
      if (event.target.classList.contains('list-group-item')) {
        const listId = event.target.getAttribute('data-list-id');
        currentList = lists.find((list) => list.id === listId);
        render();
      }
    });
  
  // Save data to local storage
  function save() {
    localStorage.setItem('lists', JSON.stringify(lists));
    localStorage.setItem('currentList', JSON.stringify(currentList));
  }

  // Load data from local storage
  function load() {
    const savedLists = localStorage.getItem('lists');
    const savedCurrentList = localStorage.getItem('currentList');

    if (savedLists) {
      lists = JSON.parse(savedLists);
    }

    if (savedCurrentList) {
      currentList = JSON.parse(savedCurrentList);
    }

    render();
  }

  // After the load function is called, you can now set the currentList name
  if (currentList) {
    document.getElementById('current-list-name').innerText = currentList.name;
  }

  });