const jwt = require("jsonwebtoken");
const { secret } = require("../config");

/**
 *
 * @param {Array} roles
 */
module.exports = function (roles) {
  /**
   * Проверка авторизации и выдача прав
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  return function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    } else {
      try {
        const token = req.session.token;
        if (!token) {
          return res
            .status(403)
            .json({ message: "Пользователь не авторизован" });
        }
        const { roles: userRoles } = jwt.verify(token, secret);
        let hasRole = false;
        roles.forEach((role) => {
          if (userRoles.includes(role)) {
            hasRole = true;
          }
        });
        if (!hasRole) {
          return res.status(403).json({ message: "У вас нет доступа" });
        }
        next();
      } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Ошибка чтения токина" });
      }
    }
  };
};
