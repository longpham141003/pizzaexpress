// ponytail: single context file for cart, no external state lib
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pe-cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem('pe-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, size, qty) => {
    const key = `${product.id}-${size || 'default'}`;
    setItems(prev => {
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i);
      }
      const price = size
        ? product.variations?.find(v => v.size === size)?.price || product.simplePrice
        : product.simplePrice;
      return [...prev, { key, id: product.id, name: product.name, size, qty, price, image: product.image }];
    });
    setShowCart(true);
  };

  const removeFromCart = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const updateQty = (key, qty) => {
    if (qty < 1) return removeFromCart(key);
    setItems(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
  };
  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);
  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, totalItems, totalPrice, clearCart, showCart, setShowCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
