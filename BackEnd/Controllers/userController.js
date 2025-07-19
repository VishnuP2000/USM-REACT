const Users = require("../Models/userModel");
const jwt = require("jsonwebtoken");
const signUp = async (req, res) => {
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
      res.json({ message: "these data are already exist" });
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

              const accessToken = jwt.sign(
  { userId: savedUser._id ,role:"user" },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { userId: userData._id,role:"user" },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: "7d" }
);

  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // use in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
      res
        .status(201)
        .json({ message: "success", token: accessToken, user: savedUser });
    }
  } catch (error) {
    console.log("it is controller error", error);
  }
};

const signIn = async (req, res) => {
  try {
    console.log("it is backend signIn");
    const { email, password } = req.body;
    console.log("email", email);

    const userData = await Users.findOne({ email: email });
    console.log("userData", userData);

    if (userData) {
      console.log("it is matching");
      if (userData.password == password) {
        console.log("password is matching");
        // const token = jwt.sign(
        //   { userId: userData._id, role: "user" },
        //   process.env.JSON_WEB_TOKEN,
        //   { expiresIn: "1h" }
        // );

        const accessToken = jwt.sign(
  { userId: userData._id ,role:"user" },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { userId: userData._id,role:"user" },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: "7d" }
);

  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // use in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

        res
          .status(201)
          .json({ message: "success", accessToken, userData });
      } else {
        console.log("password is not match");

        res.status(400).json({ message: "password error" });
      }
    } else {
      console.log("it is not matching");
      res.status(400).json({ message: "failure" });
    }
  } catch (error) {
    console.log("it is signIn backend error", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const editData = async (req, res) => {
  try {
    console.log("it is editDAta");
    console.log("req.body", req.body);
    const {
      name,
      email,
      contactNumber,
      location,
      image,
      password,
      confirmPassword,
      prvEmail,
      id,
    } = req.body;
    console.log(
      "name,email,phone,location,image",
      name,
      email,
      contactNumber,
      location,
      image,
      prvEmail
    );

    console.log("prvEmail", prvEmail);
    const userData = await Users.findOne({ email: prvEmail });
    console.log("userDAtaaaaaaaaa", userData);

    if (userData) {
      console.log("enter userData");

      const updatedUser = await Users.findByIdAndUpdate(
        { _id: id }, // Find the user by email
        {
          name: name,
          contactNumber: contactNumber,
          location: location,
          password: password,
          confirmPassword: confirmPassword,
          image: image,
          email: email,
        },
        { new: true } // Return the updated document
      );
      console.log("updatedUser", updatedUser);
            const accessToken = jwt.sign(
  { userId: updatedUser._id ,role:"user" },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: "15m" }
);

const refreshToken = jwt.sign(
  { userId: updatedUser._id,role:"user" },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: "7d" }
);

  res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true, // use in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
      res
        .status(201)
        .json({ message: "success", accessToken,updatedUser });
    }
  } catch (error) {
    console.log("it is editData error", error);
  }
};




const refreshToken = (req, res) => {
  console.log('it is refreshToken in userController')
  // ✅ FIX:
const token = req.cookies.refreshToken;
console.log('it is refreshToken on cookies',token)

  if (!token) return res.status(401).json({ message: "Refresh token required" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    console.log('it is decoded of refreshtoken in backend')
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};


module.exports = {
  signUp,
  signIn,
  editData,
  refreshToken
};
