
// 'use strict';

const { getProductsInBasket } = require('../services/shopping-basket')
const { checkFavoriteProducts } = require('../../products/services/products')
const { sanitizeEntity } = require('strapi-utils');

module.exports = {

    async create(ctx) {
        let data = {
            users_permissions_user: ctx.req.user.id,
            product: ctx.request.body.product,
            variant_id: ctx.request.body.variant,
        }
        let idProduct = ctx.request.body.product
        let idVariant = ctx.request.body.variant
        let maxQuantity

        if (ctx.request.body.quantity <= 0) {
            ctx.send({
                success: false,
                message: 'quantity can not be negative'
            }, 400);return
        }
        let product = await strapi.services.products.find({ id: idProduct })
        if (product.length === 0) {ctx.send({
            success: false,
            message: 'product is not exist'
        }, 404);return}
        else {
            let exist_variant = product[0].variants_of_a_products.some((el) => el.id === idVariant)
            if (!exist_variant) {ctx.send({
                success: false,
                message: "product's variant is not exist"
            }, 404); return}
            else {
                let found
                product[0].variants_of_a_products.find((el) => {
                    if (el.id === idVariant) { found = el.quantity, maxQuantity = el.quantity }
                })
                if (found < ctx.request.body.quantity) {
                    return ({ success: false, message: `product quantity is less than ${ctx.request.body.quantity}` })
                }
            }
        }
        let basket = await strapi.services['shopping-basket'].find({ users_permissions_user: ctx.req.user.id })
        let sample_count = 0
        basket.map((el) => {
            if (el.type_test) sample_count += 1
        })
        let variant
        let prod = await strapi.services.products.find({ id: idProduct })
        prod[0].variants_of_a_products.find((el) => {
            if (el.id == idVariant) variant = el
        })
        if (variant?.sample) {
            if (sample_count == 5) {
                return {
                    success: false,
                    message: "Max 5 samples per order"
                }
            }
        }
        let entity = await strapi.services['shopping-basket'].find(data);
        if (entity.length == 1) {
            let product = await strapi.services.products.find({ id: idProduct })
            let found
            product[0].variants_of_a_products.find((el) => {
                if (el.id === idVariant && el.sample == true) found = el
            })
            if (found && (ctx.request.body.quantity > 1)) {
                return {
                    success: false,
                    message: "Max 1 sample per fragrance per order"
                }
            }
            let newQuantity = entity[0].quantity
            if ((ctx.request.body.quantity + parseInt(newQuantity)) > maxQuantity) {
                ctx.send({
                    success: false,
                    message: `The selected quantity could not be added to the shopping cart because it exceeds the available stock. ${maxQuantity} are currently in stock.`
                }, 400);
                return 
            }
            await strapi.services['shopping-basket'].update({ id: entity[0].id }, { quantity: ctx.request.body.quantity + parseInt(newQuantity) });
            return { success: true };
        } else {
            let product = await strapi.services.products.find({ id: idProduct })
            let found
            product[0].variants_of_a_products.find((el) => {
                if (el.id === idVariant && el.sample == true) found = el
            })
            if (found && (ctx.request.body.quantity > 1)) {
                ctx.send({
                    success: false,
                    message: `Max 1 sample per fragrance per order`
                }, 400)

            } else {
                if (found) {
                    await strapi.services['shopping-basket'].create({
                        ...data, type_test: true,
                        quantity: ctx.request.body.quantity,
                        product_id: ctx.request.body.product
                    })
                    return { success: true };

                }
            }
            await strapi.services['shopping-basket'].create({
                ...data, quantity: ctx.request.body.quantity,
                product_id: ctx.request.body.product
            })
            return { success: true };
        }
    },

    async findOne(ctx) {
        let gift_wrap_price = 0
        let cost = 0
        const discount = await strapi.services.discount.find();
        let entity = await strapi.services['shopping-basket'].find({ users_permissions_user: ctx.req.user.id, })
        let gift_wrap = await strapi.services['gift-wrap'].find({})
        delete gift_wrap[0].updated_by
        delete gift_wrap[0].created_by
        let t = entity.map((el) => {
            if (el.product_id !== null) {
                return getProductsInBasket(el.product_id, el.variant_id, el.quantity)

            } else return el
        })
        let result = await Promise.all(t)
        let tt = result.map((el) => {
            return checkFavoriteProducts(ctx.req.user, el)
        })
        let basket = await Promise.all(tt)

        basket.map((el, index) => {
            if (el.gift_wrap !== undefined) {
                gift_wrap_price = el.quantity * gift_wrap[0].price; basket[index] = gift_wrap[0],
                    Object.assign(basket[index], { quantity: el.quantity })
            }
        })

        basket.map((el) => {
            if (el.variants_of_a_products !== undefined) {
                cost = cost + (el?.variants_of_a_products[0]?.price * el.quantity)
            }
        })
        //     if (user[0].regular_customer) { cost = cost - cost * permanent_discount.discount / 100 } /*regular costumer klini en jamanak erb order historium patverneri qanaky mec lini permanent_discount i qanakic */

        cost += gift_wrap_price
        if (cost < discount.minprice) {
            cost += discount.discount
        }
        // basket.push({ cost })
        let res = {}
        Object.assign(res,{products:basket})
        Object.assign(res,{cost})
      
        return res
    },

    async create_gift_wrap(ctx) {
        let data = {
            product: 1,
            quantity: ctx.request.body.quantity,
            users_permissions_user: ctx.req.user.id,
            product_id: 1,
            variant_id: 1
        }
        const knex = strapi.connections.default;
        const exist = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${ctx.req.user.id}`)
            .select('shopping_baskets.product', 'shopping_baskets.quantity')
        const trust = exist.find(({ product }) => product === 1);
        if (!trust) {
            await strapi.services['shopping-basket'].create(data);
            return { success: true };
        } else {
            await strapi.services['shopping-basket'].update({ users_permissions_user: ctx.req.user.id, product: 1 }, { quantity: ctx.request.body.quantity });
            return {
                success: true,
            }
        }
    },

    async delete_gift_wrap(ctx) {
        await strapi.services['shopping-basket'].delete({
            users_permissions_user: ctx.req.user.id,
            product_id: 1,
        });
        return ({ success: true, message: "deleted" })
    },

    async delete(ctx) {
        let { product_id } = ctx.params
        let { variant_id } = ctx.params
        await strapi.services['shopping-basket'].delete({ users_permissions_user: ctx.req.user.id, product_id: product_id, variant_id: variant_id });
        return ({ success: true, message: "deleted" })
    }

};






