const admin = require("firebase-admin");
const path = require("path");

// Use the existing config
const { db } = require("../config/firebase");

async function migrate() {
    console.log("Starting attendance migration to daily_attendance collection...");
    
    try {
        const attendanceSnapshot = await db.collection("attendance").get();
        if (attendanceSnapshot.empty) {
            console.log("No attendance records found to migrate.");
            return;
        }

        console.log(`Found ${attendanceSnapshot.size} records. Beginning migration...`);
        let count = 0;

        for (const doc of attendanceSnapshot.docs) {
            const data = doc.data();
            const docId = doc.id;

            // Optional: You could backfill `name`, `month`, `department`, `role` here 
            // if needed, but for historical records just duplicating helps the frontend.
            if (data.date) {
                data.month = data.month || data.date.slice(0, 7);
            }

            try {
                // Merge-set to avoid overwriting existing data if run multiple times
                await db.collection("daily_attendance").doc(docId).set(data, { merge: true });
                count++;
                if (count % 10 === 0) {
                    console.log(`Migrated ${count}/${attendanceSnapshot.size} records...`);
                }
            } catch (err) {
                console.error(`Failed to migrate doc ${docId}:`, err);
            }
        }

        console.log(`Migration complete! Successfully copied ${count} records.`);
    } catch (e) {
        console.error("Migration failed due to a critical error:", e);
    }
}

migrate().then(() => process.exit(0));
