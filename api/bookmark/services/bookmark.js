'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-services)
 * to customize this service
 */


 module.exports = {
    checkFavoriteVideos: async (user, video) => {
        video.map(el => {delete el?.created_by , delete el?.updated_by , delete el?.bookmarks})
        if (!user) return video
        let entity = await strapi.services.bookmark.find({ users_permissions_user: user.id })
        video.map((el) => {
            entity.map((elem, index) => {
                if (el?.id === elem.video.id) {
                    Object.assign(el, { favorite: true });
                    return
                } else
                    if (entity.length - 1 === index && !el.favorite) {
                        Object.assign(el, { favorite: false });
                    }
            })
        })
        return  video

    }
};
