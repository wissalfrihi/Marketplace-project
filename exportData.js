const admin = require('firebase-admin');
const fs = require('fs');

const serviceAccount = require('./config/serviceAccountKey.json'); // Update the path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://marketplaceweb-a6d94.firebaseio.com'
});

const db = admin.firestore();

const exportCollection = async (collectionName) => {
  const snapshot = await db.collection(collectionName).get();
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  fs.writeFileSync(`${collectionName}.json`, JSON.stringify(data, null, 2));
  console.log(`Exported ${collectionName} collection data to ${collectionName}.json`);
};

const exportAllData = async () => {
  await exportCollection('users'); // Export 'users' collection
  await exportCollection('products'); // Export 'products' collection
  await exportCollection('cart'); // Export 'cart' collection
};

exportAllData();
