const express = require("express");
const Profession = require("../models/Profession");
const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    //    получение всех профессий из БД
    const list = await Profession.find();
    //    возврщаем на клиент
    res.status(200).send(list);
  } catch (e) {
    res.status(500).json({
      message: "На сервере произошла неизвестная ошибка, попробуйте позже.",
    });
  }
});

module.exports = router;
