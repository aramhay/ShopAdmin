'use strict';

const {checkFavoriteVideos} = require('../../bookmark/services/bookmark')

module.exports = {
    /**
     * Retrieve records.
     *
     * @return {Array}
     */

    async find(ctx) {
        
       let videos = await strapi.services.videos.find({})
       return  await checkFavoriteVideos(ctx.req.user,videos)
    },


    // async findOne(ctx) {
    //     const { id } = ctx.params;
    //     const entity = await strapi.services.restaurant.findOne({ id });
    //     return sanitizeEntity(entity, { model: strapi.models.restaurant });
    //   },
};