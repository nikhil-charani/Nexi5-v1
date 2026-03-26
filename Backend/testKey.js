const { auth } = require("./config/firebase");

async function testAuth() {
    try {
        console.log("Testing with new service account key...");
        const email = `test.key.${Date.now()}@hrm.com`;
        const user = await auth.createUser({
            email: email,
            password: "testpassword123",
            displayName: "Key Test"
        });
        console.log("SUCCESS! User created:", user.uid);
        
        // Clean up
        await auth.deleteUser(user.uid);
        console.log("Test user deleted.");
    } catch (e) {
        console.error("FAILED. Error:", e.message);
    }
}

testAuth();
