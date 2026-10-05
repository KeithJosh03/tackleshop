'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, cartApi, AddToCartPayload } from '@/lib/api/cartService';

interface CartContextType {
    cart: Cart | null;
    isLoading: boolean;
    itemCount: number;
    fetchCart: () => Promise<void>;
    addToCart: (payload: AddToCartPayload) => Promise<boolean>;
    updateQuantity: (itemId: number, quantity: number) => Promise<boolean>;
    removeFromCart: (itemId: number) => Promise<boolean>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCart = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedCart = await cartApi.getCart();
            setCart(fetchedCart);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (payload: AddToCartPayload) => {
        try {
            const res = await cartApi.addToCart(payload);
            if (res?.status) {
                await fetchCart(); // Refresh cart data
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to add to cart:', error);
            return false;
        }
    };

    const updateQuantity = async (itemId: number, quantity: number) => {
        try {
            const res = await cartApi.updateQuantity(itemId, quantity);
            if (res?.status) {
                await fetchCart();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to update quantity:', error);
            return false;
        }
    };

    const removeFromCart = async (itemId: number) => {
        try {
            const res = await cartApi.removeItem(itemId);
            if (res?.status) {
                await fetchCart();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Failed to remove item:', error);
            return false;
        }
    };

    const itemCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            isLoading,
            itemCount,
            fetchCart,
            addToCart,
            updateQuantity,
            removeFromCart
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
