require('dotenv').config();
import express, { Request, Response } from 'express';

// Routes
import registerRoute from './register';
import loginRoute from './login';
import logoutRoute from './logout';
import tokenRoute from './token';

const app = express();
const port = 4000;

// Middleware to parse JSON
app.use(express.json());

// Basic Route
app.get('/authentication', (req: Request, res: Response) => {
  res.send('Welcome to my TypeScript authentication API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/authentication`);
});

app.use('/register', registerRoute);
app.use('/login', loginRoute);
app.use('/logout', logoutRoute);
app.use('/token', tokenRoute);
