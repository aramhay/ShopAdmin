const { sanitizeEntity } = require('strapi-utils');


module.exports = {

    getProductsInBasket: async (prodId, variantId,quantity) => {
        let products = await strapi.services.products.find({})
        let obj 
        let variant 
            products.find((el) => {
                if (el.id == prodId  ) {obj = el, Object.assign(obj,{quantity:quantity})} 
            })
             obj.variants_of_a_products?.find((el) =>{
                 if (el.id == variantId) variant = el
             })
             obj.variants_of_a_products.length = 0
             obj.variants_of_a_products.push(variant)
             return     sanitizeEntity(obj, { model: strapi.models.products });
  

    }

};