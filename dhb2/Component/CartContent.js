import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItemCount, setCartItemCount] = useState(0);

    const updateCartItemCount = (count) => {
        setCartItemCount(count);
    };

    return (
        <CartContext.Provider value={{ cartItemCount, updateCartItemCount }}>
            {children}
        </CartContext.Provider>
    );
};