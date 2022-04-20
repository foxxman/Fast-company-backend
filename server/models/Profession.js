const {Schema, model} = require('mongoose')

//схема - описание модели Professions
const schema = new Schema({
    //название поля
    name:{
        //тип данных
        type: String,
        //обязательно ли оно
        required: true
    }
}, {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: true
})

module.exports =model("Profession", schema)