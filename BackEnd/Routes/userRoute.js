const expres=require('express')
console.log('it is user Router page')
const userRoute=expres.Router()
const userController=require('../Controllers/userController')
const userMiddleware=require('../middleware/userMiddleware')



userRoute.post('/signUp',userController.signUp)
userRoute.post('/signIn',userController.signIn)
userRoute.post('/editData',userMiddleware,userController.editData)

userRoute.post('/refresh', userController.refreshToken);


module.exports=userRoute