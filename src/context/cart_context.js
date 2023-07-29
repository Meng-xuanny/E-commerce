import React, { useEffect, useContext } from "react";
import useCaseReducers from "use-case-reducers";

const getLocalCartItems = () => {
  let cartItems = localStorage.getItem("cart");
  if (cartItems) return JSON.parse(cartItems);
  else return [];
};
const initialState = {
  cart: getLocalCartItems(),
  total_items: 0,
  total_amount: 0,
  shipping_fee: 1000,
};

const caseReducers = {
  addToCart: (state, id, color, amount, product) => {
    const tempItem = state.cart.find((i) => i.id === id + color); //make a unique item by combing its id and color
    //the item is already in the cart
    if (tempItem) {
      //we want to change the amount
      const tempCart = state.cart.map((cartItem) => {
        if (cartItem.id === id + color) {
          let newAmount = cartItem.amount + amount;
          if (newAmount > cartItem.max) {
            newAmount = cartItem.max;
          }
          return { ...cartItem, amount: newAmount };
        } else {
          return cartItem;
        }
      });
      state.cart = tempCart;
    } // item isn't in the cart,make a new item
    else {
      const newItem = {
        id: id + color,
        name: product.name,
        color,
        amount,
        image: product.images[0].url,
        price: product.price,
        max: product.stock,
      };
      state.cart = [...state.cart, newItem]; //add the new item
    }
  },

  removeItem: (state, id) => {
    state.cart = state.cart.filter((item) => item.id !== id);
  },

  toggleAmount: (state, id, value) => {
    const tempCart = state.cart.map((item) => {
      if (item.id === id) {
        if (value === "inc") {
          let newAmount = item.amount + 1;
          if (newAmount > item.max) {
            newAmount = item.max;
          }
          return { ...item, amount: newAmount };
        }
        if (value === "dec") {
          let newAmount = item.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return { ...item, amount: newAmount };
        }
      }
      return item;
    });
    return { ...state, cart: tempCart };
  },

  clearCart: (state) => {
    state.cart = [];
  },
  // countCartTotals: (state) => {
  //   const { total_items, total_amount } = state.cart.reduce(
  //     (total, cartItem) => {
  //       //console.log(total);
  //       const { amount, price } = cartItem;
  //       total.total_items += amount;
  //       total.total_amount += price * amount;
  //       return total;
  //     },
  //     { total_items: 0, total_amount: 0 }
  //   );
  //   return { ...state, total_items, total_amount };
  // },
  countCartTotals: (state) => {
    let totalAmount = 0;
    let totalItems = 0;
    state.cart.forEach((cartItem) => {
      const { amount, price } = cartItem;
      totalItems += amount;
      totalAmount += price * amount;
    });
    state.total_items = totalItems;
    state.total_amount = totalAmount;
  },
};

const CartContext = React.createContext();

export const CartProvider = ({ children }) => {
  const [
    state,
    dispatch,
    { addToCart, removeItem, toggleAmount, clearCart, countCartTotals },
  ] = useCaseReducers(caseReducers, initialState);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.cart));
    dispatch(countCartTotals());
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        addToCart,
        removeItem,
        toggleAmount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
// make sure use
export const useCartContext = () => {
  return useContext(CartContext);
};
