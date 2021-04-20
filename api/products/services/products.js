'use strict';


module.exports = {
    checkFavoriteProducts: async (user, product) => {
        delete product?.menu_item;
        delete product?.sub_category;
        delete product?.category;
        delete product?.type_test;
        delete product?.created_by;
        delete product?.updated_by
        if (!user) return product
        const includes = product?.favorite_products?.filter(e => e.users_permissions_user === user.id)
        product?.variants_of_a_products?.map((el) => {
            Object.assign(el, { favorite: false })
            includes.map((elem, index) => {
                if (el.id === elem?.variants_of_a_product && product.id === elem.product) {
                    Object.assign(el, { favorite: true })
                } else if (product?.variants_of_a_products - 1 === index && !el.favorit) {
                    Object.assign(el, { favorit: false });
                }
            })
        })
        delete product?.favorite_products;
        return product;
    },
  
};

   