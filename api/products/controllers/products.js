'use strict';

const { checkFavoriteProducts } = require('../services/products')
const { sanitizeEntity } = require('strapi-utils');
// const { deleteUnnecessaryKeyInObject } = require('../services/products')


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
        // entities = deleteUnnecessaryKeyInObject(entities)
        
        return (checkFavoriteProducts(ctx.req.user, entities))

    },


    async findOne(ctx) {
        const { id } = ctx.params;

        let entity = await strapi.services.products.findOne({ id });
        // entity = deleteUnnecessaryKeyInObject(entity)
        return sanitizeEntity(entity, { model: strapi.models.products });
    },



    async findSubCategoryProducts(ctx) {
        function getUniqueListBy(arr) {
            return [...new Map(arr.map(item => [item['id'], item])).values()]
        }
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('sub_category', `${id}`)
            .join('sub_categories', 'sub_categories.id', 'products.sub_category')
            .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'products.id')
            .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
            .select('products.id', 'products.price', 'products.clean_product',
                'products.brand', 'products.name', 'products.kind',
                'products.unit', 'products.discount', 'upload_file.url as image_url');
        products = getUniqueListBy(products)

        return (checkFavoriteProducts(ctx.req.user, products))

    },


    async findCategoryProducts(ctx) {
        function getUniqueListBy(arr) {
            return [...new Map(arr.map(item => [item['id'], item])).values()]
        }
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('category', `${id}`)
            .join('categories', 'categories.id', 'products.category')
            .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'products.id')
            .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
            .where('upload_file_morph.related_type', "products")
            .where('upload_file_morph.field', "images")
            .select('products.id', 'products.price', 'products.clean_product',
                'products.brand', 'products.name', 'products.kind',
                'products.unit', 'products.discount', 'upload_file.url as image_url');
                products = getUniqueListBy(products)
        return (checkFavoriteProducts(ctx.req.user, products))

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
        function getUniqueListBy(arr) {
            return [...new Map(arr.map(item => [item['id'], item])).values()]
        }
        const knex = strapi.connections.default;
        const { id } = ctx.params;
        let products = await knex('products')
            .where('menu_item', `${id}`)
            .join('menu_items', 'menu_items.id', 'products.menu_item')
            .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'products.id')
            .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
            .select('products.id', 'products.price', 'products.clean_product',
                'products.brand', 'products.name', 'products.kind',
                'products.unit', 'products.discount', 'upload_file.url as image_url');
        products = getUniqueListBy(products)
        return (checkFavoriteProducts(ctx.req.user, products))

    },
    async getAllNewProducts() {
        let newProduct = []
        let now = new Date();
        let entity = await strapi.services.products.find({});
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        entity.map((el) => {
            if (now.toLocaleDateString("en-US", options) <= el.New_Date_Limit)
                newProduct.push(el)

        })
        return newProduct

    }

};