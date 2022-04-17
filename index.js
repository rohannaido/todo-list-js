let allTasks = [];

const newTaskInput = document.querySelector(".new-task-input");
const taskList = document.querySelector(".task-list");

newTaskInput.addEventListener('keydown', () => {inputKeyHandler()});

const displayTasks = () => {
    fetch("http://localhost:3000/allTasks")
    .then(response => response.json())
    .then(json => {
        allTasks = json;

        const taskListItems = document.querySelectorAll(".task-list li");
        if (taskListItems.length > 0) {
            taskListItems.forEach((taskListItem) => { taskListItem.remove()});
        }
    
        allTasks.map((task) => {
            const newLi = document.createElement('li');
            newLi.appendChild(document.createTextNode(task.item));
        
            const newDeleteButton = document.createElement('i');
            newDeleteButton.setAttribute('key',task.id);
            newDeleteButton.addEventListener('click', () => deleteTask());
            newDeleteButton.classList.add('delete-task');
            newDeleteButton.classList.add('bi');
            newDeleteButton.classList.add('bi-trash-fill');

            // UPDATE

            // const editButton = document.createElement('i');
            // editButton.setAttribute('key',task.id);
            // editButton.addEventListener('click', () => editTask());
            // editButton.classList.add('delete-task');
            // editButton.classList.add('bi');
            // editButton.classList.add('bi-pencil-fill');
        
            newLi.appendChild(newDeleteButton);
            taskList.appendChild(newLi);
        })
    });
}

displayTasks();

const inputKeyHandler = () => {
    if (event.keyCode === 13){
        addNewTask(newTaskInput.value);
        newTaskInput.value = "";
    }
}

// Adding new tasks
const addNewTask = (newTask) => {
    fetch("http://localhost:3000/allTasks", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ item: newTask })
    }).then(res => {
        console.log("Request complete!");
        displayTasks();
    });

}

// Deleting tasks
const deleteTask = () =>{
    let taskKey = event.target.getAttribute("key");

    fetch(`http://localhost:3000/allTasks/${taskKey}`, {
    method: "DELETE"
    // headers: {'Content-Type': 'application/json'} 
    // body: JSON.stringify({ item: newTask })
    }).then(res => {
        console.log("Request complete!");
        displayTasks();
    });

}