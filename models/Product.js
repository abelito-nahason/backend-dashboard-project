const mongoose = require('mongoose')

productSchema = new mongoose.Schema({
    productName: {
        type:String,
        required: true,
        unique: true
    },
    productPrice: {
        type:Number,
        required: true
    },
    productVendor: String,
    created_at:Date,
    updated_at:Date,

}, {toJSON: {virtuals: true}, toObject:{virtuals: true}})

productSchema.pre('save', function (next){
    console.log('ananas', this)
    let date = new Date()
    date = date.toISOString().split('T')[0]
    this.created_at = date
    next()
})

module.exports = mongoose.model('product', productSchema)
