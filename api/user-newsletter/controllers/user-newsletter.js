'use strict';

const { parseMultipartData } = require('strapi-utils');

module.exports = {
    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        let entity;
        let check = await strapi.services['user-newsletter'].find({})
        ctx.request.body.Email = ctx.request.body.Email.toLowerCase();
        if (check.some(el => el.Email === ctx.request.body.Email)
        ) {
            return ({ message: false })
        } else
            if (ctx.is('multipart')) {
                const { data, files } = parseMultipartData(ctx);
                entity = await strapi.services['user-newsletter'].create(data, { files });
            } else {
                entity = await strapi.services['user-newsletter'].create(ctx.request.body);
            } return ({ message: true })
    },
};

