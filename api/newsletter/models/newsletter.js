'use strict';


module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
           let entity = await strapi.services['user-newsletter'].find({})
             entity.map((el) => {
                try {
                     strapi.plugins['email'].services.email.send({
                        to: el.Email,
                        from: 'mankuyanars@gmail.com',
                        subject: data.Subject,
                        html: data.HTML_describe 
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