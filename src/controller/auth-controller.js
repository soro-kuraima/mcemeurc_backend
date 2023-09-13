import { prisma } from '../util/prisma-client.js';
import { createUserWithEmail } from './firebase-auth-controller.js';

const requestAuth = async (req, res) => {
  // Controller logic for '/request-auth' route
  console.log(req);
  try {
    const authRequest = await prisma.authRequest.create({
      data: {
        email: req.body.email,
        password: req.body.password,
        groceryCardNo: req.body.groceryCardNo,
        address: req.body.address,
        name: req.body.name,
        rank: req.body.rank,
      },
    });
    res.send('Created Auth Request');
  } catch (e) {
    console.log(e);
    if (e.code == 'P2002') {
      res.status(400).send('Already requested. Wait for admin to authorize');
      return;
    }
    res.status(400).send('Bad request');
  }
};

const getAuthRequests = async (req, res) => {
  // Controller logic for '/get-auth-requests' route
  console.log(req);
  try {
    const authRequests = await prisma.authRequest.findMany();
    res.json(authRequests);
  } catch (e) {
    console.log(e);
    res.status(400).send('Bad request');
  }
};

const getAuthRequestById = async (req, res) => {
  // Controller logic for '/get-auth-request/:id' route
  console.log(req);
  try {
    const authRequest = await prisma.authRequest.findUnique({
      where: {
        id: Number(req.query.id),
      },
    });

    if (authRequest == null) {
      res.status(400).send('user not found');
      return;
    }
    res.json(authRequest);
  } catch (e) {
    console.log(e);
    res.status(400).send('user not found');
  }
};

const approveAuthRequestById = async (req, res) => {
  try {
    const authRequest = await prisma.authRequest.findUnique({
      where: {
        id: Number(req.query.id),
      },
    });
    const user = await createUserWithEmail(authRequest);
    await prisma.authRequest.delete({
      where: {
        id: Number(req.query.id),
      },
    });

    await prisma.user.create({
      data: {
        email: authRequest.email,
        groceryCardNo: authRequest.groceryCardNo,
        address: authRequest.address,
        name: authRequest.name,
        rank: authRequest.rank,
      },
    });
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
};

const rejectAuthRequestById = async (req, res) => {
  // Controller logic for '/reject-auth-request/:id' route
  try {
    const rejectAuth = await prisma.authRequest.delete({
      where: {
        id: Number(req.query.id),
      },
    });
    res.send('Deleted user successfully');
  } catch (e) {
    res.status(400).send('user not found');
  }
};

export {
  requestAuth,
  getAuthRequests,
  getAuthRequestById,
  approveAuthRequestById,
  rejectAuthRequestById,
};
