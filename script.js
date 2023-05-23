document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('todoForm');
    const input = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');
  
    // Function to add a new TODO
    function addTodo() {
      const text = input.value.trim();
      if (text !== '') {
        fetch('/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
          .then(response => response.json())
          .then(todo => {
            input.value = '';
            displayTodoItem(todo);
          })
          .catch(error => console.error('Error adding todo:', error));
      }
    }
  
    // Function to display a TODO item
    function displayTodoItem(todo) {
      const li = document.createElement('li');
      li.setAttribute('data-id', todo._id);
  
      const todoText = document.createElement('span');
      todoText.textContent = todo.text;
      todoText.className = 'todo-text';
      li.appendChild(todoText);
  
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-btn';
      li.appendChild(deleteButton);
  
      deleteButton.addEventListener('click', function() {
        const todoId = li.getAttribute('data-id');
        deleteTodoItem(todoId);
      });
  
      todoList.appendChild(li);
    }
  
    // Function to delete a TODO item
    function deleteTodoItem(todoId) {
      fetch(`/todos/${todoId}`, {
        method: 'DELETE'
      })
        .then(response => {
          if (response.ok) {
            const todoItem = document.querySelector(`li[data-id="${todoId}"]`);
            todoItem.remove();
          } else {
            console.error('Error deleting todo:', response.statusText);
          }
        })
        .catch(error => console.error('Error deleting todo:', error));
    }
  
    // Function to load existing TODOs
    function loadTodos() {
      fetch('/todos')
        .then(response => response.json())
        .then(todos => {
          todoList.innerHTML = '';
          todos.forEach(displayTodoItem);
        })
        .catch(error => console.error('Error loading todos:', error));
    }
  
    // Event listener for the form submission
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      addTodo();
    });
  
    // Load existing todos on page load
    loadTodos();
  });
  