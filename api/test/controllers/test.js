'use strict';


const { sanitizeEntity } = require('strapi-utils');

module.exports = {
   
    async update(ctx) {
        console.log(ctx.params)
           let  entities = await strapi.services.test.update({id:ctx.params.id}, 
           {name:ctx.request.body}
           );
            
        return  ({success:true , message:"updated"});
    },
};
