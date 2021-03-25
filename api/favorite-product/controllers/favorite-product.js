'use strict';
const  {checkFavoriteProducts} = require('../../products/services/products')


module.exports = {

    async findOne(ctx) {
        let favoritData = {
            users_permissions_user: ctx.req.user.id
        }
        let entity = await strapi.services['favorite-product'].find(favoritData)
        let favoritProduct = []
        entity.map((e) => { if (e.product) favoritProduct.push(e.product) })
        return (checkFavoriteProducts(ctx.req.user,favoritProduct))
    },

    async create(ctx) {
       
        let favoritData = {
            users_permissions_user: ctx.req.user.id,
            product: ctx.request.body.product
        }
        let entity = await strapi.services['favorite-product'].find(favoritData)
        let exist = await strapi.services.products.find({ id: ctx.request.body.product })
        if ((entity.length === 0) && (exist.length !== 0)) {
            await strapi.services['favorite-product'].create(favoritData)
            return ({ isFavorite: true })
        }
        else if ((exist.length !== 0)) {
            await strapi.services['favorite-product'].delete(favoritData)
            return ({ isFavorite: false })
        } else
            return ({ message: 'product doesnt exist' })
    }


};
