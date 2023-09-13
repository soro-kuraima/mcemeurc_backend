import express from 'express';
import cors from 'cors';
import { Sequelize } from 'sequelize';

import { router } from './src/router/routes.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use('/', router);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
