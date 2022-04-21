const express = require("express");
const User = require("../models/User");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth.middleware");

router.patch("/:userId", async (req, res) => {
  try {
    // todo: current user id = user id
    const { userId } = req.params;
    // req.user._id устанавливаем в auth middleware
    // после верификации токена
    if (userId === req.user._id) {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        //updatedUser получим только после обновления на БД
        new: true,
      });
      res.send(updatedUser);
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({
      message: "На сервере произошла неизвестная ошибка, попробуйте позже.",
    });
  }
});

// auth - middleware для проверки авторизации
router.get("/", auth, async (req, res) => {
  try {
    const list = await User.find();
    // при успешном завершении статус можно не указывать
    res.send(list);
  } catch (error) {
    res.status(500).json({
      message: "На сервере произошла неизвестная ошибка, попробуйте позже.",
    });
  }
});

module.exports = router;
