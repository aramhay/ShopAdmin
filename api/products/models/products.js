'use strict';



module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            const entity = await strapi.services['new-product-limit'].find();
            let numWeeks = entity.new_product_limit;
            let now = new Date();
            now.setDate(now.getDate() + numWeeks * 7);
            data.New_Date_Limit == null ? data.New_Date_Limit = now : null
        },
        afterCreate: async (data) => {
            let field = {
                productId: data.id,
                images: data.images[0]?.url,
                New_Date_Limit: data.New_Date_Limit,
                limited_edition: data.limited_edition,
                brand: data.brand,
                kind: data.kind,
                name: data.name,
                price: data.price,
                clean_product: data.clean_product
            }
            let beauty = ["Gesicht", "Körper", "Clean Beauty", "Make-Up", "Haare"]
            let interieur = ["Raumdüfte", "Lifestyle"]
            if (data.menu_item?.item_name === "Parfums")
                await strapi.services.parfums.create(field)
            if (beauty.includes(data.menu_item?.item_name))
                await strapi.services.beauty.create(field)
            if (interieur.includes(data.menu_item?.item_name))
                await strapi.services.interieur.create(field);
            if (data.video?.url) {
                let forVideoField = {
                    video_id: data.id,
                    video_status: data.video_status,
                    video_name: data.video_name,
                    description: data.video_description,
                    url: data.video?.url
                }
                await strapi.services.videos.create(forVideoField)
            }
        },
        afterUpdate: async (data) => {
            if (data.video?.url) {
                let forVideoField = {
                    video_id: data.id,
                    video_status: data.video_status,
                    video_name: data.video_name,
                    description: data.video_description,
                    url: data.video?.url
                }
                await strapi.services.videos.update({ video_id: data.id }, forVideoField)
            }
            let forFourAndEight = {
                productId: data.id,
                images: data?.images[0]?.url,
                New_Date_Limit: data?.New_Date_Limit,
                limited_edition: data?.limited_edition,
                brand: data?.brand,
                kind: data?.kind,
                name: data?.name,
                price: data?.price,
                clean_product: data?.clean_product
            }
            strapi.services.beauty.update({ productId: data.id }, forFourAndEight)
                .then(res => {
                    if (res) return
                    strapi.services.parfums.update({ productId: data.id }, forFourAndEight).then(res1 => {
                        if (res1) return
                    })
                    strapi.services.interieur.update({ productId: data.id }, forFourAndEight)
                })
        },
        beforeDelete: async (data) => {
            await strapi.services.videos.delete({ video_id: data.id })
            await strapi.services['favorite-product'].delete({ product: data.id })
            await strapi.services.beauty.delete({ productId: data.id })
            await strapi.services.parfums.delete({ productId: data.id })
            await strapi.services.interieur.delete({ productId: data.id })
        }
    },

};