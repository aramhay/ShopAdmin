'use strict';



const { sanitizeEntity } = require('strapi-utils');
const products = require('../../products/controllers/products');

module.exports = {
    /**
     * Retrieve records.
     *
     * @return {Array}
     */

    async find(ctx) {
        const knex = strapi.connections.default;

        function getUniqueListBy(arr) {
            return [...new Map(arr.map(item => [item['id'], item])).values()]
        }

        let entities;
        let entity
        let result = [];
        if (ctx.query._q) {
            entities = await strapi.services['magazin-presentation'].search(ctx.query);
        } else {
            entities = await strapi.services['magazin-presentation'].find(ctx.query);
        }
        entity = entities.map(entity => sanitizeEntity(entity, { model: strapi.models['magazin-presentation'] }));


        // const result = await knex('products')
        // // .where('magazin_presentation.users_permissions_user', `${userid}`)
        // .join('magazin_presentations', 'magazin_presentations.id', 'products.magazin_presentation')
        // .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'products.id')
        // .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
        // .select('magazin_presentations.id','magazin_presentations.text_1', 'magazin_presentations.position' , 'magazin_presentations.text_2','products.brand', 'products.id',  'products.name','upload_file.url as image_url');

        entity.map((el, index) => {


            result.push({
                id: el.id, text_1: el.text_1, text_2: el.text_2, position: el.position,
                image_url_1: el.images_1?.url ? el.images_1.url : null,
                image_url_2: el.images_2?.url ? el.images_2.url : null,



                products: el.products.map((elem) =>
                    ({ id: elem.id, name: elem.name, brand: elem.brand, url: elem.images[0]?.url ? elem.images[0].url : null  })
                )



            })
        })

        return result




        // return entities

    },
};