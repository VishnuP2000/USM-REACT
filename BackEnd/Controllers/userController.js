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

      const token = jwt.sign(
        { userId: savedUser._id, role: "user" },
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
        const token = jwt.sign(
          { userId: userData._id, role: "user" },
          process.env.JSON_WEB_TOKEN,
          { expiresIn: "1h" }
        );
        res
          .status(201)
          .json({ message: "success", token: token, user: userData });
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
      const token = jwt.sign(
        { userId: updatedUser._id, role: "user" },
        process.env.JSON_WEB_TOKEN,
        { expiresIn: "1h" }
      );
      res
        .status(201)
        .json({ message: "success", token: token, user: updatedUser });
    }
  } catch (error) {
    console.log("it is editData error", error);
  }
};

module.exports = {
  signUp,
  signIn,
  editData,
};
