console.log("welcome to adminRoute")

const express=require('express')
const adminRoute=express.Router()
const adminController=require('../Controllers/adminController')
const adminMiddleware=require('../middleware/adminMiddleware')

adminRoute.post('/Login',adminController.Login)
adminRoute.get('/getUsers',adminMiddleware,adminController.getUsers)
adminRoute.put('/editUsers',adminMiddleware,adminController.editUsers)
adminRoute.delete('/deleteUser/:id', adminMiddleware,adminController.deleteUser);
adminRoute.post('/AddUser', adminMiddleware,adminController.AddUser);
adminRoute.get('/searchUsers',adminController.searchUsers);

adminRoute.post('/refresh',adminController.adminRefreshToken);



// app.get('/Dashboard', (req, res) => {
//   res.send('Hello World!');
// });
module.exports=adminRoute

                                                            