'use strict';
const products = require('../../products/services/products');
const { checkFavoriteProducts } = require('../../products/services/products')
const { sanitizeEntity } = require('strapi-utils');


module.exports = {

    async findOne(ctx) {
        let res = []
        let result
        let prod = await strapi.services['favorite-product'].find({ users_permissions_user: ctx.req.user.id })
        let p = prod.map(product => {
            delete product?.users_permissions_user,
                delete product?.product?.category,
                delete product?.product?.sub_category,
                delete product?.product?.shopping_basket
                Object.assign(product?.product,{variants_of_a_products:[product?.variants_of_a_product ]})
                Object.assign(product?.product?.variants_of_a_products[0],{favorite:true})
                return product?.product
        })

        return await Promise.all(p)

    },



    async create(ctx) {
        let favoritData = {
            users_permissions_user: ctx.req.user.id,
            product: ctx.request.body.product,
            variants_of_a_product: ctx.request.body.variant_id
        }
        let exist = await strapi.services.products.find({ id: favoritData.product })
        if (exist.length < 1) return ({ isFavorite: false, message: 'product doesnt exist' })
        else
            if (exist.length === 1) {
                let i = 0
                exist[0].variants_of_a_products.map((el) => {
                    if (el.id === favoritData.variants_of_a_product) i++
                })
                if (i === 0) return ({ isFavorite: false, message: 'product doesnt exist' })
            }
        let entity = await strapi.services['favorite-product'].find(favoritData)
        if ((entity.length === 0) && (exist.length !== 0)) {
            await strapi.services['favorite-product'].create(favoritData)
            let prod =  await strapi.services.products.find({id: ctx.request.body.product})
            return await checkFavoriteProducts(ctx.req.user,prod[0])
        }
        else if ((exist.length !== 0)) {
            await strapi.services['favorite-product'].delete(favoritData)
            let prod =  await strapi.services.products.find({id: ctx.request.body.product})
            return prod[0]
        } else
            return ({ message: 'product doesnt exist x' })
    }


};
