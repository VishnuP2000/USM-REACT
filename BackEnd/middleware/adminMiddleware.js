const jwt = require('jsonwebtoken');

const adminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log('it is adminMidlewre')

    if (!token) {
      console.log("Authorization is not found!!");
      res.status(401).json({ message: 'Authorization is not found!!' });
      return;
    }

    if (!process.env.JSON_WEB_TOKEN) {
      throw new Error("ACCESS_TOKEN_SECRET is not defined in the environment variables.");
    }

    const decode = jwt.verify(token, process.env.JSON_WEB_TOKEN);

    if (!decode) {
      console.log('Unauthorized access denied!!');
      res.status(401).json({ message: 'Unauthorized access denied!!' });
      return;
    }

    // You can attach decoded user info to request if needed:
    // req.user = decode;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Internal server error!!' });
    return;
  }
};

module.exports = adminMiddleware;
