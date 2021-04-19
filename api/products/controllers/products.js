'use strict';

const { checkFavoriteProducts } = require('../services/products')
const { sanitizeEntity } = require('strapi-utils');
// const { deleteUnnecessaryKeyInObject } = require('../services/products')



const _ = require('lodash');

module.exports = {
    /**
     * Retrieve a record.
     *
     * @return {Object}
     * 
     */

    async find(ctx) {
        let entities;
        if (ctx.query._q) {
            entities = await strapi.services.products.search(ctx.query);
        } else {
            entities = await strapi.services.products.find(ctx.query);
        }
        entities = entities.map(entity => sanitizeEntity(entity, { model: strapi.models.products }));
        return (checkFavoriteProducts(ctx.req.user, entities))

    },

    async findByLimit(ctx) {
        let result = []
        let { limit } = ctx.params
        let { quantity } = ctx.params
        let products = await strapi.services.products.find();
        products = products.map(product => sanitizeEntity(product, { model: strapi.models.products }))
        for (let i = 0; i < quantity; i++) {
            result.push(_.sampleSize(products, limit))
        }
        return result
    },


    async findOne(ctx) {
        const { id } = ctx.params;
        let entity = await strapi.services.products.findOne({ id });
        let product = await checkFavoriteProducts(ctx.req.user, [sanitizeEntity(entity, { model: strapi.models.products })])
        return product[0]
    },



    async findSubCategoryProducts(ctx) {
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('sub_category', `${id}`)
            .select('products.id');
            const ps = products.map((el) => {
                let entity = strapi.services.products.findOne({ id: el.id })
                return entity
            })
            let res = await Promise.all(ps)
            res.map((el) => {
                delete el?.created_by
                delete el?.updated_by
                delete el?.category
                delete el?.menu_item
                delete el?.sub_category
            })
            return (checkFavoriteProducts(ctx.req.user, res))


    },


    async findCategoryProducts(ctx) {
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('category', `${id}`)
            .select('products.id');
        const ps = products.map((el) => {
            let entity = strapi.services.products.findOne({ id: el.id })
            return entity
        })
        let res = await Promise.all(ps)
        res.map((el) => {
            delete el?.created_by
            delete el?.updated_by
            delete el?.category
            delete el?.menu_item
            delete el?.sub_category
        })
        return (checkFavoriteProducts(ctx.req.user, res))
    },
    async findTypetests(ctx) {
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('products.id', `${id}`)
            .join('type_tests', 'type_tests.id', 'products.type_test')
            .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'products.id')
            .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
            .select('type_tests.id', 'type_tests.brand', 'type_tests.price', 'type_tests.size', 'upload_file.url as image_url')
        function getUniqueListBy(arr) {
            return [...new Map(arr.map(item => [item['id'], item])).values()]
        }
        return getUniqueListBy(products)
    },
    async findMenuItemProducts(ctx) {
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('menu_item', `${id}`)
            .select('products.id');
            const ps = products.map((el) => {
                let entity = strapi.services.products.findOne({ id: el.id })
                return entity
            })
            let res = await Promise.all(ps)
            res.map((el) => {
                delete el?.created_by
                delete el?.updated_by
                delete el?.category
                delete el?.menu_item
                delete el?.sub_category
            })
            return (checkFavoriteProducts(ctx.req.user, res))

    },
    async getAllNewProducts(ctx) {
        // http://localhost:1337/products?New_Date_Limit_gt=2025-01-11T14:11:43.705Z
        let newProduct = []
        let entity
        let now = new Date();
        if (ctx.query._q) {
            entity = await strapi.services.products.search(ctx.query);
        } else {
            entity = await strapi.services.products.find(ctx.query);
        }
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        entity.map((el) => {
            if (el.New_Date_Limit !== null && (now.toLocaleDateString("en-US", options) <= Date(el.New_Date_Limit)))
                newProduct.push(el)
        })
        return checkFavoriteProducts(ctx.req.user, newProduct)

    }

};