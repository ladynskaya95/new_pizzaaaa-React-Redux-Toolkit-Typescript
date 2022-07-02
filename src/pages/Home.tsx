import React from 'react';
import qs from "qs";
import { useSelector} from "react-redux";
import { useNavigate} from 'react-router-dom';

import { useAppDispatch } from "../redux/store";
import {  setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import {fetchPizzas, SearchPizzaParams} from "../redux/slices/pizzaSlice";
import Categories from "../components/Categories";
import SortPopup from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination"
import {selectPizzaData} from "../redux/slices/pizzaSlice"
import { selectFilter } from "../redux/slices/filterSlice";
import { sortList } from "../components/Sort"

const Home: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage, searchValue } = useSelector(selectFilter);
  const { items, status } = useSelector(selectPizzaData);

  
 const onChangeCategory = (idx: number) => {
  dispatch(setCategoryId(idx))
 };

 const onChangePage = (page: number) => {
  dispatch(setCurrentPage(page))
 };

 const getPizzas = async () => {

   const sortBy = sort.sortProperty.replace("-", "");
   const order = sort.sortProperty.includes("-") ? "asc" : "desc";
   const search = searchValue ? `&search=${searchValue}` : "";
   const category = categoryId > 0 ? `category=${categoryId}` : "";

   dispatch(
     fetchPizzas({
       sortBy,
       order,
       search,
       category,
       currentPage: String(currentPage),
     })
   );
   window.scrollTo(0, 0);
 };

 
  // React.useEffect(() => {
  //   if (isMounted.current) {
  //     const params = {
  //       categoryId: categoryId > 0 ? categoryId : null,
  //       sortProperty: sort.sortProperty,
  //       currentPage,
  //     };

  //     const queryString = qs.stringify(params, { skipNulls: true });

  //     navigate(`/?${queryString}`);
  //   }

  //   if (!window.location.search) {
  //     dispatch(fetchPizzas({} as SearchPizzaParams));
  //   }
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  React.useEffect(() => {
    getPizzas();
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse
  //      ( window.location.search.substring(1)) as unknown as SearchPizzaParams
  //     const sort = sortList.find(
  //       (obj) => obj.sortProperty === params.sortBy
  //     );  
  //     dispatch(
  //       setFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || sortList[0],
  //       })
  //     );
  //   }
  //   isMounted.current = true;
  // }, [categoryId, sort.sortProperty, searchValue, currentPage]);



const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

 const pizzas = items.map((obj: any) => <PizzaBlock {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <SortPopup />
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