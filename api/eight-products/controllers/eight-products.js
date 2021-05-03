'use strict';
const { checkFavoriteProducts } = require('../../products/services/products')
const { sanitizeEntity } = require('strapi-utils');



module.exports = {
    async find(ctx) {
        let result = {}
        let page = ctx.params.page
        let entity = await strapi.services["eight-products"].find({ position: page })
       if (entity.length === 0) return {message:"Position Not Found" , success:false}
        entity = entity.map(product => sanitizeEntity(product, { model: strapi.models["eight-products"] }))
        let parf = entity[0]?.parfums.map((el) => strapi.services.products.find({ id: el.productId }))
        let inter = entity[0]?.interieurs.map((el) => strapi.services.products.find({ id: el.productId }))
        let beaut = entity[0]?.beauties.map((el) => strapi.services.products.find({ id: el.productId }))
        if (parf.length) {
            let p = await Promise.all(parf)
            p.map(e => {
                checkFavoriteProducts(ctx.req.user, e[0])
            })
            p = p.map(product => sanitizeEntity(product[0], { model: strapi.models.products }))
            result.parfums = p
        }
        if (inter.length) {
            let p = await Promise.all(inter)
            p.map(e => {
                checkFavoriteProducts(ctx.req.user, e[0])
            })
            p = p.map(product => sanitizeEntity(product[0], { model: strapi.models.products }))
            result.interieurs = p
        }
        if (beaut.length) {
            let p = await Promise.all(beaut)
            p.map(e => {
                checkFavoriteProducts(ctx.req.user, e[0])
            })
            p = p.map(product => sanitizeEntity(product[0], { model: strapi.models.products }))
            result.beauties = p
        }
        return result
    }
}
