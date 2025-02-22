import { AbstractView } from "./AbstractView.js";
import { currentUser } from "../controller/firebase_auth.js";
import { getMessageList } from "../controller/firestore_controller.js";
import { startSpinner, stopSpinner } from "./util.js";

export class HomeView extends AbstractView {
    // instance variables 
    controller = "null";
    constructor(controller) {
        super();
        this.controller = controller;
    }

    async onMount() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access Denied</h1>';
            return;
        }
        console.log('HomeView.onMount() called');

        startSpinner();
        try {
            this.controller.model.messageList = await getMessageList();
            stopSpinner();
        } catch (error) {
            stopSpinner();
            this.controller.model.messageList = null;
            console.error('Error getting message list:', error);
            alert('Error getting message list:', + error)
        }
        console.log('message list', this.controller.model.messageList);
    }

    async updateView() {
        console.log('HomeView.updateView() called');
        const viewWrapper = document.createElement('div');
        try {
            const response = await fetch('/view/templates/home.html', { cache: 'no-store' });
            viewWrapper.innerHTML = await response.text();

            const tbody = viewWrapper.querySelector('tbody');
            const messageList = this.controller.model.messageList;

            if (messageList === null) {
                const div = document.createElement('div');
                div.innerHTML = '<h1>Error loading message list from Firestore</h1>';
                tbody.appendChild(div);
            } else if (messageList.length === 0) {
                const div = document.createElement('div');
                div.innerHTML = '<h1>No messages posted</h1>';
                tbody.appendChild(div);
            } else {
                messageList.forEach(message => {
                    const tr = this.#buildMessageRow(message);
                    tbody.appendChild(tr);
                });
            }
        } catch (error) {
            console.error('Error loading home.html: ', error);
            alert('Error loading home.html: ' + error);
            viewWrapper.innerHTML = '<h1>Error loading/fetching home.html</h1>';
        }

        return viewWrapper;
    }

    #buildMessageRow(message) {
        const tr = document.createElement('tr');
        tr.id = message.docId;
        const tdMessage = document.createElement('td');
        tdMessage.innerHTML = `
                    <div class="text-white bg-primary">${message.title}</div>
                    ${message.contents}
                    `
        tr.appendChild(tdMessage);
        const tdPost = document.createElement('td');
        tdPost.innerHTML = message.email + '<br>' + new Date(message.timestamp).toLocaleString();
        tr.appendChild(tdPost);

        const tdAction = document.createElement('td');
        if (message.email === currentUser.email) {
            tdAction.innerHTML = `
                <button class="btn btn-outline-primary edit-button"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger delete-button"><i class="bi bi-trash"></i></button>
            `;
        } else {
            tdAction.innerHTML = '<i class="bi bi-x-octagon btn btn-secondary"></i>';
        }
        tr.appendChild(tdAction);

        return tr;
    }


    attachEvents() {
        // console.log('HomeView.attacheEvents() called');
        const formCreateMessage = document.forms.formCreateMessage;
        formCreateMessage.onsubmit = this.controller.onSubmitCreateMessage;

        const editButtons = document.querySelectorAll('.edit-button');
        for (const button of editButtons) {
            button.onclick = this.controller.onClickEditButton;
        }
        const deleteButtons = document.querySelectorAll('.delete-button');
        for (const button of deleteButtons) {
            button.onclick = this.controller.onClickDeleteButton;
        }

        const formEdit = document.forms.formEditMessage;
        formEdit.onsubmit = this.controller.onSubmitEditMessage;
    }

    async onLeave() {
            if (!currentUser) {
                this.parentElement.innerHTML = '<h1>Access Denied</h1>';
                return;
            }
            console.log('HomeView.onLeave() called');
        }
    }