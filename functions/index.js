// Fixed, dont change it if you are using firebase
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");
//const { onUpdate } = require(firebase-functions/lib/providers/remoteConfig);

// Remember this pattern
const ALGOLIA_APP_ID = "NFXHRVUMIH"; //Copy from API Keys/Application ID
const ALGOLIA_ADMIN_KEY = "9b5fdb3ac9aa85aeb6ab5b023d0c4e85"; // Copy from API Keys/Admin API Key
const ALGOLIA_INDEX_NAME = "Users"; //The name of your Index (Can use anyname)

// Copy the rest of code
admin.initializeApp(functions.config().firebase);

// Add new docs
exports.createUser = functions.firestore
  .document("users/{usersId}")
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();
    data.objectID = snapshot.id;

    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    var index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.saveObject(data);
    console.log("Finished");
  });

// Update docs if any change
exports.updateUser = functions.firestore
  .document("users/{userID}")

  .onUpdate(async (snapshot, context) => {
    const newData = snapshot.after.data();
    newData.objectID = snapshot.after.id;

    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    var index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.saveObject(newData);
  });

// Delete docs
exports.deleteUser = functions.firestore
  .document("users/{userID}")

  .onDelete(async (snapshot, context) => {
    const oldID = snapshot.id;
    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    var index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.deleteObject(oldID);
  });
