'use strict';

const { default: createStrapi } = require("strapi");
const _ = require('lodash');
const products = require("../../products/services/products");


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/models.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
    lifecycles: {
        beforeCreate: async (data) => {
            if (!data.parfums) Object.assign(data, { parfums: [] })
            if (data.parfums?.length < 4) {
                let entity = await strapi.services.parfums.find({})
                data.parfums.map((el) => {
                    return entity = entity.filter((elem) => elem.id !== el)
                })
                let con = data.parfums.concat(_.sampleSize(entity, 4 - data.parfums?.length))
                data.parfums = con
            };
            if (!data.beauties) Object.assign(data, { beauties: [] })
            if (data.beauties?.length < 4) {
                let entity = await strapi.services.beauty.find({})
                data.beauties.map((el) => {
                    return entity = entity.filter((elem) => elem.id !== el)
                })
                let con = data.beauties.concat(_.sampleSize(entity, 4 - data.beauties?.length))
                data.beauties = con
            };
            if (!data.interieurs) Object.assign(data, { interieurs: [] })
            if (data.interieurs?.length < 4) {
                let entity = await strapi.services.interieur.find({})
                data.interieurs.map((el) => {
                    return entity = entity.filter((elem) => elem.id !== el)
                })
                let con = data.interieurs.concat(_.sampleSize(entity, 4 - data.interieurs?.length))
                data.interieurs = con
            };


        }

    },
};
