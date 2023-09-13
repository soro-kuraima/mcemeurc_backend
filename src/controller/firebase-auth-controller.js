import { getApp, initializeApp, cert } from 'firebase-admin/app';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseApp = initializeApp({
  credential: cert(
    '/home/knoz/Documents/firebase/mcemeurccart-firebase-adminsdk-c8qyx-a5afcac922.json',
  ),
});

const db = getFirestore(firebaseApp);

const createUserWithEmail = async (user) => {
  try {
    const userRecord = await getAuth(firebaseApp).createUser({
      email: user.email,
      displayName: user.name,
      emailVerified: false,
      password: user.password,
      disabled: false,
    });
    const docRef = db.collection('users').doc(userRecord.email);
    await docRef.set({
      email: userRecord.email,
      displayName: userRecord.displayName,
      rank: user.rank,
      groceryCardNo: user.groceryCardNo,
    });
    return userRecord;
  } catch (e) {
    throw e;
  }
};

export { createUserWithEmail };
