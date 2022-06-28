import React from 'react';
import qs from "qs";


import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';

import { setCategoryId, setCurrentPage, setFilters} from "../redux/slices/filterSlice";
import {fetchPizzas} from "../redux/slices/pizzaSlice";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination"

import { SearchContext } from "../App";
import { sortList } from "../components/Sort"

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isSearch = React.useRef(false);
  const isMounted = React.useRef(false);

  const { categoryId, sort, currentPage } = useSelector((state) => state.filter);
  const items = useSelector(
    (state) => state.pizza.items);

  const { searchValue} = React.useContext(SearchContext);
  
  const [isLoading, setIsLoading] = React.useState(true);
  
 const onChangeCategory = (id) => {
  dispatch(setCategoryId(id))
 };

 const onChangePage = (page) => {
  dispatch(setCurrentPage(page))
 };

 const getPizzas = async () => {
   setIsLoading(true);

   const sortBy = sort.sortProperty.replace("-", "");
   const order = sort.sortProperty.includes("-") ? "asc" : "desc";
   const search = searchValue ? `search=${searchValue}` : "";
   const category = categoryId > 0 ? `category=${categoryId}` : "";

   // await axios
   //   .get(
   //     `https://628e7a35368687f3e7179014.mockapi.io/items?page=${currentPage}&limit=8&${category}&sortBy=${sortBy}&order=desc&${search}`
   //   )
   //   .then((res) => {
   //     setItems(res.data);
   //     setIsLoading(false);
   //   });

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
     isSearch.current = true;
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

     navigate(`/?${queryString}`);}
   
   isMounted.current = true;
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);

   React.useEffect(() => {
    if (window.location.search) {
      getPizzas();
    }
    }, [categoryId, sort.sortProperty, searchValue, currentPage]);



const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

 const pizzas = items.map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onChangeCategory={onChangeCategory}
        />
        <Sort  />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination
      currentPage={currentPage}
      onChangePage={onChangePage}
      />
    </div>
  );
}


export default Home;