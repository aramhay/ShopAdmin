'use strict';


const { jwtSecret } = require('../../../extensions/users-permissions/config/jwt');
const jwt = require('jsonwebtoken');


module.exports = {

    async findOne(ctx) {
        let [bearer, token] = ctx.request.headers.authorization.split(' ')
        let decoded = jwt.verify(token, jwtSecret)
        let favoritData = {
            users_permissions_user: decoded.id
        }
        let entity = await strapi.services['favorite-product'].find(favoritData)
        let favoritProduct = []
        entity.map((e) => { favoritProduct.push(e.product) })
        return favoritProduct
    },

    async create(ctx) {
        let [bearer, token] = ctx.request.headers.authorization.split(' ')
        let decoded =  await jwt.verify(token, jwtSecret)
        let favoritData = {
            users_permissions_user: decoded.id,
            product: ctx.request.body.product
        }
        console.log(favoritData);

        let entity = await strapi.services['favorite-product'].find(favoritData)
        console.log(entity);
        let exist = await strapi.services.products.find({ id: ctx.request.body.product })
        if ((entity.length === 0) && (exist.length !== 0)) {
            await strapi.services['favorite-product'].create(favoritData)
            return ({ message: "added to favorite products" })
        }
        else if ((exist.length !== 0)) {
            await strapi.services['favorite-product'].delete(favoritData)
            return ({ message: "deleted from favorite products" })
        } else
            return ({ message: 'product doesnt exist' })
    }


};
