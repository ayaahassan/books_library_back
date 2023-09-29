import express from 'express';
import cors from 'cors';
import routes from './src/routes/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());

app.use('/api', routes);

// error handler
// app.use((err: any, req: any, res: any, next: any) => {
//   console.log(err.stack);
//   res.status(500).send('Something broke!');
// });

export default app;
