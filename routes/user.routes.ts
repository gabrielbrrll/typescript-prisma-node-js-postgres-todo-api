import { Router } from 'express';

import validate from '../middleware/validate';
import authValidation from '../validations/auth.validation';
import * as userController from '../controllers/user.controller';
import authenticateJwt from '../middleware/auth';

const router = Router();

router.get('/', authenticateJwt, userController.getAllUsers);

router.post('/signup', validate(authValidation.register), userController.signup);
router.post('/login', validate(authValidation.login), userController.login);

export default router;
