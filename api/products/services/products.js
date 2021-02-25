'use strict';


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    checkFavoriteProducts: async (user, product) => {     
        if (!user) return product
        let entity = await strapi.services['favorite-product'].find({ users_permissions_user: user.id })
        product.map((el) => {
            entity.map((elem, index) => {
                if (el.id === elem.product.id) {
                    Object.assign(el, { favorit: true });
                    return
                } else
                    if (entity.length - 1 === index && !el.favorit) {
                        Object.assign(el, { favorit: false });
                    }
            })
        })
        
        return product

    }
};
