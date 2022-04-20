const {Schema, model} = require('mongoose')

//схема - описание модели
const schema = new Schema({
    name: {type: String},
    email: {type: String, unique:true, required: true},
    password: {type: String},
    completedMeetings: Number,
    image: String,
    //type - id объекта из  ref: Profession
    professions: {type: Schema.Types.ObjectId, ref: 'Profession'},
    //type - id объекта из  ref: Quality
    //оборачиваем в [], т.к. массив
    qualities: [{type: Schema.Types.ObjectId, ref: 'Quality'}],
    rate: Number,
    sex: {type: String, enum:['male','female', "other"]},

}, {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: true
})

module.exports =model("User", schema)