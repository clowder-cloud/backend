import { Router } from 'express';
import * as controller from '../controllers/users';
import usernameAuth from '../middleware/usernameAuth';

const users: Router = Router();

users.get('/:id/devices', controller.getDevices);
users.get('/:id/cats', controller.getCats);
users.get('/settings', usernameAuth, controller.getUser);
users.patch('/settings', usernameAuth, controller.updateUser);
users.post('/create', controller.createUser);

export default users;
