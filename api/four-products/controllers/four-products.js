'use strict';
const { checkFavoriteProducts } = require('../../products/services/products')
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services['four-products'].search(ctx.query);
        } else {
            entities = await strapi.services['four-products'].find(ctx.query);
        }
        let ent = entities.map(entity => sanitizeEntity(entity, { model: strapi.models['four-products'] }));
        for (let i = 0;i<ent.length ; i++){
        await checkFavoriteProducts(ctx.req.user, ent[i].parfums)
        await checkFavoriteProducts(ctx.req.user, ent[i].beauties)
        await checkFavoriteProducts(ctx.req.user, ent[i].interieurs)
        }
        return ent
    }
};
