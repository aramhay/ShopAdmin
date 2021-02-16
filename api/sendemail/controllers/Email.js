
module.exports = {
    sendemail: async (ctx) => {
        let options = ctx.request.body;
        try {
            await strapi.plugins['email'].services.email.send({
                to: options.to,
                from: 'mankuyanars@gmail.com',
                subject: options.subject,
                text: `You still have products in your shopping cart.${options.text}`,
                html: options.html
            })
        }
        catch (err) {
            return ctx.badRequest(null, err);
        }
        return ({ success: true })
    },
     //BS-13 ,kisat,stugel order hostory ii mej kan current_shopping_basket_product_id n te voch vorpeszi tramadrenq zexch
    Recommendationsendemail: async (ctx) => {
        let { userid } = ctx.request.body
        let { url } = ctx.request.body
        let options = ctx.request.body;
        let username = await strapi.plugins['users-permissions'].services.user.fetchAll({ id: userid })
        try {
            await strapi.plugins['email'].services.email.send({
                to: options.to,
                from: 'mankuyanars@gmail.com',
                subject: 'recomendetion beauty shop',
                html: `<h1> ${username[0].username}  recommend his shopping basket ,  ${url}</h1>`
            })
        }
        catch (err) {
            return ctx.badRequest(null, err);
        }
        const knex = strapi.connections.default;
        const result = await knex('shopping_baskets')
            .where('shopping_baskets.users_permissions_user', `${userid}`)
            .join('products', 'products.id', 'shopping_baskets.product')
            .select('products.id');
        await strapi.services['shopping-basket-recommendation'].create({
            to: options.to,
            from: username[0].email,
            current_shopping_basket_product_id: result
        })
        return ({
            success: true,
            message: `${username[0].username} has recommended  Shopping basket  \u{1F600}`
        })
    }




}