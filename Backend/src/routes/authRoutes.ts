import { Router } from 'express';
import { register, login, getAllUsers } from '../controllers/authController';
import { checkAdmin } from '../middlewares/authMiddleware';

const authRouter = Router();


authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.get('/getUsers',checkAdmin, getAllUsers);

export default authRouter;
