const state = {
    tasks: [],
    lists: ['Pilne', 'Mało pilne', 'Na wczoraj'],
    collapsedLists: [],
    lastDeletedTask: null,
    taskToDeleteId: null
};

const dom = {
    searchInput: document.getElementById('searchInput'),
    caseInsensitive: document.getElementById('caseInsensitive'),
    newTaskText: document.getElementById('newTaskText'),
    listSelect: document.getElementById('listSelect'),
    addTaskBtn: document.getElementById('addTaskBtn'),
    newListText: document.getElementById('newListText'),
    addListBtn: document.getElementById('addListBtn'),
    listsContainer: document.getElementById('listsContainer'),
    undoBtn: document.getElementById('undoBtn'),
    deleteModal: document.getElementById('deleteModal'),
    modalText: document.getElementById('modalText'),
    confirmDeleteBtn: document.getElementById('confirmDeleteBtn'),
    cancelDeleteBtn: document.getElementById('cancelDeleteBtn')
};

const init = () => {
    updateListSelect();
    render();
    attachEventListeners();
};

const attachEventListeners = () => {
    dom.addTaskBtn.addEventListener('click', addTask);
    dom.addListBtn.addEventListener('click', addList);
    dom.searchInput.addEventListener('input', render);
    dom.caseInsensitive.addEventListener('change', render);
    dom.confirmDeleteBtn.addEventListener('click', confirmDelete);
    dom.cancelDeleteBtn.addEventListener('click', cancelDelete);
    dom.undoBtn.addEventListener('click', undoDelete);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'z') {
            undoDelete();
        }
    });
};

const updateListSelect = () => {
    dom.listSelect.innerHTML = '';
    state.lists.forEach(listName => {
        const option = document.createElement('option');
        option.value = listName;
        option.textContent = listName;
        dom.listSelect.appendChild(option);
    });
};

const addList = () => {
    const listName = dom.newListText.value.trim();
    if (listName !== '' && state.lists.includes(listName) === false) {
        state.lists.push(listName);
        dom.newListText.value = '';
        updateListSelect();
        render();
    }
};

const addTask = () => {
    const text = dom.newTaskText.value.trim();
    const listName = dom.listSelect.value;
    
    if (text !== '') {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            listName: listName,
            done: false,
            doneDate: null
        };
        state.tasks.push(newTask);
        dom.newTaskText.value = '';
        render();
    }
};

const toggleTask = (taskId) => {
    const taskIndex = state.tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        const task = state.tasks[taskIndex];
        task.done = task.done === false;
        
        if (task.done === true) {
            task.doneDate = new Date().toLocaleString();
        } else {
            task.doneDate = null;
        }
        render();
    }
};

const toggleListCollapse = (listName) => {
    const index = state.collapsedLists.indexOf(listName);
    if (index === -1) {
        state.collapsedLists.push(listName);
    } else {
        state.collapsedLists.splice(index, 1);
    }
    render();
};


const promptDelete = (taskId, e) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task !== undefined) {
        state.taskToDeleteId = taskId;
        dom.modalText.textContent = `Czy na pewno chcesz usunąć zadanie: ${task.text}`;
        dom.deleteModal.classList.remove('hidden');
    }
};

const confirmDelete = () => {
    if (state.taskToDeleteId !== null) {
        const taskIndex = state.tasks.findIndex(t => t.id === state.taskToDeleteId);
        if (taskIndex !== -1) {
            state.lastDeletedTask = state.tasks[taskIndex];
            state.tasks.splice(taskIndex, 1);
            dom.undoBtn.disabled = false;
        }
        state.taskToDeleteId = null;
        dom.deleteModal.classList.add('hidden');
        render();
    }
};

const cancelDelete = () => {
    state.taskToDeleteId = null;
    dom.deleteModal.classList.add('hidden');
};

const undoDelete = () => {
    if (state.lastDeletedTask !== null) {
        state.tasks.push(state.lastDeletedTask);
        state.lastDeletedTask = null;
        dom.undoBtn.disabled = true;
        render();
    }
};


const render = () => {
    dom.listsContainer.innerHTML = '';
    
    const searchText = dom.searchInput.value;
    const isInsensitive = dom.caseInsensitive.checked;
    
    const filteredTasks = state.tasks.filter(task => {
        if (searchText === '') {
            return true;
        }
        const textToSearch = isInsensitive === true ? task.text.toLowerCase() : task.text;
        const query = isInsensitive === true ? searchText.toLowerCase() : searchText;
        
        return textToSearch.includes(query);
    });

    state.lists.forEach(listName => {
        const tasksInList = filteredTasks.filter(t => t.listName === listName);
        
        const listWrapper = document.createElement('div');
        
        const header = document.createElement('div');
        header.className = 'list-header';
        
        const isCollapsed = state.collapsedLists.includes(listName);
        header.innerHTML = `<strong>${listName}</strong> <span>${isCollapsed ? '▼' : '▲'}</span>`;
        header.addEventListener('click', () => toggleListCollapse(listName));
        
        const ul = document.createElement('ul');
        ul.className = 'task-list';
        if (isCollapsed === true) {
            ul.classList.add('collapsed');
        }

        tasksInList.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item';
            if (task.done === true) {
                li.classList.add('done');
            }

            const contentDiv = document.createElement('div');
            contentDiv.className = 'task-content';
            
            const textSpan = document.createElement('span');
            textSpan.className = 'task-text';
            textSpan.textContent = task.text;
            contentDiv.appendChild(textSpan);

            if (task.done === true && task.doneDate !== null) {
                const dateSpan = document.createElement('span');
                dateSpan.className = 'task-date';
                dateSpan.textContent = `Wykonano: ${task.doneDate}`;
                contentDiv.appendChild(dateSpan);
            }

            contentDiv.addEventListener('click', () => toggleTask(task.id));

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', (e) => promptDelete(task.id, e));

            li.appendChild(contentDiv);
            li.appendChild(deleteBtn);
            ul.appendChild(li);
        });

        listWrapper.appendChild(header);
        listWrapper.appendChild(ul);
        dom.listsContainer.appendChild(listWrapper);
    });
};

init();
