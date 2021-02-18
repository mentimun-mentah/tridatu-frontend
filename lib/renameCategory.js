import _ from "lodash"

const renameCategory = (listCategory) => {
  let categories = _.cloneDeep(listCategory)
  categories = categories.filter(d => d.sub_categories.length > 0)
  categories.forEach(category => {
    category.key = category.categories_id+"-"+category.categories_id
    category.title = category.categories_name
    category.children = category.sub_categories
    delete category.categories_id
    delete category.categories_name
    delete category.sub_categories

    category.children = category.children.filter(d => d.item_sub_categories.length > 0)
    category && category.children && category.children.length > 0 && category.children.forEach(sub => {
      sub.key = sub.sub_categories_id+"-"+category.key
      sub.title = sub.sub_categories_name
      sub.children = sub.item_sub_categories

      delete sub.sub_categories_id
      delete sub.sub_categories_name
      delete sub.item_sub_categories

      sub && sub.children && sub.children.forEach(item => {
        item.key = item.item_sub_categories_id.toString()
        item.title = item.item_sub_categories_name
        delete item.item_sub_categories_id
        delete item.item_sub_categories_name
      })
    })
  })
  return categories
}

export default renameCategory
