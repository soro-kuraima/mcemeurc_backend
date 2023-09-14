import express from 'express';
import {
  requestAuth,
  getAuthRequests,
  getAuthRequestById,
  rejectAuthRequestById,
  approveAuthRequestById,
} from '../controller/auth-controller.js';

import { placeOrder } from '../controller/order-controller.js';

const router = express.Router();

router.post('/request-auth', requestAuth);

router.get('/get-auth-requests', getAuthRequests);

router.get('/get-auth-request', getAuthRequestById);

router.get('/approve-auth-request', approveAuthRequestById);

router.delete('/reject-auth-request', rejectAuthRequestById);

router.post('place-order', placeOrder);

export { router };
