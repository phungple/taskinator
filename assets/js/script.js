var pageContentEl = document.querySelector("#page-content");
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var taskIdCounter = 0;
// create an empty task array variable
var tasks =[];

var taskFormHandler = function(event){
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    
    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    };
    // reset form field for next task to be enter
    document.querySelector("input[name='task-name']").value = "";
    document.querySelector("select[name='task-type']").selectedIndex = 0;
    
    // hasAttribute() method: is a way of knowing if an element has a certain attribute or not
    var isEdit = formEl.hasAttribute("data-task-id");
    // the console log below will have value of false if a new task is created and true if "save task" is hitted after editting
    //console.log(isEdit); 
    
    // has data attribute, so get task id and call function to complete the edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // No data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            // because this task will be sent to createTaskEl, so we can safely assume that the status will always be "to do"
            status: "to do"
        };
        // this way createTaskEl() only get called if isEdit is false. If isEdit is true, completeEditTask() will be called.
        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    console.log(taskDataObj);
    console.log(taskDataObj.status);
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // create task actions (button and select) for task
    var taskActionEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionEl);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;

    // this push() method will add taskDataObj to the end of the tasks[] array
    tasks.push(taskDataObj);
    // save tasks to localStorage
    saveTasks();
    // increase task counter for next unique id
    taskIdCounter++;
};
var createTaskActions = function(taskId) {
    // the taskId parameter is used to pass a different id into the function each time to keep track of which element we're creating for which task.
   
    var actionContainerEl = document.createElement("div");
    // this div will act as a container for other element
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //  create drop down selection
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(statusSelectEl);

    // create status option
    var statusChoices = ["To Do", "In Progress", "Completed"];
    for(var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    
    return actionContainerEl;
};

// completeEditTask() function
var completeEditTask = function(taskName, taskType, taskId) {
    //console.log(taskName, taskType, taskId);
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set up new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for ( var i = 0; i < tasks.length; i++) {
        // because taskId is a string and tasks[i].id is a number, we use parseInt(taskId) to convert taskId to a number for comparison
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    alert("Task Updated!");
    // save task to localStorage
    saveTasks();
    // reset the form by removing task Id and changing the button back to normal
    formEl.removeAttribute("task-data-id");
    formEl.querySelector("#save-task").textContent = "Add Task";
};


var taskButtonHandler = function(event) {
    //console.log(event.target); reports the element on which the event occurs, in this case, the "click" event
    //console.log(event.target);
    //get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if(targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    // delete button was clicked
    if(targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

// add a delete task function
var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();
    
    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for ( var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the array
        if ( tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;
    // save to localStorage
    saveTasks();
};

// add a function for editing
var editTask = function(taskId) {
    console.log(taskId);
    //console.log("editing task #" + taskId);

    // get task list item element. document.querySelector(): search the entire page
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type. taskSelected.querySelector(): only search in the taskSelected element
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    // write values of task name and task type to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    // add taskId to a data-task-id attribute 
    formEl.setAttribute("data-task-id", taskId);
    // update form's button to reflect editting a task rather than creating a new one
    formEl.querySelector("#save-task").textContent = "Save Task";
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lower case
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based in the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task in tasks' array
    for ( var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }
    console.log(tasks);
    console.log(event.target);
    console.log(event.target.getAttribute("data-task-id"));

    // save to localStorage
    saveTasks();
};
// save task function: JavaScript Object Notation (JSON). JSON.stringify(): convert to tasks array into string to save in localStorage
var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};


var loadTasks = function() {
    
    // // get task items from localStorage
    // tasks = localStorage.getItem("tasks");
    // console.log(tasks);
    // // check the tasks if they are null tasks === null or !tasks
    // if (!tasks) {
    //     tasks =[];
    //     // we dont want this function to keep running with no tasks to load on the page
    //     return false;
    // }
    // // convert tasks from the string format to back into an array of objects
    // tasks = JSON.parse(tasks);
    
    // iterate through a task array and create task elements on the page from it
        // because each element in the array is a task's object, with those values we can create DOM elements and print them to the page
    // for ( var i = 0; i < tasks.length; i++) {
    //     console.log(tasks[i]);
    //     tasks[i].id = taskIdCounter;
    //     console.log(tasks[i]);

    //     var listItemEl = document.createElement("li");
    //     listItemEl.className = "task-item";
    //     listItemEl.setAttribute("data-task-id", taskIdCounter);

    //     var taskInfoEl = document.createElement("div");
    //     taskInfoEl.className = "task-info";
    //     taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";

    //     listItemEl.appendChild(taskInfoEl);

    //     var taskActionEl = createTaskActions(taskIdCounter);
    //     listItemEl.appendChild(taskActionEl);
    //     console.log(listItemEl);

    //     if (tasks[i].status === "to do") {
    //         listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
    //         tasksToDoEl.appendChild(listItemEl);
    //     }
    //     else if (tasks[i].status === "in-progress") {
    //         listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
    //         tasksInProgressEl.appendChild(listItemEl);
    //     }
    //     else if (tasks[i].status === "completed") {
    //         listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
    //         tasksCompletedEl.appendChild(listItemEl);
    //     } 
    //     taskIdCounter++;
    //     console.log(listItemEl);

    // we can refactor the code above as:
    var saveTasks = localStorage.getItem("tasks");
    // if there is no tasks, set tasks to an empty array and return out of the function
    if (!saveTasks) {
        return false;
    }
    console.log("Saved task found!");
    // else, load up saved tasks

    saveTasks = JSON.parse(saveTasks);

    // loop through saveTasks array
    for (var i = 0; i < saveTasks.length; i++) {
        //pass each task object into createTaskEl()
        createTaskEl(saveTasks[i]);
    }
};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();