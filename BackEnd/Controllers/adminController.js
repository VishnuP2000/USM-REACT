
const Users=require('../Models/userModel')
const jwt=require('jsonwebtoken')

const Login=(req,res)=>{
try {
    console.log('it is adminController Dashbord')
    console.log('req.body',req.body)
    const {email,password}=req.body

    if(email==process.env.EMAIL && password==process.env.PASSWORD){
        console.log('succesfully match Admin Dashboard')
        const token=jwt.sign({userId:23,role:'admin'},process.env.JSON_WEB_TOKEN,{expiresIn:'1h'})
       res.status(201).json({token:token,user:req.body,message:'success'})

                      
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
    // console.log('findUsers',findUsers)   
    
    const token=jwt.sign({role:'admin'},process.env.JSON_WEB_TOKEN,{expiresIn:'1h'})
    res.status(200).json({token:token,user:findUsers,message:'succesfully'})
       
} catch (error) {
    console.log('it is findUsers error',findUsers)
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
    
    const token=jwt.sign({role:'admin'},process.env.JSON_WEB_TOKEN,{expiresIn:'1h'})
    res.status(200).json({ message: 'User updated successfully',token:token , user: updatedUser });

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
        password: password,
        confirmPassword: confirmPassword,
        image: image,
      });
      const savedUser = await newUser.save();
      console.log("it is savedUser", savedUser);

      const token = jwt.sign(
        { userId: savedUser._id, role: "admin" },
        process.env.JSON_WEB_TOKEN,
        { expiresIn: "1h" }
      );
      res
        .status(201)
        .json({ message: "success", token: token, user: savedUser });
    }
  } catch (error) {
    console.log("it is controller error", error);
  }
}

module.exports={
    Login,
    getUsers,
    editUsers,
    deleteUser,
    AddUser

}