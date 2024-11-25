import { Router } from 'express';
import * as controller from '../controllers/cats';
import usernameAuth from '../middleware/usernameAuth';

const cats: Router = Router();

cats.post('/create', usernameAuth, controller.createCat);
cats.post('/update', usernameAuth, controller.updateCat);
cats.get('/leaderboard/:range', controller.getLeaderboardWithRange);

export default cats;
