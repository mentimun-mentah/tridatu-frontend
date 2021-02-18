import { Tabs } from 'antd';
import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";

import renameCategory from "lib/renameCategory"

const CategoryMenu = () => {
  const allCategories = useSelector(state => state.categories.allCategories)

  const [categoryList, setCategoryList] = useState(renameCategory(allCategories))

  useEffect(() => {
    setCategoryList(renameCategory(allCategories))
  }, [allCategories])

  return(
    <>
      <Tabs 
        tabBarGutter={10}
        tabPosition="left" 
        defaultActiveKey="1" 
        className="category-item-navbar-tabs-left" 
      >
        {categoryList.map(category => (
          <Tabs.TabPane tab={category.title} key={category.key}>
            <div className="westeros-c-column-container">
              {category.children.map(sub => (
                <div className="westeros-c-column-container_item" key={sub.key}>
                  <b className="fs-14">{sub.title}</b>
                  {sub.children.map(item => (
                    <p className="m-b-3 text-dark" key={item.key}>
                      <a 
                        className="text-reset"
                        href={`/products?page=1&ck=${item.key}&cn=${item.title}&item_sub_cat=${item.key}`}
                      > 
                        {item.title} 
                      </a>
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  )
}

export default CategoryMenu
