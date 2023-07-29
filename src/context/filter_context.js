import React, { useEffect, useContext } from "react";
import useCaseReducers from "use-case-reducers";
import { useProductsContext } from "./products_context";

const initialState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: "price-lowest",
  filters: {
    text: "",
    company: "all",
    category: "all",
    color: "all",
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  },
};

const caseReducers = {
  loadProducts: (state, products) => {
    let maxPrice = products.map((product) => product.price);
    maxPrice = Math.max(...maxPrice);
    state.filtered_products = [...products];
    state.all_products = [...products];
    state.filters.max_price = maxPrice;
    state.filters.price = maxPrice;
  },
  setGridView: (state) => {
    state.grid_view = true;
  },
  setListView: (state) => {
    state.grid_view = false;
  },
  updateSort: (state, e) => {
    const value = e.target.value;
    state.sort = value;
  },
  sortProducts: (state) => {
    let tempProducts = [...state.filtered_products];

    if (state.sort === "price-lowest")
      tempProducts = tempProducts.sort((a, b) => a.price - b.price);

    if (state.sort === "price-highest")
      tempProducts = tempProducts.sort((a, b) => b.price - a.price);

    if (state.sort === "name-a")
      tempProducts = tempProducts.sort((a, b) => a.name.localeCompare(b.name));

    if (state.sort === "name-z")
      tempProducts = tempProducts.sort((a, b) => b.name.localeCompare(a.name));

    state.filtered_products = tempProducts;
  },
  updateFilters: (state, e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "category") value = e.target.textContent;
    if (name === "color") value = e.target.dataset.color;
    if (name === "price") value = Number(value);
    if (name === "shipping") value = e.target.checked;
    state.filters[name] = value;
  },
  filterProducts: (state) => {
    const { text, category, company, color, price, shipping } = state.filters;
    let tempProducts = [...state.all_products];
    //text search
    if (text) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().startsWith(text)
      );
    }
    //category
    if (category !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.category === category
      );
    }
    //company
    if (company !== "all") {
      tempProducts = tempProducts.filter(
        (product) => product.company === company
      );
    }
    //color
    if (color !== "all") {
      tempProducts = tempProducts.filter((product) =>
        product.colors.find((c) => c === color)
      );
    }
    //price

    tempProducts = tempProducts.filter((product) => product.price <= price);

    //shipping
    if (shipping) {
      tempProducts = tempProducts.filter(
        (product) => product.shipping === true
      );
    }

    state.filtered_products = tempProducts;
  },
  clearFilters: (state) => {
    state.filters.text = "";
    state.filters.company = "all";
    state.filters.category = "all";
    state.filters.color = "all";

    state.filters.price = state.filters.max_price;
    state.filters.shipping = false;
  },
};

const FilterContext = React.createContext();

export const FilterProvider = ({ children }) => {
  const [
    state,
    dispatch,
    {
      loadProducts,
      setGridView,
      setListView,
      updateSort,
      sortProducts,
      updateFilters,
      filterProducts,
      clearFilters,
    },
  ] = useCaseReducers(caseReducers, initialState);
  const { products } = useProductsContext();

  useEffect(() => {
    dispatch(loadProducts(products));
  }, [products]);

  useEffect(() => {
    dispatch(filterProducts());
    dispatch(sortProducts());
  }, [products, state.sort, state.filters]);

  return (
    <FilterContext.Provider
      value={{
        ...state,
        dispatch,
        setGridView,
        setListView,
        updateSort,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
// make sure use
export const useFilterContext = () => {
  return useContext(FilterContext);
};
