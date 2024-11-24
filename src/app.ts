import express, { Express } from 'express';
import routes from './routes';
import statusError from './errorHandlers/statusError';
import cors from 'cors';

const app: Express = express();

app.use(cors());
app.use(express.json());

Object.entries(routes).forEach(([route, handlers]) => {
	if (route === 'root') route = '';
	app.use(`/api/${route}`, handlers);
});

app.use(statusError as any); // eslint-disable-line

export default app;
