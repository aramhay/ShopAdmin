'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const {checkFavoriteVideos} = require('../services/bookmark')


module.exports = {
    
    async create(ctx) {
        let bookmarkData = {
            users_permissions_user: ctx.req.user.id,
            video: ctx.request.body.video,
        }
        let newVideo 
        let exist = await strapi.services.videos.find({ id: bookmarkData.video })
        if (exist.length < 1) return ({ isFavorite: false, message: 'video doesnt exist' })       
        let entity = await strapi.services.bookmark.find(bookmarkData)
        if ((entity.length === 0) && (exist.length !== 0)) {
          newVideo =  await strapi.services.bookmark.create(bookmarkData)
                return (newVideo?.video)
        }
        else if ((entity.length !== 0)) {
            await strapi.services.bookmark.delete(bookmarkData)
            return ({isFavorite: false})  

        } else
            return ({ message: 'something went wrong' })
    },





   
    async findOne(ctx) {
     let t = await strapi.services['favorite-product'].find({})
     console.log(t)
      let prod = await strapi.services.bookmark.find({ users_permissions_user: ctx.req.user.id })
      console.log(prod);
      let p = prod.map(product => {
          delete product?.users_permissions_user
             
            Object.assign(product.video,{favorite:true})
              return product?.video
      })

      return await Promise.all(p)

  },





};
