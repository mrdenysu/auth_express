const Router = require("express").Router;
const controller = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = Router();

router.post("/reg", controller.reg);

router.post("/login", controller.login);

router.get(
  "/users",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  controller.getUsers
);

router.get("/exit", authMiddleware, controller.exit);

module.exports = router;
