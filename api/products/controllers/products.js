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
        entities.map(entity => { sanitizeEntity(entity, { model: strapi.models.products }) });
        let p = entities.map((el) => {
            return checkFavoriteProducts(ctx.req.user, el);
        })
        return await Promise.all(p)

    },

    async findByLimit(ctx) {
        let result = []
        let { limit } = ctx.params
        let products = await strapi.services.products.find();
        products = products.map(product => sanitizeEntity(product, { model: strapi.models.products }))
        result =  _.sampleSize(products, limit)
          result.map(product => sanitizeEntity(product, { model: strapi.models.products }))
          result.map((el)=>{
              checkFavoriteProducts(ctx.req.user,el)
          })
        return result
    },


    async findOne(ctx) {
        const { id } = ctx.params;
        let entity = await strapi.services.products.findOne({ id });
        console.log(entity);
        let product = sanitizeEntity(entity, { model: strapi.models.products })
        await checkFavoriteProducts(ctx.req.user, product)
        return product
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
        let k = res.map((el) => {
            return checkFavoriteProducts(ctx.req.user, el)
        })
        return await Promise.all(k)

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

    },

    async findAllCleanProducts(ctx) {
        let entity = await strapi.services.products.find({ clean_product: true })
        let p = entity.map((el) => {
            return checkFavoriteProducts(ctx.req.user, el)
        })
        return await Promise.all(p)

    },

    async findAllSample(ctx) {
        let result = []
        let entity = await strapi.services.products.find({})
        let p = entity.map((el) => {
            el.variants_of_a_products?.map((elem) => {
                if (elem.sample) {
                    el.variants_of_a_products.lenght = 0
                    el.variants_of_a_products = [elem]
                }
                checkFavoriteProducts(ctx.req.user, el)
                sanitizeEntity(el, { model: strapi.models.products })

                result.push(el)

            })
            return result
        })
        let k = await Promise.all(p)
        return k[0]

    },

    async findTopTen(ctx) {
       let entity = await strapi.services.products.find({top_10:true})
       console.log(entity);
       let p = entity.map((el) =>{
           return checkFavoriteProducts(ctx.req.user,el)
       })
       return await Promise.all(p)
     },

    // async findTopTen(ctx) {
    //     let scentIds = ctx.params.scent_note.split(',')
    //     let products = await strapi.query('products').find({});
    //     let p = products
    //         .filter((el) => scentIds.includes(String(el?.scent_note?.id)))
    //         .map(e => (sanitizeEntity(e, { model: strapi.models.products }), checkFavoriteProducts(ctx.req.user, e)))
    //     return await Promise.all(p)
    // },


};