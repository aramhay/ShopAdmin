'use strict';

const { sanitizeEntity } = require('strapi-utils');


module.exports = {
    async findAllData() {
        let result = {}
        let section1 = await strapi.services["not-found-page-section-1"].find({ _limit: 1 });
        section1 = sanitizeEntity(section1, { model: strapi.models["not-found-page-section-1"] })

        let section2 = await strapi.services["not-found-page-section-2"].find({ _limit: 1 });
        section2 = sanitizeEntity(section2, { model: strapi.models["not-found-page-section-2"] })

        let section3 = await strapi.services["not-found-page-section-3"].find();
        section3 = section3.map(entity => sanitizeEntity(entity, { model: strapi.models["not-found-page-section-3"] }));

        result.section1 = section1
        result.section2 = section2
        result.section3 = section3

        return result

    }

};
