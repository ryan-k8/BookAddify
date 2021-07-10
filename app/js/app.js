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
    }, 1600);
  }

  // fetch from external api
  static fetchFromApi(endpoint, query) {
    return new Promise((resolve) => {
      // still testing
      // mock delay url : https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay={}ms
      //https://immense-bastion-95607.herokuapp.com/query/
      fetch(`${endpoint}${query}`)
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
        ${doc.data.summary.substring(0, 50) + "..."}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <a href="${
            doc.data.resources.downloads[1]
          }" type="button" class="btn btn-success me-2" target="_blank">Download</a>
          <i class="fas fa-trash fa-2x" id="remove-btn"></i>
        </div>
      </div>
    </div>`;
      booksDiv.appendChild(bookDiv);
    });
    // append booksDiv (having all books) to dom
    document.getElementById("main-fdb-container").appendChild(booksDiv);
  }

  static renderSearchItems(searchData) {
    const modalBodyDiv = document.querySelector(".modal-body");
    searchData.forEach((item) => {
      const searchItemDiv = document.createElement("div");
      searchItemDiv.classList.add("search-result-item-div", "mb-3", "md-md-4");
      searchItemDiv.innerHTML = `
      <div class="container w-100">
      <div class="row row-cols-1 row-cols-md-2 g-3">
        <div
          class="col-12 col-sm-12 col-md-12 col-lg-4 p-2 p-md-4"
        >
          <img
            src="${item.img}"
            class="card-img rounded-start"
            alt="..."
            style="height: 22rem !important"
          />
        </div>
        <div class="col col-sm-12 col-md-12 col-lg p-2 p-sm-4">
          <h5 class="text-center mb-2">${item.title}</h5>
          <div class="book-details p-1 my-2">
            <div
              class="
                d-flex
                justify-content-between
                align-items-center
                my-2
                border-bottom
              "
            >
              <div>
                <p class="text-muted">Author:</p>
              </div>
              <div>
                <p class="text-muted ms-1">${item.author}</p>
              </div>
            </div>
            <div
              class="
                d-flex
                justify-content-between
                align-items-center
                my-2
                border-bottom
              "
            >
              <div>
                <p class="text-muted">Publisher:</p>
              </div>
              <div>
                <p class="text-muted ms-1">
                  ${item.publisher}
                </p>
              </div>
            </div>
            <div
              class="
                d-flex
                justify-content-between
                align-items-center
                my-2
                border-bottom
              "
            >
              <div>
                <p class="text-muted">Year: ${item.year}</p>
              </div>
              <div>
                <p class="text-muted ms-1">Language: ${item.language}</p>
              </div>
            </div>
          </div>
          <a href="##" class="btn btn-warning" id="fdb-add-btn" data-book-id="${item.id}"
           >Add To Firestore Db</a
          >
        </div>
      </div>
    </div>`;
      modalBodyDiv.appendChild(searchItemDiv);
    });
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
  static removeFromDb(docId) {
    return new Promise((resolve) => {
      db.collection("app")
        .doc(docId)
        .delete()
        .then(() => {
          UI.showAlert("success", "Successfully removed from Firebase");
          resolve("deleted");
        })
        .catch((err) =>
          UI.showAlert("danger", `Firebase remove error : ${err}`)
        );
    });
  }
}

const addBtn = document.getElementById("basic-addon2");
const searchBtn = document.getElementById("basic-addon1");
const searchInput = document.getElementById("search-input");
const modalCloseBtn = document.getElementById("modal-close-btn");

addBtn.addEventListener("click", async (e) => {
  if (searchInput.value === "") {
    UI.showAlert("danger", "Please enter something");
  } else {
    // clear items from windowDOMContentLoaded Event.
    document.querySelector("#main-fdb-container").innerHTML = null;
    UI.showSpinners("mainbody");
    const query = searchInput.value.trim();
    // incase of error
    try {
      let apiData = await UI.fetchFromApi(
        "https://immense-bastion-95607.herokuapp.com/query/",
        query
      );
      Firebase.addToDb(apiData);
    } catch (err) {
      UI.showAlert(
        "warning",
        "Couldn't add the book due to error caused by the api."
      );
      console.log(err);
      UI.removeSpinners();
    }
    let firebaseDb = await Firebase.readDb();
    UI.removeSpinners();
    UI.renderItemsFromFirebaseData(firebaseDb);
  }
  e.preventDefault();
});

window.addEventListener("DOMContentLoaded", async () => {
  setTimeout(UI.showSpinners("mainbody"), 2000);
  let firebaseDb = await Firebase.readDb();
  UI.removeSpinners();
  UI.renderItemsFromFirebaseData(firebaseDb);
});

//removal (from both firebase & UI)
document
  .querySelector("#main-fdb-container")
  .addEventListener("click", async (e) => {
    if (e.target.id === "remove-btn") {
      const parentDiv = e.target.parentNode;

      const removeSpinner = document.createElement("div");
      removeSpinner.setAttribute("role", "spinner");
      removeSpinner.classList.add("spinner-border", "text-danger");

      parentDiv.replaceChild(removeSpinner, e.target);

      // solves unknown deletion err (caused by DOM in some book items)
      let firebaseDocId;
      if (
        parentDiv.parentElement.parentElement.hasAttribute("data-firebase-id")
      ) {
        firebaseDocId =
          parentDiv.parentElement.parentElement.getAttribute(
            "data-firebase-id"
          );
      } else {
        firebaseDocId =
          parentDiv.parentElement.parentElement.parentElement.getAttribute(
            "data-firebase-id"
          );
      }

      await Firebase.removeFromDb(firebaseDocId);
      const bookItemDiv = parentDiv.parentElement.parentElement.parentElement;
      bookItemDiv.remove();

      // move to the top alert (kinda clunky?);
      window.scrollTo(0, 0);
    }
  });

// clear content inside modal on closing
modalCloseBtn.addEventListener(
  "click",
  () => (document.querySelector(".modal-body").innerHTML = null)
);

//searching books from UI input
searchBtn.addEventListener("click", async (e) => {
  const query = searchInput.value;
  if (query === "") {
    UI.showAlert("danger", "please enter something");
  } else {
    document.querySelector(".modal-body").innerHTML = null;
    UI.showSpinners("modalbody");
    let searchData = await UI.fetchFromApi(
      "https://immense-bastion-95607.herokuapp.com/search/",
      query
    );
    UI.removeSpinners();
    UI.renderSearchItems(searchData);
  }
});

// event for addtofirestoredb
document.body.addEventListener("click", async (e) => {
  const firebaseAddSpinner = document.createElement("div");
  firebaseAddSpinner.classList.add(
    "spinner-border",
    "text-warning",
    "firebase-add-spinner"
  );

  const doneIcon = document.createElement("i");
  doneIcon.classList.add("fas", "fa-check-circle", "fa-2x", "text-success");

  if (e.target.hasAttribute("data-book-id")) {
    const bookId = e.target.getAttribute("data-book-id");
    e.target.parentElement.replaceChild(firebaseAddSpinner, e.target);
    let bookData = await UI.fetchFromApi(
      "https://immense-bastion-95607.herokuapp.com/book/",
      bookId
    );
    Firebase.addToDb(bookData);
    firebaseAddSpinner.parentElement.replaceChild(doneIcon, firebaseAddSpinner);

    //same rendering on main body
    document.querySelector("#main-fdb-container").innerHTML = null;
    UI.showSpinners("mainbody");
    let fdb = await Firebase.readDb();
    UI.removeSpinners();
    UI.renderItemsFromFirebaseData(fdb);
  }
});
