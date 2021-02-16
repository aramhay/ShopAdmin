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


module.exports = {
  // async findMenuItem(ctx) {
  //     const knex = strapi.connections.default;
  //     // const { id } = ctx.params;
  //     const item = await  knex.from('menu_items')
  //         .leftJoin('menu_items__categories', 'menu_items.id', 'menu_items__categories.menu_item_id')
  //         .leftJoin('categories', 'menu_items__categories.category_id', 'menu_items.id')
  //         .leftJoin('sub_categories', 'menu_items__categories.category_id', 'menu_items.id')
  //     // item.map()
  //     return item
  // },

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


    return e(res1, res2)
  },

};




