'use strict';


module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
           let entity = await strapi.services.newsletter.find({})
             entity.map((el) => {
                try {
                     strapi.plugins['email'].services.email.send({
                        to: data.Email,
                        from: 'mankuyanars@gmail.com',
                        subject: el.Subject,
                        html: el.HTML_describe
                    })
                }
                catch (err) {
                    return ctx.badRequest(null, err);
                }
                return ({ success: true })
             })
                       
            
          }
      },
};