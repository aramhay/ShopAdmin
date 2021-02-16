'use strict';


module.exports = {

    async findOne(ctx) {
        const id = ctx.params.userid
        let entity = await strapi.services['favorite-product'].find({ users_permissions_user: id })
        let favoriteproduct = []
        entity.map((e) => { favoriteproduct.push(e.product) })
        return favoriteproduct
    },

    async create(ctx) {
        let entity = await strapi.services['favorite-product'].find({ users_permissions_user: ctx.request.body.users_permissions_user, product: ctx.request.body.product })
        let exist = await strapi.services.products.find({ id: ctx.request.body.product })
        if ((entity.length === 0) && (exist.length !== 0)) {
            await strapi.services['favorite-product'].create(ctx.request.body)
            return ({ message: "added to favorite products" })
        }
        else if ((exist.length !== 0)) {
            await strapi.services['favorite-product'].delete(ctx.request.body)
            return ({ message: "deleted from favorite products" })
        } else
               return ({ message: 'product doesnt exist' })
    }


};
