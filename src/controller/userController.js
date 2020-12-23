import { userModel } from '../model/userModel';
import responseHelper from '../helper/responseHelper';
import messageParser from '../helper/messageParser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
let objectId = mongoose.Types.ObjectId;

/**
 * CREATE USER
 * POST http://localhost:1858/signUp

 // Parent schema
 {
    "userNmae": "Harish",
    "salary": 50000,
 }

 // Child Schema
 // Below record is the child of Harish's record
 {
    "userNmae": "rashmi",
    "parentId" : "here pass harish's objectId",
    "salary": 50000,
 }

*/
exports.signUp = async (req, res, next) => {
    try {
        let { userName, parentId, salary, addedDate = new Date().toUTCString() } = req.body;
        let requestData = new userModel({ userName, parentId, salary, addedDate });
        let userData = await userModel.create(requestData);
        if (userData) {
            res.json(responseHelper.successResponse(200, messageParser.alertMessage['users'].createSuccess, userData));
        } else {
            res.json(responseHelper.errorResponse(401, messageParser.alertMessage['users'].createError, {}));
        }

    } catch (error) {
        res.json(responseHelper.errorResponse(401, messageParser.alertMessage['users'].createError, error.stack));
    }
};


/**
 * GET ALL USERS
 * GET http://localhost:1858/api/user
 */
exports.listUser = async (req, res, next) => {
    try {
        let usersData = await userModel.aggregate([{ $match: { $and: [{ isDeleted: false }] } }]);
        (usersData) ? res.json(responseHelper.successResponse(200, messageParser.alertMessage['users'].listSuccess, usersData)) : res.json(responseHelper.errorResponse(401, messageParser.alertMessage['users'].listError, []));
    } catch (error) {
        res.json(responseHelper.errorResponse(401, messageParser.alertMessage['users'].listError, error.stack));
    }
};

/**
* GET Group Salary 
* http://localhost:1858/getGroupSalaryByParentId?parentId=5fe2ef9c4ceda927fce202f9
 */
exports.getGroupSalaryByParentId = async (req, res, next) => {
    let parentId = req.query.parentId;
    if (parentId) {
        if (parentId) {
            let userData = await userModel.find({ parentId: objectId(parentId) });
            var totalSalary = 0;
            var userList = [];
            for (let u of userData) {
                userList.push(u);
                totalSalary = totalSalary + u.salary;
                var user = await userModel.find({ parentId: u._id })
                if (user.length > 0) {
                    for (let u1 of user) {
                        var users = await userModel.find({ parentId: u1._id });
                        totalSalary = totalSalary + u1.salary;
                        userList.push(u1);
                        for (let m of users) {
                            totalSalary = totalSalary + m.salary;
                            userList.push(m);
                        }
                    }
                }
            }
            let result = {
                "users": userList,
                "totalSalary": totalSalary
            }
            res.json(result);
        }
        else {
            res.json("Please pass valid parentid")
        }
    }
    else {
        res.json("Please pass parentid")
    }
}

/**
 * GET Percentage from parent salary
 * http://localhost:1858/getGroupSalaryByParentIdPercentageWise?parentId=5fe2ef9c4ceda927fce202f9
 */

exports.getGroupSalaryByParentIdPercentageWise = async (req, res, next) => {
    let parentId = req.query.parentId;
    if (parentId) {
        if (parentId) {
            let parentUserData = await userModel.findOne({ _id: objectId(parentId) });
            let firstParent = parentUserData.salary * 5 / 100;
            let secondParent = parentUserData.salary * 4 / 100;
            let thirdParent = parentUserData.salary * 3 / 100;
            let userData = await userModel.find({ parentId: objectId(parentId) });
            var totalSalary = 0;
            var userList = [];
            for (let u of userData) {
                totalSalary = totalSalary + u.salary + firstParent;
                userList.push({
                    "parentId": u.parentId,
                    "isDeleted": u.isDeleted,
                    "_id": u._id,
                    "userName": u.userName,
                    "salary": u.salary,
                    "percentage Salary": firstParent,
                    "total extra Salary": u.salary + firstParent
                });
                var user = await userModel.find({ parentId: u._id })
                if (user.length > 0) {
                    for (let u1 of user) {
                        var users = await userModel.find({ parentId: u1._id });
                        totalSalary = totalSalary + u1.salary + secondParent;
                        userList.push({
                            "parentId": u1.parentId,
                            "isDeleted": u1.isDeleted,
                            "_id": u1._id,
                            "userName": u1.userName,
                            "salary": u1.salary,
                            "percentage Salary": secondParent,
                            "total extra Salary": u1.salary + secondParent
                        });
                        for (let m of users) {
                            totalSalary = totalSalary + m.salary + thirdParent;
                            userList.push({
                                "parentId": m.parentId,
                                "isDeleted": m.isDeleted,
                                "_id": m._id,
                                "userName": m.userName,
                                "salary": m.salary,
                                "percentage Salary": thirdParent,
                                "total extra Salary": m.salary + thirdParent
                            });
                        }
                    }
                }
            }
            let result = {
                "users": userList,
                "totalSalary": totalSalary
            }
            res.json(result);
        }
        else {
            res.json("Please pass valid parentid")
        }
    }
    else {
        res.json("Please pass parentid")
    }
};
