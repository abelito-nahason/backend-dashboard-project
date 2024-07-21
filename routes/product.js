const router = require('express').Router()
const Product = require('../models/Product')
const verifyAuth = require('../middleware/verifyAuth')
const convertDateString = require('../util/convertDateString')

router.post('/product', verifyAuth, async (req,res) => {
    try {
        const {
            productName,
            productPrice,
            productVendor = ''
        } = req.body

        if(!productName || !productPrice) return res.status(400).json({message: "Missing required fields", success :false})
        if(isNaN(productPrice)) return res.status(400).json({message: "Price is not a number", success: false})

        const productExists = await Product.findOne({productName})
        if(productExists) return res.status(400).json({message:"Product already exists!"})
        
        let product = new Product({
            productName,
            productPrice : Number(productPrice),
            productVendor
        })

        await product.save()

        return res.status(200).json({message: "Product save is successful", success: true})

    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false})
    }
})

router.get('/product', verifyAuth, async (req,res) => {
    try {
        const {
            pageSize = 10,
            pageNumber = 1,
            productName = '',
            productVendor = ''
        } = req.query

        const offset = (pageNumber - 1) * pageSize
        const totalProducts = await Product.countDocuments({productName : {$regex: productName, $options: 'i'}, 
                                                            productVendor: {$regex: productVendor, $options: 'i'}})

        const products = await Product.find({productName : {$regex: productName, $options: 'i'}, 
                                             productVendor: {$regex: productVendor, $options: 'i'}}).sort({created_at: -1}).skip(offset).limit(pageSize)

        return res.status(200).json({ 
            results: products.map((product) => ({
                id: product._id,
                productName: product.productName,
                productVendor: product.productVendor,
                productPrice: product.productPrice,
                created_at : convertDateString(product.created_at), 
                updated_at : product.updated_at ? convertDateString(product.updated_at) : "-"
            })),
            totalRows: totalProducts || 0
        })


    } catch (error) {
        console.log(error)
        return res.status(400).json({success:false})
    }
})

router.put('/product', verifyAuth, async (req,res) => {

    try {
        const {
            productId,
            productName,
            productVendor,
            productPrice = 0
        } = req.body
        
        if(!productId || !productName) return res.status(400).json({message:"Missing required fields"})

        // dont use .save() to update, use .updateOne() instead
        let date = new Date()
        date = date.toISOString().split('T')[0]
    
        await Product.updateOne({_id: productId}, {
            productName,
            productVendor,
            productPrice: Number(productPrice),
            updated_at: date
        })

        return res.status(200).json({message: "Product update successful"})

    } catch (error) {
        console.log(error)
        return res.status(400).json({success: false})
    }
})

router.post('/deleteProduct', verifyAuth, async (req,res) => {
    try {
        const {
            productId
        } = req.body

        if(!productId) return res.status(400).json({message:"Missing required fields"})
        await Product.deleteOne({_id: productId})
        return res.status(200).json({message: "Product successfully deleted"})

    } catch (error) {
        console.log(error)
        return res.status(400).json({success: false})
    }
})


module.exports = router