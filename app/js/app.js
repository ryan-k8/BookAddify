// Your web app's Firebase configuration
firebaseConfig = {
  apiKey: "AIzaSyAJH95UxbtGoMW9Ucj0ztsskXZzcX8MzPk",
  authDomain: "bookaddify.firebaseapp.com",
  projectId: "bookaddify",
  storageBucket: "bookaddify.appspot.com",
  messagingSenderId: "1031147019594",
  appId: "1:1031147019594:web:11cb1dfc09e71734aff5b3",
};
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

// firestore database
const db = firebase.firestore(app);

// individual book class
class book {
  constructor(name, author, publisher, imgSrc, resSrc, summary) {
    this.name = name;
    this.author = author;
    this.publisher = publisher;
    this.imgSrc = resSrc;
    this.summary = summary;
  }
}

// ui interface class
class UI {
  static showAlert(status, message) {
    //alert div
    const alertDiv = document.createElement("div");
    alertDiv.classList.add("alert", `alert-${status}`, "w-100", "mx-auto");
    alertDiv.setAttribute("role", "alert");
    alertDiv.innerHTML = `${message}`;

    const parentDiv = document.getElementById("main-app-container");
    parentDiv.prepend(alertDiv);

    // clear alert div
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 1200);
  }

  // fetch from external api
  static fetchFromApi(queryName) {
    console.log(`fetching from ext api for : ${queryName}`);
  }
}

const addBtn = document.getElementById("basic-addon2");
const searchBtn = document.getElementById("basic-addon1");
const searchInput = document.getElementById("search-input");

addBtn.addEventListener("click", (e) => {
  if (searchInput.value === "") {
    UI.showAlert("danger", "Please enter something");
  } else {
    UI.fetchFromApi(searchInput.value.trim());
  }
  e.preventDefault();
});
