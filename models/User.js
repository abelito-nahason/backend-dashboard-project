const mongoose = require ('mongoose')

let userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        index: true
    },
    password: {
        type:String,
        required:true,
        select: false
    },
    created_at: {
        type:Date
    }
}, {toJSON:{virtuals:true}, toObject:{virtuals:true}})

userSchema.pre('save', function (next){
    let date = new Date()
    date = date.toISOString().split('T')[0]
    this.created_at = date
    next()
})

module.exports = mongoose.model('user', userSchema)