import { Tabs } from 'antd';
import { useSelector } from "react-redux";
import Link from 'next/link';

const CategoryMenu = () => {
  const allCategories = useSelector(state => state.categories.allCategories)

  return(
    <>
      <Tabs 
        tabBarGutter={10}
        tabPosition="left" 
        defaultActiveKey="1" 
        className="category-item-navbar-tabs-left" 
      >
        {allCategories.map(category => (
          <Tabs.TabPane tab={category.name_category} key={category.id_category}>
            <div className="westeros-c-column-container">
              {category.sub_categories.map(sub => (
                <div className="westeros-c-column-container_item" key={sub.id_sub_category}>
                  <b className="fs-14">{sub.name_sub_category}</b>
                  {sub.item_sub_categories.map(item => (
                    <p className="m-b-3 text-dark" key={item.id_item_sub_category}>
                      <Link href="/products" as="/products">
                        <a className="text-reset"> {item.name_item_sub_category} </a>
                      </Link>
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
