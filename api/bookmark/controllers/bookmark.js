'use strict';
const { sanitizeEntity } = require('strapi-utils');


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async create(ctx) {
        let favoritData = {
            users_permissions_user: ctx.req.user.id,
            video: ctx.request.body.video
        }
        let entity = await strapi.services.bookmark.find(favoritData)
        let exist = await strapi.services.videos.find({ id: ctx.request.body.video })
        if ((entity.length === 0) && (exist.length !== 0)) {
            await strapi.services.bookmark.create(favoritData)
            return ({ isFavorite: true })
        }
        else if ((exist.length !== 0)) {
            await strapi.services.bookmark.delete(favoritData)
            return ({ isFavorite: false })
        } else
            return ({ message: 'video doesnt exist' })
    },
    async findOne(ctx) {
        let entities;
        let favoritData = {
            users_permissions_user: ctx.req.user.id
        }
        entities = await strapi.services.bookmark.find(favoritData)
        let favoritVideos = []
        entities.map((e) => { favoritVideos.push(e.video) })
        return favoritVideos

    },
};
