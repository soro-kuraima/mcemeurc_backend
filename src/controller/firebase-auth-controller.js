import { initializeApp, cert } from 'firebase-admin/app';

import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECTID,
  private_key_id: process.env.PRIVATEKEYID,
  private_key: process.env.PRIVATEKEY,
  client_email: process.env.CLIENTEMAIL,
  client_id: process.env.CLIENTID,
  auth_uri: process.env.AUTHURI,
  token_uri: process.env.TOKENURI,
  auth_provider_x509_cert_url: process.env.AUTHPROVIDERX509CERTURL,
  client_x509_cert_url: process.env.CLIENTX509CERTURL,
  universe_domain: process.env.UNIVERSEDOMAIN,
};

const firebaseApp = initializeApp({
  credential: cert(serviceAccount),
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
      address: user.address,
    });
    return userRecord;
  } catch (e) {
    throw e;
  }
};

export { createUserWithEmail };
