'use strict';
const { checkFavoriteProducts } = require('../../products/services/products')
const { sanitizeEntity } = require('strapi-utils');



module.exports = {
    async find(ctx) {
        let a
        let aa
        let aaa
        let entities;
        let obj1 = {}
        let obj2 = {}
        let result = []
        entities = await strapi.services['four-products'].find(ctx.query);
        let ent = entities.map(entity => sanitizeEntity(entity, { model: strapi.models['four-products'] }));

        if (ent[1] !== undefined) {
            let parf = ent[1]?.parfums.map((el) => strapi.services.products.find({ id: el.productId }))
            let inter = ent[1]?.interieurs.map((el) => strapi.services.products.find({ id: el.productId }))
            let beaut = ent[1]?.beauties.map((el) => strapi.services.products.find({ id: el.productId }))
            if (parf.length) {
                a = await Promise.all(parf)
                a.map(e => {
                    checkFavoriteProducts(ctx.req.user, e[0])
                })
            }
            if (inter.length) {
                aa = await Promise.all(inter)
                aa.map(e => {
                    checkFavoriteProducts(ctx.req.user, e[0])
                })
            }
            if (beaut.length) {
                aaa = await Promise.all(beaut)
                aaa.map(e => {
                    checkFavoriteProducts(ctx.req.user, e[0])
                })
            }
            Object.assign(obj1, { parfum: a })
            Object.assign(obj1, { interieur: aa })
            Object.assign(obj1, { beauties: aaa })
            Object.assign(obj1, { position: ent[1].position })
            result.push(obj1)
        }

        // ..............................................

        if (ent[0] !== undefined) {
            let parf = ent[0]?.parfums.map((el) => strapi.services.products.find({ id: el.productId }))
            let inter = ent[0]?.interieurs.map((el) => strapi.services.products.find({ id: el.productId }))
            let beaut = ent[0]?.beauties.map((el) => strapi.services.products.find({ id: el.productId }))
            if (parf.length) {
                a = await Promise.all(parf)
                a.map(e => {
                    checkFavoriteProducts(ctx.req.user, e[0])
                })
            }
            if (inter.length) {
                aa = await Promise.all(inter)
                aa.map(e => {
                    checkFavoriteProducts(ctx.req.user, e[0])
                })
            }
            if (beaut.length) {
                aaa = await Promise.all(beaut)
                aaa.map(e => {
                    checkFavoriteProducts(ctx.req.user, e[0])
                })
            }
            Object.assign(obj2, { parfum: a })
            Object.assign(obj2, { interieur: aa })
            Object.assign(obj2, { beauties: aaa })
            Object.assign(obj2, { position: ent[0].position })
            result.push(obj2)
        }
        return result
    }
};
