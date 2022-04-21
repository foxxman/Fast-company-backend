// проверка аторизации при обновлении информации пользователя

const tokenService = require("../services/token.service");

module.exports = async (req, res, next) => {
  // next - функция, с пом которой можем продолжать дальнейшие запросы
  if (req.method === "OPTIONS") {
    // OPTIONS - системный запрос, обрабатываем отдельно
    // просто продолжаем работу
    return next();
  }

  try {
    //   получим строку
    // Bearer [token]
    // вырезаем только второе слово, token
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized" });
    }
    // верифицируем токен
    const data = await tokenService.validateAccess(token);

    // console.log("TOKEN: ", tokenService.validateAccess(token));

    // ошибка если не верифицированно
    if (!data) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // console.log("decoded", data);

    req.user = data;

    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
