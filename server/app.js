const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const chalk = require("chalk");
const cors = require("cors");
const initDatabase = require("./startUp/initDatabase");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// хуй знает зачем, ошибка без этого
app.use(cors());
//добавляем роуты
app.use("/api", routes);

const PORT = config.get("port") ?? 8080;

// if(process.env.NODE_ENV === 'production'){
//     console.log('production');
// }else{
//     console.log('development');
// }

async function start() {
  try {
    //вешаем слушатель, выполнится единожды при открытии соединения
    // on - каждый раз
    mongoose.connection.once("open", () => {
      initDatabase();
    });
    //подключаемся к MongoDB
    await mongoose.connect(config.get("mongoUri"));
    console.log(chalk.green(`MongoDB connected`));

    app.listen(PORT, () => {
      console.log(chalk.green(`Server has been started on port ${PORT}...`));
    });
  } catch (e) {
    console.log(chalk.red(e.message));
    process.exit(1);
  }
}

start();
