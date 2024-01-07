const express = require('express');
const router = express.Router();
const userController = require('../controller/UsersController')

router.get('/', userController.GetUsers);
router.get('/:userId', userController.GetUserById);
router.post('/GetUsersByEmail', userController.GetUsersByEmailApi);
router.post('/GetUsersByUserName', userController.GetUsersByUserName);
router.post('/Login', userController.Login);
// router.post('/IfExistUserName', userController.IfExistUserName);
router.post('/Register', userController.Register);
// router.get('/:city', userController.GetUserByCity)
// router.post('/CreateUser', userController.CreateUser);
// // router.delete('/DeleteUser/:idUser', userController.DeleteUser)
// router.put('/UpdateUser/:idUser', userController.UpdateUser)
// router.put('/UpdateUserPassword/:idUser',userController.UpdatePasswordUser)
// router.post('/Login', userController.Login)
// router.put('/DeleteUser/:idUser', userController.DeleteUserIsActive)
module.exports = router;