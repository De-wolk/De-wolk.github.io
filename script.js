import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.6/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  addDoc, // Importeer de addDoc functie
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

async function displayRentedKolven() {
  try {
    const kolvenCollectionRef = collection(firestore, "kolven");
    const snapshot = await getDocs(kolvenCollectionRef);

    // Selecteer de tabel waarin we de kolven willen weergeven
    const tableBody = document.getElementById("kolvenTableBody");
    tableBody.innerHTML = ""; // Leeg de inhoud van de tabel voordat we nieuwe rijen toevoegen

    snapshot.forEach((doc) => {
      const kolfData = doc.data();
      // Maak een nieuwe tabelrij aan en voeg deze toe aan de tabel
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${kolfData.kolfNaam}</td>
        <td>${kolfData.naam}</td>
        <td>${kolfData.adres}</td>
        <td>${kolfData.gsm}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Fout bij het ophalen en weergeven van kolven:", error);
  }
}

async function verhuurKolf(kolfNummer) {
  const naam = document.getElementById("naam").value;
  const adres = document.getElementById("adres").value;
  const gsm = document.getElementById("gsm").value;

  // Kolfnaam instellen op basis van het kolfnummer
  const kolfNaam = `Kolf ${kolfNummer}`;

  // Verwijzing naar het specifieke document voor de kolf
  const kolfDocRef = doc(firestore, "kolven", kolfNaam);

  try {
    // Controleren of de kolf al is uitgeleend
    const kolfDoc = await getDoc(kolfDocRef);

    if (kolfDoc.exists()) {
      // Kolf is al uitgeleend, dus nemen we hem terug
      await deleteDoc(kolfDocRef);
      alert(`${kolfNaam} is teruggebracht.`);
    } else {
      // Controleren of het naamveld is ingevuld bij het verhuren
      if (!naam) {
        alert("Voer alstublieft uw naam in voordat u een kolf verhuurt.");
        return; // Stop de functie als het naamveld niet is ingevuld
      }

      // Kolf is niet uitgeleend, dus verhuren we hem
      await setDoc(kolfDocRef, {
        kolfNaam: kolfNaam,
        naam: naam,
        adres: adres,
        gsm: gsm,
      });
      alert(`${kolfNaam} is verhuurd aan ${naam}.`);

      // Voeg de verhuurde kolf toe aan de verhuurGeschiedenis collectie met een unieke document-ID
      const timestamp = new Date(); // Haal de huidige datum en tijd op
      const verhuurGeschiedenisCollectionRef = collection(
        firestore,
        "verhuurGeschiedenis"
      );
      await addDoc(verhuurGeschiedenisCollectionRef, {
        kolfNaam: kolfNaam,
        naam: naam,
        adres: adres,
        gsm: gsm,
        timestamp: timestamp, // Voeg de tijdstempel toe aan het document
      });

      // Maak de inputvelden leeg
      document.getElementById("naam").value = "";
      document.getElementById("adres").value = "";
      document.getElementById("gsm").value = "";
    }

    // Update de weergegeven kolven in de tabel
    await displayRentedKolven();
  } catch (error) {
    console.error("Fout bij het verhuren van de kolf:", error);
  }

  // Update knopkleur op basis van verhuurstatus
  updateButtonColor(kolfNummer);
}

// Functie om de kleur van de knop bij te werken op basis van de verhuurstatus
async function updateButtonColor(kolfNummer) {
  const kolfNaam = `Kolf ${kolfNummer}`;
  const kolfDocRef = doc(firestore, "kolven", kolfNaam);

  try {
    const kolfDocSnapshot = await getDoc(kolfDocRef);
    const button = document.getElementById(`kolf${kolfNummer}`);

    if (kolfDocSnapshot.exists()) {
      // Kolf is in de lijst, knopkleur rood
      button.style.backgroundColor = "red";
    } else {
      // Kolf is niet in de lijst, knopkleur groen
      button.style.backgroundColor = "green";
    }
  } catch (error) {
    console.error("Fout bij het controleren van de verhuurstatus:", error);
  }
}

// Voeg event listeners toe aan de knoppen
document.getElementById("kolf1").addEventListener("click", function () {
  verhuurKolf(1);
});

document.getElementById("kolf2").addEventListener("click", function () {
  verhuurKolf(2);
});

document.getElementById("kolf3").addEventListener("click", function () {
  verhuurKolf(3);
});

document.getElementById("kolf4").addEventListener("click", function () {
  verhuurKolf(4);
});

document.getElementById("kolf5").addEventListener("click", function () {
  verhuurKolf(5);
});

// Voeg event listener toe voor het laden van de pagina
window.addEventListener("DOMContentLoaded", () => {
  // Display rented kolven and update button colors
  displayRentedKolven().then(() => {
    // Loop door alle kolven en update de knopkleuren
    for (let i = 1; i <= 5; i++) {
      updateButtonColor(i);
    }
  });
});
