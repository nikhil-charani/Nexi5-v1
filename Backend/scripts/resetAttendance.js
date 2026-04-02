const admin = require("firebase-admin");
const { db } = require("../config/firebase");

async function resetCollections() {
  console.log("Starting reset of attendance collections...");

  const collections = ["attendance", "daily_attendance"];

  for (const collName of collections) {
    console.log(`Clearing collection: ${collName}`);
    try {
      const snapshot = await db.collection(collName).get();
      if (snapshot.empty) {
        console.log(`> Collection ${collName} is already empty.`);
        continue;
      }

      console.log(`> Found ${snapshot.size} documents in ${collName}. Deleting...`);
      const batch = db.batch();
      let count = 0;

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        console.log(`> Successfully deleted ${count} documents from ${collName}.`);
      }
    } catch (err) {
      console.error(`> Error clearing collection ${collName}:`, err);
    }
  }

  console.log("Database reset complete!");
  process.exit(0);
}

resetCollections();
