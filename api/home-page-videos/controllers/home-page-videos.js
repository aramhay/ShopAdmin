'use strict';

const { checkFavoriteVideos } = require('../../bookmark/services/bookmark')

module.exports = {
    /**
     * Retrieve the record.
     *
     * @return {Object}
     */

    async find(ctx) {
        const entity = await strapi.services['home-page-videos'].find();
       await checkFavoriteVideos(ctx.req.user, entity.videos)
        return entity.videos
    },
};