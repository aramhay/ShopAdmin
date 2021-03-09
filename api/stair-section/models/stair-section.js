'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            let now = new Date();
            data.date = now

        },
        afterUpdate: async (data) => {
            let now = new Date();
            data.date = now
        },
    }
}