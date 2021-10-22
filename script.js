firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in.
    document.getElementById("user_div").style.display = "block";
    document.getElementById("login_div").style.display = "none";
    document.getElementById("signin_div").style.display = "none";
    document.getElementById("signin").style.display = "none";
    document.getElementById("before").style.display = "none";
    document.getElementById("after").style.display = "block";
    document.getElementById("new-todo").style.display = "block";
    document.getElementById("edit-todo").style.display = "block";
    document.getElementById("todo-items-wrapper").style.display = "block";

    var user = firebase.auth().currentUser;

    if (user != null) {
      var email_id = user.email;
      document.getElementById("user_para").innerHTML =
        "Welcome User : " + email_id;
    }
  } else {
    // No user is signed in.
    document.getElementById("user_div").style.display = "none";
    document.getElementById("login_div").style.display = "block";
    document.getElementById("signin_div").style.display = "none";
    document.getElementById("before").style.display = "block";
    document.getElementById("after").style.display = "none";
    document.getElementById("signin").style.display = "none";
    document.getElementById("new-todo").style.display = "none";
    document.getElementById("edit-todo").style.display = "none";
    document.getElementById("todo-items-wrapper").style.display = "none";
  }
});

function login() {
  var userEmail = document.getElementById("username").value;
  var userPass = document.getElementById("passsword").value;

  firebase
    .auth()
    .signInWithEmailAndPassword(userEmail, userPass)
    .then(() => {
      alert("Successfully login!");
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorMessage = error.message;

      alert(errorMessage);
    });
}

function signin() {
  document.getElementById("login_div").style.display = "none";
  document.getElementById("signin_div").style.display = "block";
  document.getElementById("signin").style.display = "block";
  document.getElementById("before").style.display = "none";
}

function submit() {
  var email = document.getElementById("username-sign").value;
  var password = document.getElementById("passsword-sign").value;

  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      document.getElementById("signin").style.display = "none";
      document.getElementById("signin_div").style.display = "none";
    })
    .catch((error) => {
      var errorMessage = error.message;

      alert(errorMessage);
    });
}

function logout() {
  firebase.auth().signOut();
}

function getItems() {
  db.collection("todo-items").onSnapshot((snapshot) => {
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    generateItems(items);
  });
}

function generateItems(items) {
  let todoItems = [];

  firebase.auth().onAuthStateChanged((user) => {
    items.forEach((item) => {
      if (user && user.email === item.by) {
        let row = document.createElement("div");
        row.classList.add("row");

        let todoItem = document.createElement("div");
        todoItem.classList.add("todo-item");

        let checkContainer = document.createElement("div");
        checkContainer.classList.add("check");

        let checkMark = document.createElement("div");
        checkMark.classList.add("check-mark");
        checkMark.innerHTML = '<img src="assets/icon-check.svg">';
        checkMark.addEventListener("click", function () {
          markCompleted(item.id);
        });
        checkContainer.appendChild(checkMark);

        let todoText = document.createElement("div");
        todoText.classList.add("todo-text");
        todoText.innerText = item.text;

        if (item.status === true) {
          checkMark.classList.add("checked");
          todoText.classList.add("checked");
        }

        let editButton = document.createElement("button");
        editButton.innerText = "Edit";
        editButton.classList.add("edit-button", "modal");

        editButton.addEventListener("click", function () {
          editItem(item.id);
        });

        let deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.classList.add("delete-button");
        deleteButton.addEventListener("click", function () {
          deleteItem(item.id);
        });

        todoItem.appendChild(checkContainer);
        todoItem.appendChild(todoText);
        todoItem.appendChild(editButton);
        todoItem.appendChild(deleteButton);
        todoItems.push(todoItem);
      }
    });
    document.querySelector(".todo-items").replaceChildren(...todoItems);
  });
}

function addItem(event) {
  event.preventDefault();

  firebase.auth().onAuthStateChanged((user) => {
    let text = document.getElementById("todo-input");
    if (text.value.length <= 40) {
      db.collection("todo-items").add({
        text: text.value,
        status: false,
        by: user.email,
      });
      text.value = "";
      alert("Successfully add!");
    } else {
      alert("Texts are too long!");
    }
  });
}

function editItem(id) {
  let text = document.getElementById("todo-edit");
  if (text.value.length <= 40) {
    var data = text.value;
    text.value = "";
    var updatedData = db.collection("todo-items").doc(id);

    updatedData
      .update({
        text: data,
      })
      .then(() => {
        alert("Successfully updated!");
      })
      .catch((error) => {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
      });
  } else {
    alert("Texts are too long!");
  }
}

function deleteItem(id) {
  db.collection("todo-items")
    .doc(id)
    .delete()
    .then(() => {
      alert("Document successfully deleted!");
    })
    .catch((error) => {
      alert("Error removing document: ", error);
    });
}

function markCompleted(id) {
  let item = db.collection("todo-items").doc(id);
  item.get().then(function (doc) {
    if (doc.exists) {
      if (doc.data().status === true) {
        item.update({
          status: false,
        });
        alert("Successfully mark!");
      } else {
        item.update({
          status: true,
        });
        alert("Successfully unmark!");
      }
    }
  });
}

getItems();
