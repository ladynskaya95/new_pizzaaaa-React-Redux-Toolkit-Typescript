import React from 'react';
import qs from "qs";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from 'react-router-dom';

import { setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import {fetchPizzas} from "../redux/slices/pizzaSlice";
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination"
import {selectPizzaData} from "../redux/slices/pizzaSlice"
import { selectFilter } from "../redux/slices/filterSlice";
import { sortList } from "../components/Sort"

const  Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  
 const onChangeCategory = (id) => {
  dispatch(setCategoryId(id))
 };

 const onChangePage = (page) => {
  dispatch(setCurrentPage(page))
 };

 const getPizzas = async () => {

   const sortBy = sort.sortProperty.replace("-", "");
   const order = sort.sortProperty.includes("-") ? "asc" : "desc";
   const search = searchValue ;
   const category = categoryId > 0 ? `category=${categoryId}` : "";

   dispatch(
     fetchPizzas({
       sortBy,
       order,
       search,
       category,
       currentPage,
     })
   );
   window.scrollTo(0, 0);
 };

 React.useEffect(() => {
   if (window.location.search) {
     const params = qs.parse(window.location.search.substring(1));
     const sort = sortList.find(
       (obj) => obj.sortProperty === params.sortProperty
     );

     dispatch(
       setFilters({
         ...params,
         sort,
       })
     );
   }
 }, [categoryId, sort.sortProperty, searchValue, currentPage]);


  React.useEffect(() => {
    if (isMounted.current) {
      const params = {
        categoryId: categoryId > 0 ? categoryId : null,
        sortProperty: sort.sortProperty,
        currentPage,
      };

      const queryString = qs.stringify(params, { skipNulls: true });

      navigate(`/?${queryString}`);
    }

     isMounted.current = true;

    if (window.location.search) {
      getPizzas();
    }
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);



const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

 const pizzas = items.map((obj) => (<Link  key={obj.id} to={`/pizza/${obj.id}`}
 ><PizzaBlock {...obj} /></Link>));

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      {status === "error" ? (
        <div className="error-info">
          <h2> Корзина пустая 😟</h2>
          <p>
            Вероятней всего, вы не заказывали еще пиццу. Для того, чтобы
            заказать, перейди на главную страницу
          </p>
        </div>
      ) : (
        <div className="content__items">
          {status === "loading" ? skeletons : pizzas}
        </div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
}


export default Home;