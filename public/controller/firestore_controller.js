import {
   getFirestore,
   collection,
   addDoc,
   query,
   orderBy,
   getDocs,
   doc,
   deleteDoc,
   updateDoc,

} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js"
import { Message } from "../model/Message.js";

import { app } from './firebase_core.js';
const db = getFirestore(app);

const COLLECTION_MESSAGE_FORM = 'message_form';

export async function addMessage(message) {
   const collRef = collection(db, COLLECTION_MESSAGE_FORM);
   const docRef = await addDoc(collRef, message);
   return docRef.id;
}

export async function getMessageList() {
   let messageList = [];
   const q = query(collection(db, COLLECTION_MESSAGE_FORM),
      orderBy('timestamp', 'desc'));
   const querySnapshot = await getDocs(q);
   querySnapshot.forEach((doc) => {
      const m = doc.data();
      const message = new Message(m);
      message.setDocId(doc.id);
      messageList.push(message);
   });
   return messageList;
}

export async function deleteMessageById(docId) {
   const docRef = doc(db, COLLECTION_MESSAGE_FORM, docId);
   await deleteDoc(docRef);
}

export async function updateMessageById(docId, update) {
   // update = {title: 'new title', contents: 'new contents'}
   const docRef = doc(db, COLLECTION_MESSAGE_FORM, docId);
   await updateDoc(docRef, update);
}