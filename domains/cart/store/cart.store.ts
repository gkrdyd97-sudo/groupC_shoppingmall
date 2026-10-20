// domains/cart/store/cart.store.ts
import { create } from 'zustand';
import { MOCK_CART_ITEMS } from '@/shared/mocks/mockData';
import { type Cart } from '../types/Cart.types';

type CartState = {
    items: Cart[];
    changeQuantity: (id: number, type: 'plus' | 'minus') => void;
    removeItem: (id: number) => void;
    toggleItem: (id: number) => void;
    toggleAll: () => void;
    removeChecked: () => void;
};

export const useCartStore = create<CartState>()((set) => ({
    items: MOCK_CART_ITEMS,

    changeQuantity: (id, type) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id
                    ? {
                          ...item,
                          quantity:
                              type === 'plus'
                                  ? item.quantity + 1
                                  : Math.max(1, item.quantity - 1),
                      }
                    : item,
            ),
        })),

    removeItem: (id) =>
        set((state) => ({
            items: state.items.filter((item) => item.id !== id),
        })),

    toggleItem: (id) =>
        set((state) => ({
            items: state.items.map((item) =>
                item.id === id ? { ...item, check: !item.check } : item,
            ),
        })),

    toggleAll: () =>
        set((state) => {
            const allChecked =
                state.items.length > 0 && state.items.every((i) => i.check);
            return {
                items: state.items.map((i) => ({ ...i, check: !allChecked })),
            };
        }),

    removeChecked: () =>
        set((state) => ({
            items: state.items.filter((item) => !item.check),
        })),
}));
