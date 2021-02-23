'use strict';

const { sanitizeEntity } = require('strapi-utils');
const e = (data1, data2) => {
  data1.forEach(cat1 => {
    cat1.categories.forEach(subCat => {
      data2.forEach(cat2 => {
        if (subCat.id === cat2.id) {
          subCat.subCategories = cat2.sub_categories
        }
      })
    })
  })
  return data1
}

function dynamicSort(property) {
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {

    var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  }
}


module.exports = {


  async getfooter(ctx) {
    let store = []
    let result = []
    let contacts = []
    let konto = []
    let menuitem = []
    let entity4 = await strapi.services['dpab-store'].find()
    entity4.map((el) => {
      store.push({ id: el.id, title: el.title, value1: el.value_1, value2: el.value_2 })
    })
    let entity3 = await strapi.services['menu-item'].find()
    entity3.map((el) => {
      menuitem.push({ id: el.id, name: el.item_name })
    })
    let entity2 = await strapi.services['mein-konto'].find()
    entity2.map((el) => {
      konto.push({ id: el.id, title: el.title })
    })
    let entity = await strapi.services.contact.find()
    entity.map((el) => {
      contacts.push({ id: el.id, title: el.title, value: el.value })
    })
    result.push(store)
    result.push(konto)
    result.push(menuitem)
    result.push(contacts)
    return result
  },

  async findMenuItem(ctx) {
    let entities1;
    entities1 = await strapi.services['menu-item'].find(ctx.query);
    let res1 = entities1.map(entity => sanitizeEntity(entity, { model: strapi.models['menu-item'] }));
    let entities2;
    entities2 = await strapi.services.category.find(ctx.query);
    let res2 = entities2.map(entity => sanitizeEntity(entity, { model: strapi.models.category }));
    return e(res1, res2).sort(dynamicSort("position"));

  },

};




