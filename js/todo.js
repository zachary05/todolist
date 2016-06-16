"use strict";

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            oldonload();
            func();
        };
    }
}


function localStorage_check() {

    if (!window.localStorage) {

        alert("Sorry, your browser doesn't support this page. Please try another one.");

    }

}
addLoadEvent(localStorage_check);


if (localStorage.getItem('allTasks')) {
    // 读取数据
    var allTasks = JSON.parse(localStorage.getItem('allTasks'));
    // 排序
    allTasks.sort(
        function(task1, task2) {
            if (Date.parse(task1.deadline) > Date.parse(task2.deadline)) {
                return true;
            } else {
                return false;
            }
        }
    );
    // 创建任务
    var finished_taskList = document.getElementsByClassName('finished_taskList')[0];
    for (var i = 0; i < allTasks.length; i++) {
        var task = allTasks[i];
        var seperatetask = View_newTask(task.title, task.deadline, task.description, task.UUID);
        if (task.finished) {
            finished_taskList.appendChild(seperatetask);
            var showcheckbox = seperatetask.getElementsByTagName('input')[0];
            showcheckbox.checked = true;
        }
    }
} else {
    var allTasks = [];
    View_newTask('Try it!', '', 'Create you first Task!', '123');
}


// deadline日期预设
function set_today_date() {
    var today = new Date;
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDay() + 1;

    if (month < 10) {
        month = '0' + month;
    }
    if (day < 10)(
        day = '0' + day);

    var calendar = document.getElementById('deadLine');


    var today_date = year + '-' + month + '-' + day;

    calendar.setAttribute('value', today_date);

}
addLoadEvent(set_today_date);




function View_newTask(taskTitle, deadLine, descriptionText, UUID) {
    var taskList = document.getElementsByClassName('taskList')[0];
    var finished_taskList = document.getElementsByClassName('finished_taskList')[0];

    var task = document.createElement('li');
    task.className = 'list-group-item';
    task.setAttribute('UUID', UUID);
    // 基础信息

    finish_button(task, UUID, taskList);
    var container = document.createElement('div');
    container.className = 'container mine';
    task.appendChild(container);


    var title = document.createElement('p');
    var title_text = document.createTextNode(taskTitle);
    title.appendChild(title_text);
    title.setAttribute('name', 'title');
    var deadline = document.createElement('p');
    var deadline_date = document.createTextNode(deadLine);
    deadline.setAttribute('name', 'deadline');
    deadline.appendChild(deadline_date);
    var description = document.createElement('p');
    var description_text = document.createTextNode(descriptionText);
    description.appendChild(description_text);

    container.appendChild(title);
    container.appendChild(deadline);
    container.appendChild(description);

    taskList.appendChild(task);

    delete_button(container, UUID, allTasks, task);
    return task;
}


function delete_button(container, UUID, allTasks, task) {
    // delete task
    var deleteTask = document.createElement('button');
    deleteTask.className = 'btn btn-default';
    container.appendChild(deleteTask);
    deleteTask.addEventListener('click', function() {
        var pare = task.parentNode;
        pare.removeChild(task);
        for (var i = 0; i < allTasks.length; i++) {
            if (allTasks[i].UUID == UUID) {
                allTasks.splice(i, 1);
            }
        }
    });
    deleteTask.innerHTML = 'delete';
}

function finish_button(task, UUID, taskList) {
    var finishedstate = document.createElement('input');
    task.appendChild(finishedstate);
    finishedstate.type = 'checkbox';
    finishedstate.checked = false;
    finishedstate.className = 'checkbox';
    finishedstate.addEventListener('change', function() {
        var finished;
        if (finishedstate.checked) {
            task.setAttribute('name', 'finished');
            finished_taskList.appendChild(task);
            finished = true;
            update_model(task, UUID);
        } else {
            task.setAttribute('name', 'unfinished');
            taskList.appendChild(task);
            finished = false;
            update_model(task, UUID);
        }

    });
}



// 获取view的子元素
function getchildnode(parent) {
    var childlist = parent.children;
    var childlistarr = [];
    var i = 0;
    while (i < childlist.length) {
        if (childlist[i].nodeType == 1) {
            childlistarr.push(childlist[i]);
            i += 1;
        } else {
            i += 1;
        }

    }
    return childlistarr;
}


// 从界面获取数据并显示
function get_viewData() {
    var taskTitle = document.getElementById('taskTitle').value;
    var deadLine = document.getElementById('deadLine').value;
    var descriptionText = document.getElementById('descriptionText').value;
    var UUID = generateUUID();
    var createdTime = new Date();
    var finished = false;
    var task = model_newTask(taskTitle, deadLine, descriptionText, UUID, createdTime, finished);
    // 插入
    if (allTasks.length === 0) {
        allTasks.push(task);
    } else {
        var i = 0;
        var indexTask = allTasks[i];
        while (i < allTasks.length) {
            if (Date.parse(task.deadline) <= Date.parse(indexTask.deadline)) {
                allTasks.splice(i - 1, 0, task);
                break;
            } else {
                if (allTasks.length == i + 1) {
                    allTasks.splice(i, 0, task);
                    break;
                } else {
                    i += 1;
                }
            }
        }
    }
    View_newTask(task.title, task.deadline, task.description, task.UUID);
    document.location.reload(true);

}


// 将数据加入到allTask
function model_newTask(taskTitle, deadLine, descriptionText, UUID, createdTime, finished) {
    var task = {
        'title': taskTitle,
        'deadline': deadLine,
        'description': descriptionText,
        'UUID': UUID,
        'createdTime': createdTime,
        'finished': finished
    };

    return task;
}


// 更新model数据
function update_model(targettask, UUID) {
    //get model task and update:
    for (var i = 0; i < allTasks.length; ++i) {
        if (allTasks[i].UUID == UUID) {
            allTasks[i].finished = !allTasks[i].finished;
            break;
        }
    }
}



// create UUID
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
    });
    return uuid;
}



// 检查数据存储
window.onunload = function() {
    if (allTasks.length === 0) {
        localStorage.removeItem('allTasks');
    } else {
        localStorage.setItem('allTasks', JSON.stringify(allTasks));

    }
};
