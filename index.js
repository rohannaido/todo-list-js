let allTasks = [];
let taskKey = -1;
let editFlag = false;
let inputToggleFlag = false;
const newTaskInputDiv = document.querySelector(".new-task-input-div");
const newTaskInput = document.querySelector(".new-task-input");
const taskList = document.querySelector(".task-list");
const addNewTaskButton = document.querySelector(".add-task-button");

addNewTaskButton.addEventListener('click', () => {
    toggleInput();
});

const toggleInput = () => {
    if(!inputToggleFlag) {
        // newTaskInputDiv.style.visibility = 'visible';
        // newTaskInputDiv.style.height = 'auto';
        // newTaskInput.style.padding = '1rem';
        newTaskInputDiv.style.cssText = `
            visibility: visible;
            height: 5.2rem;
            opacity: 1;
            `;
    }
    else { 
        // newTaskInputDiv.style.visibility = 'hidden';
        // newTaskInputDiv.style.height = '0px';
        newTaskInputDiv.style.cssText = `
            visibility: hidden;
            height: 0px;
            opacity: 0;
            `;
        // newTaskInput.style.padding = '0rem';
    }
    inputToggleFlag = !inputToggleFlag;
}
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
            <div>
                <h4>${task.item}</h4>
                <p>${task.detail}</p>
            </div>
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
        toggleInput();
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
    toggleInput();
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