'use strict';


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    checkFavoriteProducts: async (user, product) => {
        product.map((el) =>{
            delete el?.favorite_products;
            delete el?.menu_item;
            delete el?.sub_category;
            delete el?.category;
            delete el?.type_test
        })
        if (!user) return product
        let entity = await strapi.services['favorite-product'].find({ users_permissions_user: user.id })
        product.map((el) => {
            Object.assign(el, { favorit: false });
            entity.map((elem, index) => {
                if ((el.id === elem.product?.id) || (elem.product?.id == el.productId)) {
                    Object.assign(el, { favorit: true });
                    return
                } else
                    if (entity.length - 1 === index && !el.favorit) {
                        Object.assign(el, { favorit: false });
                    }
            })
        })

        return product

    },
};
