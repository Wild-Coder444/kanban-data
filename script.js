const todo = document.querySelector(".sec1");
const process = document.querySelector(".sec2");
const done = document.querySelector(".sec3");

const task = document.querySelectorAll(".task");

const rightbtn = document.querySelector("#right");
const newtask = document.querySelector(".newtask");
const add = document.querySelector(".add");

const input = document.querySelector("#text");
const feedback = document.querySelector("#textarea");

let dragelement = null;

function saveTasks() {
    const tasks = document.querySelectorAll(".task");
    const data = [];

    tasks.forEach((task) => {
        let section = "";

        if (task.parentElement === todo) {
            section = "todo";
        } else if (task.parentElement === process) {
            section = "process";
        } else if (task.parentElement === done) {
            section = "done";
        }

        data.push({
            title: task.querySelector("h2").innerText,
            desc: task.querySelector("p").innerText,
            section: section
        });
    });

    localStorage.setItem("kanbanTasks", JSON.stringify(data));
}

function deleteTask(task) {
    const deleteBtn = task.querySelector("#btn1");

    deleteBtn.addEventListener("click", () => {
        task.remove();
        saveTasks();
    });
}

function dragTask(task) {
    task.addEventListener("dragstart", () => {
        console.log("Dragging started");
        dragelement = task;
    });
}

task.forEach((task) => {
    dragTask(task);
    deleteTask(task);
});

function addEvent(col) {
    col.addEventListener("dragenter", (e) => {
        e.preventDefault();
        col.classList.add("over");
    });

    col.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    col.addEventListener("dragleave", () => {
        col.classList.remove("over");
    });

    col.addEventListener("drop", (e) => {
        e.preventDefault();

        if (dragelement) {
            col.appendChild(dragelement);
            saveTasks();
        }

        col.classList.remove("over");
    });
}

addEvent(todo);
addEvent(process);
addEvent(done);

rightbtn.addEventListener("click", (e) => {
    e.stopPropagation();
    newtask.style.visibility = "visible";
});

newtask.addEventListener("click", () => {
    newtask.style.visibility = "hidden";
});

const box = document.querySelector(".boxi");

box.addEventListener("click", (e) => {
    e.stopPropagation();
});

add.addEventListener("click", () => {
    const newDiv = document.createElement("div");

    newDiv.classList.add("task");

    newDiv.setAttribute("draggable", "true");

    newDiv.innerHTML = `
        <h2>${input.value}</h2>
        <p>${feedback.value}</p>
        <button id="btn1">delete</button>
    `;

    dragTask(newDiv);
    deleteTask(newDiv);

    todo.appendChild(newDiv);

    input.value = "";
    feedback.value = "";

    newtask.style.visibility = "hidden";

    saveTasks();
});

window.addEventListener("load", () => {
    const savedTasks =
        JSON.parse(localStorage.getItem("kanbanTasks")) || [];

    savedTasks.forEach((item) => {
        const newDiv = document.createElement("div");

        newDiv.classList.add("task");

        newDiv.setAttribute("draggable", "true");

        newDiv.innerHTML = `
            <h2>${item.title}</h2>
            <p>${item.desc}</p>
            <button id="btn1">delete</button>
        `;

        dragTask(newDiv);
        deleteTask(newDiv);

        if (item.section === "todo") {
            todo.appendChild(newDiv);
        } else if (item.section === "process") {
            process.appendChild(newDiv);
        } else if (item.section === "done") {
            done.appendChild(newDiv);
        }
    });
});
