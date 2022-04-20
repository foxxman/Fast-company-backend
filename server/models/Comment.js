const {Schema, model} = require('mongoose')

//схема - описание модели
const schema = new Schema({
    content: {type: String, required: true},
    //на чьей странице комментарий
    pageId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    //кто оставиил комментарий
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}

}, {
    //доб. 2 св-ва в модель: когда создана и когда обновлена
    timestamps: {createdAt: 'created_at'}
})

module.exports =model("Comment", schema)