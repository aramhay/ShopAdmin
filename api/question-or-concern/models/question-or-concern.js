'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            let message = '<h1> Thank you, your complaint will be considered from our side. </h1>'
            try { 
                  if (data.copy_to_me)
                strapi.plugins['email'].services.email.send({
                    to: data.email,
                    from: 'mankuyanars@gmail.com',
                    subject: data.subject,
                    html: message + data.message
                })
                else null
            }
            catch (err) {
                return  err;
            }
            return ({ success: true })

        }
    },
}



