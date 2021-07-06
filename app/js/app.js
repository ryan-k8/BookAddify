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

// reference to the firestore database
const db = firebase.firestore(app);

// individual book class
class book {
  constructor(name, author, publisher, imgSrc, resSrc, summary) {
    this.name = name;
    this.author = author;
    this.publisher = publisher;
    this.imgSrc = imgSrc;
    this.resSrc = resSrc;
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
    return new Promise((resolve) => {
      // still testing
      // mock delay url : https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay={}ms
      // TODO fix heroku deployed api
      // local host api http://127.0.0.1:5000/query/
      fetch(`http://127.0.0.1:5000/query/${queryName}`)
        .then((res) => {
          const status = res.status;
          if (status === 200) {
            return res.json();
          } else {
            UI.showAlert("danger", `Connection Error : ${status}`);
          }
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => UI.showAlert("danger", err));
    });
  }

  static showSpinners(type) {
    if (type == "mainbody") {
      const spinner = document.createElement("div");
      spinner.classList.add(
        "Spinner",
        "main-spinner-div",
        "d-flex",
        "w-100",
        "justify-content-center"
      );
      const spinnerDiv = document.createElement("div");
      spinnerDiv.classList.add("main-spinner", "spinner-border");
      spinnerDiv.setAttribute("role", "status");
      const spanInside = document.createElement("span");
      spanInside.className = "visually-hidden";
      spanInside.innerHTML = "Loading...";

      spinnerDiv.append(spanInside);
      spinner.append(spinnerDiv);

      document.querySelector("#main-fdb-container").appendChild(spinner);
    }

    if (type == "modalbody") {
      const spinner = document.createElement("div");
      spinner.classList.add(
        "Spinner",
        "modal-spinner",
        "d-flex",
        "align-items-center",
        "justify-content-center"
      );
      const spinnerDiv = document.createElement("div");
      spinnerDiv.classList.add("spinner-border");
      spinnerDiv.setAttribute("role", "status");
      const spanInside = document.createElement("span");
      spanInside.className = "visually-hidden";
      spanInside.innerHTML = "Loading...";

      spinnerDiv.append(spanInside);
      spinner.append(spinnerDiv);

      document.querySelector(".modal-body").appendChild(spinner);
    }
  }

  static removeSpinners() {
    document.querySelector(".Spinner").remove();
  }

  static renderItemsFromFirebaseData(docArray) {
    const booksDiv = document.createElement("div");
    booksDiv.classList.add(
      "row",
      "row-cols-1",
      "row-cols-md-3",
      "row-cols-xl-4",
      "g-3",
      "g-md-4",
      "mx-auto",
      "justify-content-center"
    );
    docArray.forEach((doc) => {
      const bookDiv = document.createElement("div");
      bookDiv.classList.add("col", "mx-auto", "mx-sm-0");
      bookDiv.setAttribute("style", "width: 20rem !important");
      bookDiv.innerHTML = ` <div class="card" data-firebase-id="${
        doc.firebaseId
      }">
      <img
        src="${doc.data.resources.image}"
        class="card-img-top"
        alt="..."
        style="height: 17rem !important"
      />
      <div class="card-body">
        <h5 class="card-title">${doc.data.book}</h5>
        <div class="au-pub d-flex justify-content-between">
          <h6 class="card-subtitle text-muted ms-2">${doc.data.author}</h6>
          <h6 class="card-subtitle text-muted me-2">${doc.data.publisher}</h6>
        </div>
        <p class="card-text">
        ${doc.data.summary.substring(0, 80) + "..."}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <a href="${
            doc.data.resources.downloads[1]
          }" type="button" class="btn btn-success me-2">Download</a>
          <i class="fas fa-trash fa-2x"></i>
        </div>
      </div>
    </div>`;
      booksDiv.appendChild(bookDiv);
    });
    // append booksDiv (having all books) to dom
    document.getElementById("main-fdb-container").appendChild(booksDiv);
  }
}

class Firebase {
  static addToDb(data) {
    // doc w/ custom id :  db.collection('users').doc('id-here').setdata();
    db.collection("app")
      .add(data)
      .then((docRef) =>
        UI.showAlert("success", `Added To Firebase : ${docRef.id}`)
      )
      .catch((err) =>
        UI.showAlert("error", `Firebase Error Adding Item : ${err}`)
      );
  }

  static readDb() {
    return new Promise((resolve) => {
      db.collection("app")
        .get()
        .then((collection) => {
          let db = [];
          collection.forEach((doc) => {
            db.push({ firebaseId: doc.id, data: doc.data() });
          });
          resolve(db);
        })
        .catch((err) => UI.showAlert("danger", `Firebase Read Error : ${err}`));
    });
  }
}

const addBtn = document.getElementById("basic-addon2");
const searchBtn = document.getElementById("basic-addon1");
const searchInput = document.getElementById("search-input");

addBtn.addEventListener("click", (e) => {
  if (searchInput.value === "") {
    UI.showAlert("danger", "Please enter something");

    //Firebase.readDb().then((data) => console.log(data));
  } else {
    UI.showSpinners("mainbody");
    UI.fetchFromApi(searchInput.value.trim()).then((data) => {
      Firebase.addToDb(data);
      UI.removeSpinners();
    });
    // UI.renderItemsFromFirebase() [TODO];
  }
  e.preventDefault();
});

window.addEventListener("DOMContentLoaded", async () => {
  setTimeout(UI.showSpinners("mainbody"), 2000);
  // let database = await Firebase.readDb();
  // UI.removeSpinners();
  // UI.renderItemsFromFirebaseData(database);
});
