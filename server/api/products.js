const router = require('express').Router()
const {Product} = require('../db/models')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.findAll()
    res.json(products)
  } catch (err) {
    next(err)
  }
})

router.get('/:productId', (req, res, next) => {
  Product.findByPk(req.params.productId)
    .then(product => res.json(product))
    .catch(next)
})
