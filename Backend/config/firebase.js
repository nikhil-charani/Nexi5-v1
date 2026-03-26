const admin=require("firebase-admin")
const path = require('path')
const fs = require('fs')

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Attempt to load from an environment variable string (JSON format)
    try {
        const serviceAccountConfig = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        credential = admin.credential.cert(serviceAccountConfig);
    } catch (error) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT. Make sure it's valid JSON.", error);
    }
}

// Fallback to local files or Render Secret Files
if (!credential) {
    const possiblePaths = [
        '/etc/secrets/firebase.json', // Render Secret File standard path
        '/etc/secrets/ServiceAccountKey-prod.json', // Alternate name they might have used
        '/etc/secrets/ServiceAccountKey.json',
        path.resolve(__dirname, './ServiceAccountKey-prod.json'),
        path.resolve(__dirname, './ServiceAccountKey-dev.json')
    ];

    for (let p of possiblePaths) {
        if (fs.existsSync(p)) {
            console.log(`Found Firebase configuration file at: ${p}`);
            credential = admin.credential.cert(p);
            break;
        }
    }
}

if (!credential) {
    console.error("--- DIAGNOSTIC INFO ---");
    console.error("No valid Firebase Service Account found in Environment Variables or Secret Files.");
    try {
        if (fs.existsSync('/etc/secrets')) {
            const files = fs.readdirSync('/etc/secrets');
            console.error("Files present in /etc/secrets directory: ", files);
        } else {
            console.error("/etc/secrets directory does NOT exist. You haven't mounted any Secret Files.");
        }
    } catch (e) {
        console.error("Could not read /etc/secrets", e);
    }
    console.error("-----------------------");
    process.exit(1); // Force crash so Render logs the exact reason
}

admin.initializeApp({
    credential: credential
});

const db = admin.firestore();
const auth=admin.auth()
module.exports={admin,db,auth};