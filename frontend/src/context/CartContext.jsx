import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext();

const initialState = {
    cartItems: JSON.parse(localStorage.getItem('cartItems')) || [],
};

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const item = action.payload;
            const existItem = state.cartItems.find((x) => x.product === item.product);

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) =>
                        x.product === existItem.product ? item : x
                    ),
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.product !== action.payload),
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cartItems: [],
            };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    }, [state.cartItems]);

    const addToCart = (product, qty) => {
        // If qty is provided as second arg, use it. 
        // Otherwise check if product object has it.
        const finalQty = qty !== undefined ? qty : (product.qty || 1);

        const cartItem = {
            product: product.product || product._id || product.id,
            name: product.name || product.title,
            image: product.image || (product.images && product.images[0]) || product.thumbnail,
            price: product.price,
            countInStock: product.countInStock || product.stock,
            qty: finalQty,
        };

        dispatch({
            type: 'ADD_TO_CART',
            payload: cartItem,
        });
    };

    const removeFromCart = (id) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    return (
        <CartContext.Provider value={{ ...state, addToCart, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
