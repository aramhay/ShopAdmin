'use strict';
const { checkFavoriteProducts } = require('../../products/services/products')


module.exports = {

    async findOne(ctx) {
        let favoritData = {
            users_permissions_user: ctx.req.user.id,
        }
        let entity = await strapi.services['favorite-product'].find(favoritData)
        let prod = await strapi.services.products.find({})
        prod.map((el) => {
            checkFavoriteProducts(ctx.req.user, el)
        })
        return (prod)
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
            return ({ isFavorite: true })
        }
        else if ((exist.length !== 0)) {
            await strapi.services['favorite-product'].delete(favoritData)
            return ({ isFavorite: false })
        } else
            return ({ message: 'product doesnt exist x' })
    }


};
