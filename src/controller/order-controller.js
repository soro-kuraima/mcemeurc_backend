import { getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseApp = getApp();

const db = getFirestore(firebaseApp);

const getUtilisedLimit = (previousOrders, index) => {
  const limit = previousOrders.reduce((acc, order) => {
    const keys = Object.keys(order.products);
    console.log(keys);
    keys.forEach((key) => {
      if (key == index) {
        console.log('order', order);
        console.log(order.products[key]);
        console.log(order.products[key]['quantity']);
        quantity = Number(order.products[key].quantity);
        return acc + quantity;
      } else {
        return acc;
      }
    });
  }, 0);
  return limit;
};

const verifyOrder = async (req, res) => {
  console.log('jwk token', req.query.idToken);
  try {
    const decodedToken = await getAuth(firebaseApp).verifyIdToken(
      req.query.idToken,
    );
    console.log('decoded token', decodedToken);
    const email = decodedToken.email;
    console.log('email', email);
    console.log(req.body);
    const order = req.body.order;
    console.log('order', order);
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const querySnapshot = await db
      .collection('orders')
      .where('user', '==', email)
      .where('orderDate', '>=', firstDay)
      .get();

    const previousOrders = querySnapshot.docs.map((doc) => doc.data());
    console.log('previous orders', previousOrders);

    const orderLimits = order.products.map(async (product) => {
      const quantityAlreadyOrdered = getUtilisedLimit(
        previousOrders,
        product.index.toString(),
      );
      console.log(
        `${quantityAlreadyOrdered} for user ${product.index} with monthly limit ${product.monthlyLimit}`,
      );
      if (
        product.monthlyLimit &&
        quantityAlreadyOrdered >= product.monthlyLimit
      ) {
        return {
          ...product,
          limitExceeded: true,
          exceededBy: quantityAlreadyOrdered - product.monthlyLimit,
        };
      } else {
        return {
          ...product,
          limitExceeded: false,
        };
      }
    });

    console.log('order limits', orderLimits);
    const isValidOrder = orderLimits.every(
      (orderLimit) => !orderLimit.limitExceeded,
    );
    console.log('is valid order', isValidOrder);
    if (isValidOrder) {
      res.send('is a valid Order');
      return;
    } else {
      console.log('from else', orderLimits);
      res.status(400).json(orderLimits);
      return;
    }
  } catch (e) {
    console.log('from catch block', e);
    res.status(400).json(e);
  }
};

export { verifyOrder };
