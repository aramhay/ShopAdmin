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

    },

    deleteUnnecessaryKeyInObject: (data) => {
        if (Array.isArray(data)) {
            data.map((el) => {
                delete el.created_by,
                    delete el.updated_by,
                    delete el.created_at,
                    delete el.updated_at,
                    delete el.magazin_presentation,
                    delete el.type_test,
                    delete el.menu_item.images
                delete el.sub_category.product
                if (el.images) {
                    el.images.map((elem) => {
                        delete elem.formats,
                            delete elem.thumbnail,
                            delete elem.medium,
                            delete elem.small
                    })
                }
            })
        } else {
            delete data.created_by,
                delete data.updated_by,
                delete data.created_at,
                delete data.updated_at,
                delete data.magazin_presentation,
                delete data.type_test,
                delete data.menu_item.images
            delete data.sub_category.product
            if (data.images) {
                data.images.map((elem) => {
                    delete elem.formats,
                        delete elem.thumbnail,
                        delete elem.medium,
                        delete elem.small
                })
            }
        };
        return data
    }
};
