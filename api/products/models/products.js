'use strict';
const Boom = require('boom');
const { LOG_VERSION } = require('strapi-utils/lib/logger');
const { checkUniqueVariants } = require("../services/products")




module.exports = {


    lifecycles: {


        async beforeCreate(data) {
            let count = 0
            let variants = await strapi.services["variants-of-a-product"].find({})
            variants.map((el) => {
                if (data?.variants_of_a_products?.includes(el?.id) && el?.main) count++
            })
            if (count > 1) {
                throw Boom.badRequest(
                    'The product can not have several main variants',
                )
            }
            if (count < 1) {
                throw Boom.badRequest(
                    'The product should have at least one main variant',
                )
            }

            const entity = await strapi.services['new-product-limit'].find();
            let numWeeks = entity.new_product_limit;
            let now = new Date();
            now.setDate(now.getDate() + numWeeks * 7);
            data.New_Date_Limit == null ? data.New_Date_Limit = now : null
        },

        afterCreate: async (data) => {
            let field = {
                productId: data.id,
                products: data
            }
            let beauty = ["Gesicht", "Körper", "Clean Beauty", "Make-Up", "Haare"]
            let interieur = ["Raumdüfte", "Lifestyle"]
            if (data.menu_item?.item_name === "Parfums")
                await strapi.services.parfums.create(field)
            if (beauty.includes(data.menu_item?.item_name))
                await strapi.services.beauty.create(field)
            if (interieur.includes(data.menu_item?.item_name))
                await strapi.services.interieur.create(field);
            // if (data.video?.url) {
            //     let forVideoField = {
            //         video_id: data.id,
            //         video_status: data.video_status,
            //         video_name: data.video_name,
            //         description: data.video_description,
            //         url: data.video?.url
            //     }
            //     await strapi.services.videos.create(forVideoField)
            // }
        },

    //     async beforeUpdate(params,data) {
    //         let count = 0
    //         // console.log(data,'ddddddddddddddddd',params);
    //   let favorite = await strapi.services['favorite-product'].find({product:params.id})
    //  let p =  favorite.map((el)=>{
    //       if(!data.variants_of_a_products.includes(el.variants_of_a_product.id )) {
    //          strapi.services['favorite-product'].delete({variants_of_a_product:el.variants_of_a_product.id,product:null})

    //       }

    //   })

    //  await Promise.all(p)

    // //   console.log(favorite);
    //     },

        afterUpdate: async (data) => {
            // if (data.video?.url) {
            //     let forVideoField = {
            //         video_id: data.id,
            //         video_status: data.video_status,
            //         video_name: data.video_name,
            //         description: data.video_description,
            //         url: data.video?.url
            //     }
            //     await strapi.services.videos.update({ video_id: data.id }, forVideoField)
            // }
            let forFourAndEight = {
                productId: data.id,
                products: data

            }
            let p1 = new Promise((res, rej) => {
                strapi.services.beauty.update({ productId: data.id }, forFourAndEight)
            })
            let p2 = new Promise((res, rej) => {
                strapi.services.parfums.update({ productId: data.id }, forFourAndEight)
            })
            let p3 = new Promise((res, rej) => {
                strapi.services.interieur.update({ productId: data.id }, forFourAndEight)
            })
            Promise.all([p1, p2, p3])
                .then(values => {
                })
                .catch(error => {
                });
        },
        beforeDelete: async (data) => {
            // await strapi.services.videos.delete({ video_id: data.id })
            await strapi.services['favorite-product'].delete({ product: data.id })
            await strapi.services.beauty.delete({ productId: data.id })
            await strapi.services.parfums.delete({ productId: data.id })
            await strapi.services.interieur.delete({ productId: data.id })
        }
    },

};