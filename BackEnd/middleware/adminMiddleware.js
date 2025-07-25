const jwt = require('jsonwebtoken');

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log('it is adminMidlewre')

    if (!token) {
      console.log("Authorization is not found!!");
      res.status(403).json({ message: 'Authorization is not found!!' });
      return;
    }

    if (!process.env.ADMIN_ACCESS_TOKEN_SECRET) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables.");
    }
    const tokens = token.split(" ")[1]; 
    const decode = jwt.verify(tokens, process.env.ADMIN_ACCESS_TOKEN_SECRET);

    if (!decode) {
      console.log('Unauthorized access denied!!');
      res.status(403).json({ message: 'Unauthorized access denied!!' });
      return;
    }

    // You can attach decoded user info to request if needed:
    // req.user = decode;

    next();
  } catch (error) {
    console.log('it is middleware catch error',error);
    res.status(403).json({ message: 'Internal server error!!' });
    return;
  }
};

module.exports = adminMiddleware;
