'use strict';

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
    /**
     * Retrieve records.
     *
     * @return {Array}
     */

    async find(ctx) {
        let entities;
        let entity;
        let bookmark
        if (ctx.query._q) {
            entities = await strapi.services.videos.search(ctx.query);
        } else {
            entities = await strapi.services.videos.find(ctx.query);
        }
        entity = entities.map(entity => sanitizeEntity(entity, { model: strapi.models.videos }));
        if (!ctx.req.user) return entity
        else
            bookmark = await strapi.services.bookmark.find({ users_permissions_user: ctx.req.user.id })
        entity.map((el) => {
            Object.assign(el, { favorit: false });
            bookmark.map((elem, index) => {
                if (elem.video?.id == el.id) {
                    Object.assign(el, { favorit: true });
                    return
                }
                else
                    if (bookmark.length - 1 === index && !el.favorit) {
                        Object.assign(el, { favorit: false });
                    }
            })
        })
        return entity
    },
};