'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        let entity;
        console.log(ctx.request.body);
        if (!ctx.request.body.privacy) {
            return ({ 
                success:false,
                message: "You did't agree with our privacy & policy terms" })
        }
        if (!ctx.request.body.subject) {
            return ({
                success:false,
                message: "subject can not be blank"
            })
        }
        if (!ctx.request.body.message) {
            return ({
                success:false, 
                message: "message can not be blank" })
        }
        if (ctx.is('multipart')) {
            const { data, files } = parseMultipartData(ctx);
            entity = await strapi.services["question-or-concern"].create(data, { files });
        } else {
            entity = await strapi.services["question-or-concern"].create(ctx.request.body);
        }
        return ({ success:true,
        });
    },
};













  