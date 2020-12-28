const functions = require("firebase-functions");
const admin = require("firebase-admin");
const algoliasearch = require("algoliasearch");
//const { onUpdate } = require(firebase-functions/lib/providers/remoteConfig);

const ALGOLIA_APP_ID = "NFXHRVUMIH";
const ALGOLIA_ADMIN_KEY = "9b5fdb3ac9aa85aeb6ab5b023d0c4e85";
const ALGOLIA_INDEX_NAME = "Users";

admin.initializeApp(functions.config().firebase);

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

exports.updateUser = functions.firestore
  .document("users/{userID}")

  .onUpdate(async (snapshot, context) => {
    const newData = snapshot.after.data();
    newData.objectID = snapshot.after.id;

    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    var index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.saveObject(newData);
  });

exports.deleteUser = functions.firestore
  .document("users/{userID}")

  .onDelete(async (snapshot, context) => {
    const oldID = snapshot.id;
    var client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);

    var index = client.initIndex(ALGOLIA_INDEX_NAME);
    index.deleteObject(oldID);
  });
