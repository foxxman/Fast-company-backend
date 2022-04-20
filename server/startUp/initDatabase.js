//подключаем модели
const Profession = require('../models/Profession')
const Quality = require('../models/Quality')

const professionsMock = require('../mock/professions.json')
const qualitiesMock = require('../mock/qualities.json')

const createInitialEntity = async (Model,data)=>{
    //чистим коллекцию от данных
    Model.collection.drop()

    return Promise.all(
        //составляем массив промисов
        data.map(async item=>{
            try{
                //удаляем id, чтобы не записывался в БД
                delete item._id;

                const newItem = new Model(item)
                //сохраняем элемент в коллекцию
                await newItem.save()

                return newItem
            }catch (e) {
                return e
            }
        })
    )
}

module.exports = async()=> {
    //ищем в БД что-то, относ. к профессиям
    // получаем набор профессий
    const professions = await Profession.find()
    const qualities = await Quality.find()

    if(professions.length !== professionsMock.length) {
        //заносим mock-данные в базу
        await createInitialEntity(Profession,professionsMock)
    }

    if(qualities.length !== qualitiesMock.length) {
        //заносим mock-данные в базу
        await createInitialEntity(Quality,qualitiesMock)
    }
}