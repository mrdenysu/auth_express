const jwt = require("jsonwebtoken");
const { secret } = require("../config");

/**
 * Проверка авторизации и выдача прав
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  } else {
    try {
      let token = req.session.token;
      console.log(req.session.token);
      if (!token) {
        return res.status(403).json({ message: "Пользователь не авторизован" });
      }
      const decodedData = jwt.verify(token, secret);
      req.user = decodedData;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
  }
};
