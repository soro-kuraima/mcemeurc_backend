import { getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const firebaseApp = getApp();

const db = getFirestore(firebaseApp);

const getUtilisedLimit = (previousOrders, index) => {
  const limit = previousOrders.reduce((acc, order) => {
    const product = order.products.find((p) => p.product === index);
    if (product) {
      return acc + product.quantity;
    } else {
      return acc;
    }
  }, 0);

  return limit;
};

const verifyOrder = async (req, res) => {
  try {
    const decodedToken = await getAuth(firebaseApp).verifyIdToken(
      req.query.idToken,
    );
    const email = decodedToken.email;
    const order = res.body.order;
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const previousOrders = db
      .collection('orders')
      .where('user', '==', email)
      .where('orderDate', '>=', firstDay)
      .get();

    const orderLimits = order.products.map(async (product) => {
      const quantityAlreadyOrdered = getUtilisedLimit(previousOrders);
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
    const isValidOrder = orderLimits.every(
      (orderLimit) => !orderLimit.limitExceeded,
    );
    if (isValidOrder) {
      res.send('is a valid Order');
      return;
    } else {
      res.status(400).json(orderLimits);
      return;
    }
  } catch (e) {
    res.status(400).json(e);
  }
};

export { verifyOrder };
