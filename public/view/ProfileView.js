import { currentUser } from "../controller/firebase_auth.js";
import { AbstractView } from "./AbstractView.js";

export class ProfileView extends AbstractView{
    // instance variables 
    controller = "null";
    constructor(controller) {
        super();
        this.controller =controller;
    }

    async onMount(){
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access Denied</h1>';
            return;
        }
        console.log('ProfileView.onMount() called');
    }

    async updateView() {
        console.log('ProfileView.updateView() called');
        const viewWrapper = document.createElement('div');
        viewWrapper.innerHTML = `
            <h1>Profile</h1>
            <p>Welcome to the profile page.</p>
            <p> Email: ${currentUser.email}</p>
            <p> User UID: ${currentUser.uid}</p>    
        `;
        return viewWrapper;
    }

    attachEvents() {
        console.log('ProfileView.attacheEvents() called');
    }

    async onLeave() {
        if (!currentUser) {
            this.parentElement.innerHTML = '<h1>Access Denied</h1>';
            return;
        }
        console.log('ProfileView.onLeave() called');
    }
}