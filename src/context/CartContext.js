import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { db } from '../firebase';
import { collection, addDoc, doc, deleteDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  
  const fetchCartData = async (userId) => {
    try {
      console.log(`Fetching cart data for user: ${userId}`);
      const q = query(collection(db, 'cart'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      const cartData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched cart data:", cartData);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart data: ', error);
    }
  };
  

  const addToCart = async (item, userId) => {
    try {
      console.log("Adding item to cart:", item);
      const itemRef = collection(db, 'cart');
      const existingItemQuery = query(itemRef, where('userId', '==', userId), where('title', '==', item.title));
      const existingItemSnapshot = await getDocs(existingItemQuery);
      if (!existingItemSnapshot.empty) {
        existingItemSnapshot.forEach(async (cartItem) => {
          const cartItemRef = doc(db, 'cart', cartItem.id);
          await updateDoc(cartItemRef, { quantity: cartItem.data().quantity + 1 });
        });
      } else {
        await addDoc(itemRef, { ...item, quantity: 1, userId });
      }
      fetchCartData(userId);
    } catch (error) {
      console.error('Error adding item to cart: ', error);
    }
  };

  const incrementQuantity = async (id, userId) => {
    const itemRef = collection(db, 'cart');
    const itemQuery = query(itemRef, where('userId', '==', userId), where('id', '==', id));
    const itemSnapshot = await getDocs(itemQuery);
    itemSnapshot.forEach(async (cartItem) => {
      const cartItemRef = doc(db, 'cart', cartItem.id);
      await updateDoc(cartItemRef, { quantity: cartItem.data().quantity + 1 });
    });
    fetchCartData(userId);
  };

  const decrementQuantity = async (id, userId) => {
    const itemRef = collection(db, 'cart');
    const itemQuery = query(itemRef, where('userId', '==', userId), where('id', '==', id));
    const itemSnapshot = await getDocs(itemQuery);
    itemSnapshot.forEach(async (cartItem) => {
      const cartItemRef = doc(db, 'cart', cartItem.id);
      if (cartItem.data().quantity > 1) {
        await updateDoc(cartItemRef, { quantity: cartItem.data().quantity - 1 });
      }
    });
    fetchCartData(userId);
  };

  const removeFromCart = async (id, userId) => {
    try {
      const itemRef = collection(db, 'cart');
      const itemQuery = query(itemRef, where('userId', '==', userId), where('id', '==', id));
      const itemSnapshot = await getDocs(itemQuery);
      itemSnapshot.forEach(async (cartItem) => {
        const cartItemRef = doc(db, 'cart', cartItem.id);
        await deleteDoc(cartItemRef);
      });
      fetchCartData(userId);
    } catch (error) {
      console.error('Error removing item from cart: ', error);
    }
  };

  const clearCart = async (userId) => {
    const itemRef = collection(db, 'cart');
    const cartQuery = query(itemRef, where('userId', '==', userId));
    const cartSnapshot = await getDocs(cartQuery);
    cartSnapshot.forEach(async (cartItem) => {
      const cartItemRef = doc(db, 'cart', cartItem.id);
      await deleteDoc(cartItemRef);
    });
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + parseInt(item.price) * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart, getCartTotal, fetchCartData }}>
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
