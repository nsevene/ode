import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore, CartItem } from '../../store/cartStore';

const mockItem1: Omit<CartItem, 'quantity'> = {
  id: '1',
  name: 'Margherita Pizza',
  price: 450,
  kitchen: 'Dolce Italia',
};

const mockItem2: Omit<CartItem, 'quantity'> = {
  id: '2',
  name: 'Pad Thai',
  price: 380,
  kitchen: 'Spicy Asia',
};

describe('useCartStore', () => {
  // Reset store before each test
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add a new item to the cart', () => {
    useCartStore.getState().addItem(mockItem1);
    const { items, totalItems, totalPrice } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0]).toEqual({ ...mockItem1, quantity: 1 });
    expect(totalItems).toBe(1);
    expect(totalPrice).toBe(450);
  });

  it('should increment quantity if item already exists', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().addItem(mockItem1);
    const { items, totalItems, totalPrice } = useCartStore.getState();

    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    expect(totalItems).toBe(2);
    expect(totalPrice).toBe(900);
  });

  it('should add multiple different items', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().addItem(mockItem2);
    const { items, totalItems, totalPrice } = useCartStore.getState();

    expect(items).toHaveLength(2);
    expect(totalItems).toBe(2);
    expect(totalPrice).toBe(830); // 450 + 380
  });

  it('should remove an item from the cart', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().removeItem('1');
    const { items, totalItems, totalPrice } = useCartStore.getState();

    expect(items).toHaveLength(0);
    expect(totalItems).toBe(0);
    expect(totalPrice).toBe(0);
  });

  it('should update item quantity', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().updateQuantity('1', 5);
    const { items, totalItems, totalPrice } = useCartStore.getState();

    expect(items[0].quantity).toBe(5);
    expect(totalItems).toBe(5);
    expect(totalPrice).toBe(2250); // 450 * 5
  });

  it('should remove item if quantity is updated to 0', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().updateQuantity('1', 0);
    const { items } = useCartStore.getState();

    expect(items).toHaveLength(0);
  });

  it('should increment item quantity', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().incrementItem('1');
    const { items } = useCartStore.getState();

    expect(items[0].quantity).toBe(2);
  });

  it('should decrement item quantity', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().incrementItem('1'); // quantity is 2
    useCartStore.getState().decrementItem('1');
    const { items } = useCartStore.getState();

    expect(items[0].quantity).toBe(1);
  });

  it('should remove item if decremented to 0', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().decrementItem('1');
    const { items } = useCartStore.getState();

    expect(items).toHaveLength(0);
  });

  it('should clear the entire cart', () => {
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().addItem(mockItem2);
    useCartStore.getState().clearCart();
    const { items, totalItems, totalPrice } = useCartStore.getState();

    expect(items).toHaveLength(0);
    expect(totalItems).toBe(0);
    expect(totalPrice).toBe(0);
  });

  it('should correctly calculate computed properties', () => {
    let state = useCartStore.getState();
    expect(state.isEmpty).toBe(true);

    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().addItem(mockItem1);
    useCartStore.getState().addItem(mockItem2);

    state = useCartStore.getState();
    expect(state.isEmpty).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.totalItems).toBe(3);
    expect(state.totalPrice).toBe(1280); // 450*2 + 380
  });

  it('should toggle cart visibility', () => {
    expect(useCartStore.getState().isOpen).toBe(false);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(true);
    useCartStore.getState().toggleCart();
    expect(useCartStore.getState().isOpen).toBe(false);
  });
});
