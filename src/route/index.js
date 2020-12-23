import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
let router = express.Router();
import * as userController from '../controller/userController';



/**---------------------- | User | ------------------ */
router.post('/signUp', userController.signUp);
router.get('/user', userController.listUser);
router.get('/getGroupSalaryByParentId', userController.getGroupSalaryByParentId);
router.get('/getGroupSalaryByParentIdPercentageWise', userController.getGroupSalaryByParentIdPercentageWise);

module.exports = router;