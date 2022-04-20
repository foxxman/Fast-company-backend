const {Schema, model} = require('mongoose')

//схема - описание модели
const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true}
}, {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: true
})

module.exports =model("Token", schema)