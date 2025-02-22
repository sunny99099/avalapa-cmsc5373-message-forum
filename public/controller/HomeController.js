import { HomeModel } from "../model/HomeModel.js";
import { Message } from "../model/Message.js";
import { startSpinner, stopSpinner } from "../view/util.js";
import { currentUser } from "./firebase_auth.js";
import { addMessage, deleteMessageById, updateMessageById } from "./firestore_controller.js";


export class HomeController {
    // instance members 
    model = null;
    view = null;

    constructor() {
        this.model = new HomeModel();
        this.onSubmitCreateMessage = this.onSubmitCreateMessage.bind(this);
        this.onClickEditButton = this.onClickEditButton.bind(this);
        this.onClickDeleteButton = this.onClickDeleteButton.bind(this);
        this.onSubmitEditMessage = this.onSubmitEditMessage.bind(this);
    }

    setView(view) {
        this.view = view;
    }

    async onSubmitCreateMessage(e) {
        e.preventDefault(); //prevent from page reload
        const title = e.target.title.value;
        const contents = e.target.contents.value;
        const uid = currentUser.uid;
        const email = currentUser.email;
        const timestamp = Date.now(); //# of ms since 1970, Jan 1
        const m = {
            uid,
            email,
            title,
            contents,
            timestamp,
        };
        const message = new Message(m);

        startSpinner();
        try {
            const docId = await addMessage(message.toFirestore());
            stopSpinner();
            message.setDocId(docId); ////////////////////////////////////////////////////////////
            //dismiss modal by clicking close button
            document.querySelector('button.btn-close').click();
            this.model.addNewMessage(message);         //bind in constructor for "this"
            this.view.render();
        } catch (error) {
            stopSpinner();
            console.error('Error adding message', error);
            alert('Error adding message' + error);
        }
    }

    onClickEditButton(e) {
        const tr = e.target.closest('tr');
        const docId = tr.id;
        const message = this.model.getMessageById(docId);
        const form = document.forms.formEditMessage;
        form.id = docId;
        form.title.value = message.title;
        form.contents.value = message.contents;
        form.postedBy.value = message.email + '(' + new Date(message.timestamp).toLocaleString() + ')';
        const modal = bootstrap.Modal.getOrCreateInstance('#modalEditMessage');
        modal.show();
    }

    async onClickDeleteButton(e) {
        if (!confirm('Are you sure you want to delete this message?')) {
            return;
        }

        const tr = e.target.closest('tr');
        const docId = tr.id;
        startSpinner();
        try {
            await deleteMessageById(docId);
            stopSpinner();
            this.model.deleteMessageById(docId);
            this.view.render();
        } catch (error) {
            stopSpinner
            console.error('Error deleting message: ', error);
            alert('Error deleting message: ' + error);
        }
    }
    async onSubmitEditMessage(e) {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value.trim();
        const contents = form.contents.value.trim();
        const message = this.model.getMessageById(form.id);
        if (title === message.title && contents === message.contents) {
            // no change
            bootstrap.Modal.getInstance('#modalEditMessage').hide();
            return;
        }

        startSpinner();
        const update = {
            title,
            contents,
            timestamp: Date.now(),
        }; try {
            await updateMessageById(form.id, update);
            stopSpinner();
            this.model.updateMessage(message, update);
            bootstrap.Modal.getInstance('#modalEditMessage').hide();
            this.view.render();
        } catch (error) {
            stopSpinner();
            console.error('Error updating message: ', error);
            alert('Error updating message:' + error);
        }
    }
}