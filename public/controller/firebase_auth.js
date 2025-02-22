import { 
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,

} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js"

import {app} from './firebase_core.js';
import {router} from './app.js';
//import { glHomeModel } from "./HomeController.js";

const auth = getAuth(app);

export let currentUser = null;

export async function loginFirebase(email, password){

    await signInWithEmailAndPassword(auth, email, password) ;
}

export async function logoutFirebase(){
    await signOut(auth);
}

onAuthStateChanged(auth, user => {
    currentUser = user;
    if(user) {
        console.log('AuthStateChanged: User logged in', user.email);
        const loginDiv = document.getElementById('loginDiv');
        loginDiv.classList.replace('d-block', 'd-none');
        const navMenu = document.getElementById('navMenuContainer');
        navMenu.classList.replace('d-none', 'd-block');
        const spaRoot = document.getElementById('spaRoot');
        spaRoot.classList.replace('d-none', 'd-block');
        router.navigate(window.location.pathname);
    } else {
        console.log('AuthStateChanged: User logged out');
        const loginDiv = document.getElementById('loginDiv');
        loginDiv.classList.replace('d-none', 'd-block');
        const navMenu = document.getElementById('navMenuContainer');
        navMenu.classList.replace('d-block', 'd-none');
        const spaRoot = document.getElementById('spaRoot');
        spaRoot.classList.replace('d-block', 'd-none');
        router.currentView = null;
        spaRoot.innerHTML = ''; //clear the view
        // glHomeModel.reset();
    }
} );

//Function for web app
export async function createAccount(email, password) {
    await createUserWithEmailAndPassword(auth, email, password);
}