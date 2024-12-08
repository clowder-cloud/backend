import { Router } from 'express';
import { endpoints } from '../controllers/root';

const root: Router = Router();

root.get('/', endpoints);

export default root;
