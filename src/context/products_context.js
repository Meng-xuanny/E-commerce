import axios from "axios";
import React, { useContext, useEffect } from "react";
import useCaseReducers from "use-case-reducers";
import { products_url as url } from "../utils/constants";

const initialState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: {},
};

const caseReducers = {
  openSidebar: (state) => {
    state.isSidebarOpen = true;
  },
  closeSidebar: (state) => {
    state.isSidebarOpen = false;
  },
  setLoading: (state) => {
    state.products_loading = true;
  },
  setProducts: (state, data) => {
    state.products_loading = false;
    const featured = data.filter((product) => product.featured === true);
    state.featured_products = featured;
    state.products = data;
  },
  setError: (state) => {
    state.products_error = true;
  },
  setSingleProductBegin: (state) => {
    state.single_product_loading = true;
    state.single_product_error = false;
  },
  setSingleProductFinish: (state, data) => {
    state.single_product_loading = false;
    state.single_product = data;
  },
  setSingleProductError: (state) => {
    state.single_product_loading = false;
    state.single_product_error = true;
  },
};

const ProductsContext = React.createContext();

export const ProductsProvider = ({ children }) => {
  const [
    state,
    dispatch,
    {
      openSidebar,
      closeSidebar,
      setLoading,
      setProducts,
      setError,
      setSingleProductBegin,
      setSingleProductFinish,
      setSingleProductError,
    },
  ] = useCaseReducers(caseReducers, initialState);

  const fetchProducts = async (url) => {
    dispatch(setLoading());
    try {
      const res = await axios(url);
      const products = res.data;
      dispatch(setProducts(products));
    } catch (error) {
      dispatch(setError());
    }
  };

  const fetchSingleProduct = async (url) => {
    dispatch(setSingleProductBegin());
    try {
      const res = await axios(url);
      const product = res.data;
      dispatch(setSingleProductFinish(product));
    } catch (error) {
      dispatch(setSingleProductError());
    }
  };

  useEffect(() => {
    fetchProducts(url);
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        openSidebar,
        closeSidebar,
        dispatch,
        ...state,
        fetchSingleProduct,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};
// make sure use
export const useProductsContext = () => {
  return useContext(ProductsContext);
};
