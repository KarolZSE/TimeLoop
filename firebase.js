    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
    import { getFirestore, collection, addDoc, getDocs, doc } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
    import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

    const firebaseConfig = {
    apiKey: "AIzaSyBf8DqJ5Sr8XSIoD7lAfmtpVfKpxoJyZpc",
    authDomain: "timeloop-d8d45.firebaseapp.com",
    projectId: "timeloop-d8d45",
    storageBucket: "timeloop-d8d45.firebasestorage.app",
    messagingSenderId: "751079405156",
    appId: "1:751079405156:web:509b8af263d5f752ba5171"
    };
  
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    signInAnonymously(auth).then(() => {
        console.log('Signed in');
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
    });

function DatabaseCall(SaveScoreToDatabase, name, Score, sizesquare) {
    onAuthStateChanged(auth, async (user) => {
    if (user) {
        var uid = user.uid;
        // Add a new document with a generated id.
        if (SaveScoreToDatabase == 1) {
            addDoc(collection(db, "users"), {
                uid: uid,
                name: name,
                score: Score,
                puzzles: sizesquare,
            }).then(() => {
                // Document written with ID: docRef.id
            }).catch((error) => {
                console.error("Error adding document: ", error);
            });
        }


        const usersSnapshot = await getDocs(collection(db, "users"));
        const leaderboardList = document.getElementById('leaderboard-list');
        leaderboardList.innerHTML = '';

for (const userDoc of usersSnapshot.docs) {
const userDocRef = doc(db, "users", userDoc.id);
const subcollectionSnapshot = await getDocs(collection(userDocRef, "knownSubcollectionName"));

const userData = userDoc.data();
const userName = userData.name || "Player";
const userScore = userData.score || 0;
const userPuzzle = userData.puzzles || "-";
const listItem = document.createElement('li');
listItem.innerHTML = `<span>${userName}</span><span>${userScore}</span><span>${userPuzzle}</span>`;
listItem.setAttribute('data-user-score', userScore);
leaderboardList.appendChild(listItem);

}
await sortList();

function sortList() {
var list, i, switching, b, shouldSwitch;
list = document.getElementById("leaderboard-list");
switching = true;
while (switching) {
switching = false;
b = list.getElementsByTagName("LI");
for (i = 0; i < (b.length - 1); i++) {
  shouldSwitch = false;
  if (Number(b[i].getAttribute('data-user-score')) < Number(b[i + 1].getAttribute('data-user-score'))) {
    shouldSwitch = true;
    break;
  }
}
if (shouldSwitch) {
  b[i].parentNode.insertBefore(b[i + 1], b[i]);
  switching = true;
}
}
}

    } else {
        console.log("You are sign out, want be able to save your data");
    }
})};
window.DatabaseCall = DatabaseCall;
DatabaseCall(0);