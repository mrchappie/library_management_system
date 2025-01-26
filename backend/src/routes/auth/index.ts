require('dotenv').config();
import express, { Request, Response } from 'express';
import cookies from 'cookie-parser';
import cors from 'cors';

// Routes
import registerRoute from './register';
import loginRoute from './login';
import logoutRoute from './logout';
import tokenRoute from './token';

const app = express();
const port = 3002;

// Middleware to parse JSON
app.use(express.json());
// Middleware to parse cookies
app.use(cookies());
// cors
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);

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
