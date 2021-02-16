'use strict';


const _ = require('loadsh');

module.exports = {
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        //  console.log(await strapi.plugins['users-permissions'].services.user.fetchAll());
        //  console.log(  strapi.services);

        const userid = ctx.params.userid;
        const knex = strapi.connections.default;
        const result = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${userid}`)
            .join('products', 'products.id', 'shopping_baskets.product')
            .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'shopping_baskets.product')
            .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
            .select('shopping_baskets.id', "shopping_baskets.quantity", 'products.brand', 'products.id', 'products.price', 'products.name', 'products.discount', 'upload_file.url as image_url',);
        const gift_wrap = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${userid}`)
            .join('gift_wraps', 'gift_wraps.id', 'shopping_baskets.product')
            .select('gift_wraps.id');
        const typeTest = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${userid}`)
            .join('type_tests', 'type_tests.id', 'shopping_baskets.type_test')
            .leftJoin('upload_file_morph', 'upload_file_morph.related_id', 'shopping_baskets.type_test')
            .leftJoin('upload_file', 'upload_file.id', 'upload_file_morph.upload_file_id')
            .select('type_tests.id', 'type_tests.brand', 'type_tests.price', 'type_tests.size', 'upload_file.url as image_url')

        function getUniqueListBy(arr) {
            return [...new Map(arr.map(item => [item['id'], item])).values()]
        }
        let res = (getUniqueListBy(result));
        typeTest.map((el) => {
            res.push(el)
        })



        let cost = 0
        let type_test_cost = 0
        const shipping = await strapi.services.discount.find()
        let permanent_discount = await strapi.services['permanent-discount'].find()
        let user = await strapi.plugins['users-permissions'].services.user.fetchAll({ id: userid })
        res.map((e) => {
            if (e.quantity !== undefined) {
                cost += e.price * e.quantity - (e.price * e.quantity * e.discount / 100)
            } else type_test_cost += e.price
        })

        if (user[0].regular_customer) { cost = cost - cost * permanent_discount.discount / 100 } /*regular costumer klini en jamanak erb order historium patverneri qanaky mec lini permanent_discount i qanakic */

        if (cost < shipping.minprice) {
            cost += shipping.discount
        }
        cost += type_test_cost
        if (res.length === 0) cost = 0;
        if (gift_wrap.length !== 0) {
            cost += 5;
            let gift_wrap_data = await strapi.services['gift-wrap'].find({ id: gift_wrap[0].id })
            res.push({
                "id": gift_wrap_data[0].id,
                "price": gift_wrap_data[0].price,
                "name": gift_wrap_data[0].Name,
                "text": gift_wrap_data[0].Text,
                "images": gift_wrap_data[0].images[0].url
            })
        } res.push({ cost })
        return (res)
    },


    async create(ctx) {
        let entity;
        let id = ctx.request.body.product
        let exist = await strapi.services.products.find({ id })
        if (exist.length === 0) return ({ success: false, message: "product is not exist" })
        else {
            let availableCount = await strapi.services.products.find({ id })
            if ((availableCount[0].for_sale_count) < ctx.request.body.quantity)
                return ({ success: false, message: `product quantity is less than ${ctx.request.body.quantity}` })
        }
        let entity1 = await strapi.services['shopping-basket'].find({ users_permissions_user: ctx.request.body.users_permissions_user, product: ctx.request.body.product });
        if (entity1.length == 1) {
            entity = await strapi.services['shopping-basket'].update({ id: entity1[0].id }, { ...ctx.request.body });
            return { success: true };
        } else {

            entity = await strapi.services['shopping-basket'].create(ctx.request.body);
            return { success: true };
        }

    },
    async create_product_samples(ctx) {
        let count = 0;
        const knex = strapi.connections.default;
        const id = ctx.request.body.product;
        const basketType = await knex('shopping_baskets')
            .select()
        const products = await knex('products')
            .where('products.id', `${id}`)
            .join('type_tests', 'type_tests.id', 'products.type_test')
            .select('type_tests.id')

        basketType.map((el) => {
            if (el.users_permissions_user == ctx.request.body.users_permissions_user && el.type_test !== null) count += 1
        })
        if (count < 5) {
            let tr = await strapi.services['shopping-basket'].find({ users_permissions_user: ctx.request.body.users_permissions_user, type_test: products[0].id, quantity: 1 });
            if (tr.length == 0) {
                await strapi.services['shopping-basket'].create({ users_permissions_user: ctx.request.body.users_permissions_user, type_test: products[0].id, quantity: 1 });
            } else return {
                success: false,
                message: "Max 1 sample per fragrance per order"
            }
        }
        else return {
            success: false,
            message: "Max 5 samples per order"
        }
        return { success: true };
    },



    async create_gift_wrap(ctx) {
        ctx.request.body.product = 1;
        let trust
        const knex = strapi.connections.default;
        const exist = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${ctx.request.body.users_permissions_user}`)
            .select('shopping_baskets.product')
        exist.map((el) => {
            if (el.product == 1) trust = true;
        }
        )
        if (trust) {
            return {
                success: false,
                message: 'gift wrap exists in the users shopping basket'
            }
        } else
            await strapi.services['shopping-basket'].create(ctx.request.body);
        return { success: true };
    },



    async delete_gift_wrap(ctx) {
        let { userid } = ctx.params
        const knex = strapi.connections.default;
        const gift_wrap = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${userid}`)
            .join('gift_wraps', 'gift_wraps.id', 'shopping_baskets.product')
            .select('shopping_baskets.id');
        await strapi.services['shopping-basket'].delete({ id: gift_wrap[0].id });
        return ({ success: true, message: 'success' })
    },
    async delete_product_samples(ctx) {
        let { userid, sampleid } = ctx.params
        await strapi.services['shopping-basket'].delete({ users_permissions_user: userid, type_test: sampleid });
        return ({ success: true, message: "deleted" })
    },

    async delete(ctx) {
        let { userid, productid } = ctx.params
        await strapi.services['shopping-basket'].delete({ users_permissions_user: userid, product: productid });
        return ({ success: true, message: "deleted" })
    }

};






