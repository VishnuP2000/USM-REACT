
const Users=require('../Models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')

const Login=(req,res)=>{
try {
    console.log('it is adminController Dashbord')
    console.log('req.body',req.body)
    const {email,password}=req.body

    if(email==process.env.EMAIL && password==process.env.PASSWORD){
        console.log('succesfully match Admin Dashboard')

        const adminAccessToken=jwt.sign({userId:23,role:'admin'},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        const adminRefreshToken=jwt.sign({userId:23,role:'admin'},process.env.ADMIN_REFRESH_TOKEN_SECRET,{expiresIn:'7d'})
        console.log('adminAccessToken',adminAccessToken)
        console.log('adminRefreshToken',adminRefreshToken)
        
        res.cookie('adminRefreshToken',adminRefreshToken,{
          httpOnly: true,
          secure: true, // use in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })
        console.log('add admin Refresh token on the cookies ')

        // const token=jwt.sign({userId:23,role:'admin'},process.env.JSON_WEB_TOKEN,{expiresIn:'1h'})
       res.status(201).json({token:adminAccessToken,user:req.body,message:'success'})

                      
    }else{
        console.log('it is not match email and password')
         res.status(201).json({message:'failure'})
    }
} catch (error) {
    console.log('it is Dashboard error',error)
}
}

const getUsers=async(req,res)=>{
try {
    console.log('it is getUsers')
    const findUsers=await Users.find({})
  
    console.log('findUsers',findUsers)
    
            const adminAccessToken=jwt.sign({role:'admin'},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        const adminRefreshToken=jwt.sign({role:'admin'},process.env.ADMIN_REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

             res.cookie('adminRefreshToken',adminRefreshToken,{
          httpOnly: true,
          secure: true, // use in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

console.log('add adminRefreshCookies on the cookies')
    res.status(200).json({token:adminAccessToken,user:findUsers,message:'succesfully'})
       
} catch (error) {
    console.log('it is getuser error',error)
}
}

const editUsers = async (req, res) => {
  try {
    console.log('it is edituserrrrrrrrs')
    const id = req.query.id;
    const data = req.body;
    console.log('id',id)
    console.log('data',data)

    const updatedUser = await Users.findByIdAndUpdate(id, data, { new: true });

                const adminAccessToken=jwt.sign({role:'admin'},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        const adminRefreshToken=jwt.sign({role:'admin'},process.env.ADMIN_REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

                res.cookie('adminRefreshToken',adminRefreshToken,{
          httpOnly: true,
          secure: true, // use in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

    // const token=jwt.sign({role:'admin'},process.env.JSON_WEB_TOKEN,{expiresIn:'1h'})
    res.status(200).json({ message: 'successfully',token:adminAccessToken , user: updatedUser });

  } catch (error) {
    console.log('Error in edit user', error);
    res.status(500).json({ message: 'Error updating user' });
  }
};

const deleteUser = async (req, res) => {
  try {
    console.log('it si deleteUser')
    const userId = req.params.id;
    console.log('userId',userId)
    await Users.findByIdAndDelete(userId);
    res.status(200).json({ message: 'User deleted successfully' });


  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

const AddUser=async(req,res)=>{
  try {
    console.log("it is signUp in userController");
    console.log("req.body", req.body);

    const {
      name,
      email,
      location,
      password,
      contactNumber,
      confirmPassword,
      image,
    } = req.body;
    console.log(
      "req.body",
      name,
      email,
      location,
      password,
      confirmPassword,
      image
    );

    const hashedPassword=await bcrypt.hash(password,10)
    const validData = await Users.find({ email: email });
    console.log("validData", validData);
    if (validData > 0) {
      console.log("it is already exist");
      res.json({ message: "exist" });
    } else {
      const newUser = new Users({
        name: name,
        email: email,
        contactNumber: contactNumber,
        location: location,
        password: hashedPassword,
        confirmPassword: confirmPassword,
        image: image,
      });
      const savedUser = await newUser.save();
      console.log("it is savedUser", savedUser);


                      const adminAccessToken=jwt.sign({role:'admin'},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        const adminRefreshToken=jwt.sign({role:'admin'},process.env.ADMIN_REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

                res.cookie('adminRefreshToken',adminRefreshToken,{
          httpOnly: true,
          secure: true, // use in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

 
      res
        .status(201)
        .json({ message: "success", token: adminAccessToken, user: savedUser });
    }
  } catch (error) {
    console.log("it is controller error", error);
  }
}


const adminRefreshToken = (req, res) => {
  console.log('it is adminRefreshToken in userController')

const token = req.cookies.adminRefreshToken;
console.log('it is refreshToken on cookies',token)

  if (!token) return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_REFRESH_TOKEN_SECRET);
    console.log('it is decoded of refreshtoken in backend')
    if(decoded){
      const adminAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ADMIN_ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ adminAccessToken });
    }
  } catch (error) {
    console.log('it is adminRefreshToken',error)
    res.status(403).json({ message: "Invalid adminRefreshToken" });
  }
};

const searchUsers=async(req,res)=>{
  try {
    console.log('it is enter the search users on the adminController')
 const search = req.query.search || "";
 console.log('search',search)
 const searchUsers=await Users.find({
   $or: [
        { name: { $regex: `^${search}`, $options: "i" } },
        { email: { $regex: `^${search}`, $options: "i" } }
      ]
 })
 console.log('get searchusers data',searchUsers)

   const adminAccessToken=jwt.sign({role:'admin'},process.env.ADMIN_ACCESS_TOKEN_SECRET,{expiresIn:'15m'})
        const adminRefreshToken=jwt.sign({role:'admin'},process.env.ADMIN_REFRESH_TOKEN_SECRET,{expiresIn:'7d'})

                res.cookie('adminRefreshToken',adminRefreshToken,{
          httpOnly: true,
          secure: true, // use in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        })

 
      res
        .status(201)
        .json({ message: "success", token: adminAccessToken, user: searchUsers });

  } catch (error) {
    console.log('it is searchUsers',error)
  }
}

module.exports={
    Login,
    getUsers,
    editUsers,
    deleteUser,
    AddUser,
    adminRefreshToken,
    searchUsers

}