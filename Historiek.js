import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.6/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA8VfZ6lwEjZtZ0OXxSW70AtJbJUcL_gkA",
  authDomain: "kolven2-fd066.firebaseapp.com",
  projectId: "kolven2-fd066",
  storageBucket: "kolven2-fd066.appspot.com",
  messagingSenderId: "780346553911",
  appId: "1:780346553911:web:e0fd63ea9d87d5610eb1b2",
  measurementId: "G-2MEFC7DC2W",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

async function displayVerhuurGeschiedenis() {
  try {
    const verhuurGeschiedenisCollectionRef = collection(
      firestore,
      "verhuurGeschiedenis"
    );
    const snapshot = await getDocs(verhuurGeschiedenisCollectionRef);

    const tableBody = document.getElementById("verhuurGeschiedenisTableBody");
    tableBody.innerHTML = "";
    snapshot.forEach((doc) => {
      const verhuurData = doc.data();
      let dateTimeString = "";

      if (verhuurData.timestamp) {
        const timestamp = verhuurData.timestamp.toDate();
        dateTimeString = timestamp.toLocaleString();
      }

      // Maak een nieuwe tabelrij aan en voeg deze toe aan de tabel
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${verhuurData.kolfNaam}</td>
          <td>${verhuurData.naam}</td>
          <td>${verhuurData.adres}</td>
          <td>${verhuurData.gsm}</td>
          <td>${dateTimeString}</td> <!-- Voeg de leesbare datum- en tijdnotatie toe -->
        `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error(
      "Fout bij het ophalen en weergeven van de verhuurgeschiedenis:",
      error
    );
  }
}

// Voeg event listener toe voor het laden van de pagina
window.addEventListener("DOMContentLoaded", () => {
  // Display verhuurgeschiedenis
  displayVerhuurGeschiedenis();
});
