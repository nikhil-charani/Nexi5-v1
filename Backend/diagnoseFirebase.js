const { db } = require("./config/firebase");

async function diagnose() {
    console.log("--- FIREBASE DIAGNOSTIC ---");
    try {
        console.log("Testing connection to 'employees' collection...");
        const snapshot = await db.collection("employees").limit(1).get();
        console.log("✅ Firestore Connection: OK");
        console.log("Data found:", snapshot.size > 0 ? "Yes" : "No (Empty collection)");
        
        console.log("\nTesting connection to 'tasks' collection...");
        const taskSnap = await db.collection("tasks").limit(1).get();
        console.log("✅ Tasks Access: OK");
        
    } catch (error) {
        console.error("❌ FIREBASE ERROR:", error.code || "Unknown");
        console.error("Message:", error.message);
        
        if (error.message.includes("quota")) {
            console.error("\n💡 CAUSE: You have exceeded your Firebase Free Tier usage for today.");
        } else if (error.message.includes("permission")) {
            console.error("\n💡 CAUSE: Service Account permissions are invalid.");
        }
    }
    process.exit(0);
}

diagnose();
