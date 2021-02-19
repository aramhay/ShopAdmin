'use strict';



module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            const entity = await strapi.services['new-product-limit'].find();
            let numWeeks = entity.new_product_limit;
            let now = new Date();
            now.setDate(now.getDate() + numWeeks * 7);
            data.New_Date_Limit == null ? data.New_Date_Limit = now : null
        }
    },
};