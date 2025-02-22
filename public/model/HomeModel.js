export class HomeModel {
    messageList = null;

    constructor() {
        this.messageList = [];
    }

    addNewMessage(message) {
        //new message at begining
        this.messageList.unshift(message);  //unshift for adding at begining -----push for adding at end

    }

    getMessageById(docId) {
        return this.messageList.find(message => message.docId === docId);
    }

    deleteMessageById(docId) {
        const index = this.messageList.findIndex(message => message.docId === docId);
        if (index >= 0) {
            this.messageList.splice(index, 1);
        }
    }

    updateMessage(message, update) {
        message.title = update.title;
        message.contents = update.contents;
        message.timestamp = update.timestamp;
        // move the updated message to the beginning of the list; order by timestamp
        const index = this.messageList.findIndex(m => m.docId === message.docId);
        this.messageList.splice(index, 1);
        this.messageList.unshift(message);
    }
}