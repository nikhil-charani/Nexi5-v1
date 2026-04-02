const { db } = require("./config/firebase");

async function testFirestore() {
    try {
        console.log("Testing Firestore write...");
        await db.collection("Test").doc("test1").set({ time: Date.now() });
        console.log("SUCCESS! Firestore write worked.");
    } catch (e) {
        console.error("FIRESTORE ERROR:", e.message);
    }
}

testFirestore();
