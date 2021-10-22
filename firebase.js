var firebaseConfig = {
  apiKey: "AIzaSyDtaGJ3OY_Wyu3lvGd7t70XbVzfE44XQlw",
  authDomain: "persec-to-do-list.firebaseapp.com",
  databaseURL:
    "https://persec-to-do-list-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "persec-to-do-list",
  storageBucket: "persec-to-do-list.appspot.com",
  messagingSenderId: "1006326478782",
  appId: "1:1006326478782:web:c02968c6c39c412f4debef",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
