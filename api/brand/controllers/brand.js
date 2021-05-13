'use strict';

const { default: createStrapi } = require("strapi");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        let data = await strapi.services.brand.find({})

        let firstData = [
            {
                title: "A",
                content: []
            },
            {
                title: "B",
                content: []
            },
            {
                title: "C",
                content: []
            },
            {
                title: "D",
                content: []
            },
            {
                title: "E",
                content: []
            },
            {
                title: "F",
                content: []
            },
            {
                title: "G",
                content: []
            },
            {
                title: "H",
                content: []
            },
            {
                title: "I",
                content: []
            },
            {
                title: "G",
                content: []
            },
            {
                title: "K",
                content: []
            },
            {
                title: "L",
                content: []
            }, {
                title: "M",
                content: []
            },
            {
                title: "N",
                content: []
            },
            {
                title: "O",
                content: []
            },
            {
                title: "P",
                content: []
            },
            {
                title: "Q",
                content: []
            },
            {
                title: "R",
                content: []
            },
            {
                title: "S",
                content: []
            }, {
                title: "T",
                content: []
            },
            {
                title: "U",
                content: []
            },
            {
                title: "V",
                content: []
            },
            {
                title: "W",
                content: []
            },
            {
                title: "X",
                content: []
            },
            {
                title: "Y",
                content: []
            },
            {
                title: "Z",
                content: []
            },
        ]
        firstData.map((elem) => {
            data.map((el) => {
               if (elem.title == el.name[0].toUpperCase()) {
                  elem.content.push(el.name) 
               }
            })
        })

        return(firstData)

    }
}
