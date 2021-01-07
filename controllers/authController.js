const User = require("../models/User");
const Role = require("../models/Role");
const jwt = require("jsonwebtoken");
const { secret } = require("../config");

function generateAccessToken(id, roles) {
  const payload = {
    id,
    roles,
  };
  return jwt.sign(payload, secret, {
    expiresIn: "24h",
  });
}

class authController {
  /**
   * Регистрация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async reg(req, res) {
    try {
      const { phone, name } = req.body;
      // Есть ли в бд
      let condidate = await User.findOne({ phone });
      if (condidate) {
        return res
          .status(400)
          .json({ message: "Error: Пользователь с таким именем уже есть" });
      } else {
        const userRole = await Role.findOne({ value: "USER" });
        const user = new User({ phone, name, roles: [userRole.value] });
        await user.save();
        return res.json({ message: "Пользователь создан", user });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error: reg" });
    }
  }

  /**
   * Авторизация
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async login(req, res) {
    try {
      const { phone } = req.body;
      const user = await User.findOne({ phone });
      if (!user) {
        return res
          .status(400)
          .json({ message: `Error: User: ${phone} can't be find` });
      } else {
        // Проверка кода смс (тут ее нетути сори)
        // Если ок то даём автаризацию
        const token = generateAccessToken(user._id, user.roles);
        req.session.token = token;
        return res.json({ token });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error: login" });
    }
  }

  /**
   * Все пользователи
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error: getUsers" });
    }
  }

  /**
   * Выход
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  async exit(req, res) {
    try {
      req.session = null;
      res.redirect("/");
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: "Error: exit" });
    }
  }
}

module.exports = new authController();
