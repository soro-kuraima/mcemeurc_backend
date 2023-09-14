import { prisma } from '../util/prisma-client.js';

const placeOrder = async (req, res) => {
  res.send('order placed');
};

export { placeOrder };
