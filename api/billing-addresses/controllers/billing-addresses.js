'use strict';

const axios = require('axios');
const { sanitizeEntity } = require('strapi-utils');


module.exports = {
    async create(ctx) {
        const params = {
            country: ctx.request.body.country,
            address1: ctx.request.body.road,
            address2: ctx.request.body.house_number,
            locality: ctx.request.body.place,
            postal_code: ctx.request.body.postcode
        }
        let Data = ctx.request.body
        Object.assign(Data, { users_permissions_user: ctx.req.user.id })
        const checkText = ['first_name', 'surname', 'road', 'place', 'country', 'postcode']
        const checkNumber = ['house_number']
        const isValidText = checkText.some(k => Data[k] === '')
        const isValidNumber = checkNumber.some(k => !Data[k])
        if (isValidText || isValidNumber)
            return ({ success: false, message: "please fill mandatory fields" })
        console.log(ctx.req.user);
        // try {
        // const { data } = await axios.get('https://international-street.api.smartystreets.com/verify?auth-id=99ece7d1-cfcb-6e9a-a752-9ff43bb4eaa9&auth-token=e69I4Xvz73YB2m6CmTk9&agent=smartystreets%20(website%3Ademo%2Fsingle-address%40latest)', { params });
        // if (data[0]?.analysis?.verification_status == 'Verified') {
        if (ctx.params.appointment == "billing") {
            await strapi.services["billing-addresses"].create(Data)
            return ({ success: true, message: "created" })
        } else
            if (ctx.params.appointment == "delivery") {
                await strapi.services["delivery-address"].create(Data)
                return ({ success: true, message: "created" })
            } else return ({ success: false, message: "Not Found" })
        // } else return ({ success: false, message: "address not found" })
        // } catch (e) {
        //     return ({ success: false, message: "address not found", error: e })
        // }

    }
    ,
    async findUserBillingAdresses(ctx) {
        let entities = await strapi.services["billing-addresses"].find({ users_permissions_user: ctx.req.user.id })
        entities.map(entity => { sanitizeEntity(entity, { model: strapi.models["billing-addresses"] }); delete entity.users_permissions_user });
        return entities
    },

    async findUserDeliveryAdresses(ctx) {
        let entities = await strapi.services["delivery-address"].find({ users_permissions_user: ctx.req.user.id })
        entities.map(entity => { sanitizeEntity(entity, { model: strapi.models["billing-addresses"] }); delete entity?.users_permissions_user });
        return entities
    }
};
