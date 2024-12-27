const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json'); // Update the path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://marketplaceweb-a6d94.firebaseio.com'
});

const uid ='SfpuHX01hsS5yVyKebwhq4YYklN2'; // Replace with the UID of the user to be an admin

admin.auth().setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Successfully added admin claim to user.');
    return admin.firestore().collection('users').doc(uid).set({
      role: 'admin'
    }, { merge: true });
  })
  .then(() => {
    console.log('Successfully updated Firestore for admin user.');
  })
  .catch((error) => {
    console.error('Error adding admin claim:', error);
  });
