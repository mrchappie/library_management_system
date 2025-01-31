require('dotenv').config();
import express, { Request, Response } from 'express';
import booksRoute from './routes/books/books';
import borrowBooksRoute from './routes/borrow/borrow';
import returnBooksRoute from './routes/return/return';
import overdueBooksRoute from './routes/overdue/overdue';
import clientsRoute from './routes/clients/clients';
import cookies from 'cookie-parser';
import cors from 'cors';

const app = express();
const port = 3001;

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
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to my Library Management System API!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

app.use('/api/books', booksRoute);
app.use('/api/borrow_book', borrowBooksRoute);
app.use('/api/return_book', returnBooksRoute);
app.use('/api/overdue_books', overdueBooksRoute);
app.use('/api/clients', clientsRoute);
