let allTasks = [];
let taskKey = -1;
let inputToggleFlag = false;
let taskItems = "";
let taskDetails = "";
const newTaskInputDiv = document.querySelector(".new-task-input-div");
const newTaskInput = document.querySelector(".title-input");
const newTaskInputDetail = document.querySelector(".detail-input");

const taskList = document.querySelector(".task-list");
const addNewTaskButton = document.querySelector(".add-task-button");

addNewTaskButton.addEventListener('click', () => {
    toggleInput();
});

newTaskInput.addEventListener('keydown', () => {inputKeyHandler()});
newTaskInputDetail.addEventListener('keydown', () => {inputKeyHandler()});


const toggleInput = () => {
    if(!inputToggleFlag) {
        newTaskInputDiv.style.cssText = `
            visibility: visible;
            height: 5.2rem;
            opacity: 1;
            `;
    }
    else { 
        newTaskInputDiv.style.cssText = `
            visibility: hidden;
            height: 0px;
            opacity: 0;
            `;
    }
    inputToggleFlag = !inputToggleFlag;
}

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
            newLi.setAttribute('key',task.id);

            newLi.innerHTML = `
            <div class="task-item-div">
                <input class="task-item-item" value="${task.item}">
                <input class="task-detail-item" value="${task.detail}">
            </div>
            <div>
            
            </div>
            <div class="task-buttons">
                <i key="${task.id}" class="bi bi-trash-fill delete-task" onclick=deleteTask()></i>
            </div>`;
                // <h4>${task.item}</h4>
                // <p>${task.detail}</p>
                // <i key="${task.id}" class="bi bi-pencil-fill delete-task" onclick=editTask()></i>
            taskList.appendChild(newLi);
            taskItems = document.querySelectorAll('.task-item-item');
            taskDetails = document.querySelectorAll('.task-detail-item');
            for (var i = 0; i < taskItems.length; i++) {
                taskItems[i].addEventListener('keydown', () => {updateTask()});
                taskDetails[i].addEventListener('keydown', () => {updateTask()});
            }
        })
    });
}

displayTasks();


const updateTask = () => {
    if (event.keyCode === 13){
        taskKey = event.path[2].getAttribute('key');
        editTaskHandler(event.path[1].querySelector('.task-item-item').value, event.path[1].querySelector('.task-detail-item').value);
    }
}

const inputKeyHandler = () => {
    if (event.keyCode === 13){
        addNewTask(newTaskInput.value, newTaskInputDetail.value);
        newTaskInput.value = "";
        newTaskInputDetail.value = "";
        toggleInput();
    }
}

const addNewTask = (newTask, newTaskDetail) => {
    fetch("http://localhost:3000/allTasks", {
    method: "POST",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ item: newTask, detail: newTaskDetail})
    }).then(res => {
        console.log("Request complete!");
        displayTasks();
    });

}

const deleteTask = () =>{
    event.stopPropagation();
    taskKey = event.target.getAttribute("key");

    fetch(`http://localhost:3000/allTasks/${taskKey}`, {
    method: "DELETE"
    }).then(res => {
        console.log("Request complete!");
        displayTasks();
    });
}

const editTaskHandler = (newTask, newTaskDetail) => {

    fetch(`http://localhost:3000/allTasks/${taskKey}`, {
    method: "PUT",
    headers: {'Content-Type': 'application/json'}, 
    body: JSON.stringify({ item: newTask, detail: newTaskDetail })
    }).then(res => {
        console.log("Request complete!");
        displayTasks();
    });
}