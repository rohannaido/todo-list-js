let allTasks = [];
let taskKey = -1;
let editFlag = false;
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
            newLi.setAttribute('key',task.id);
            newLi.innerHTML = `
            ${task.item}
            <div class="task-buttons">
                <i key="${task.id}" class="bi bi-pencil-fill delete-task" onclick=editTask()></i>
                <i key="${task.id}" class="bi bi-trash-fill delete-task" onclick=deleteTask()></i>
            </div>`;
            taskList.appendChild(newLi);
        })
    });
}

displayTasks();

const inputKeyHandler = () => {
    if (event.keyCode === 13){
        if (!editFlag) {
            addNewTask(newTaskInput.value);
            newTaskInput.value = "";
        }
        else {
            editTaskHandler(newTaskInput.value);
            newTaskInput.value = "";
        }
    }
}

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

const deleteTask = () =>{
    taskKey = event.target.getAttribute("key");

    fetch(`http://localhost:3000/allTasks/${taskKey}`, {
    method: "DELETE"
    }).then(res => {
        console.log("Request complete!");
        displayTasks();
    });
}

const editTask = () => {
    editFlag = true;
    newTaskInput.value = event.path[2].innerText;
    taskKey = event.path[2].getAttribute('key');
    newTaskInput.focus();
    // editFlag = false;
}

const editTaskHandler = (newTask) => {

    fetch(`http://localhost:3000/allTasks/${taskKey}`, {
    method: "PUT",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ item: newTask })
    }).then(res => {
        console.log("Request complete!");

        editFlag = false;
        displayTasks();
    });
}