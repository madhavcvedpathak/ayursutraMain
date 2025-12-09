
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, increment, query, orderBy } from 'firebase/firestore';

export interface InventoryItem {
    id: string;
    name: string;
    type: 'Oil' | 'Medicine' | 'Consumable';
    stockLevel: number; // in ml or count
    unit: string;
    lowStockThreshold: number;
    lastRestocked?: string;
}

export const InventoryService = {
    // 1. Fetch All Inventory
    getAllItems: async (): Promise<InventoryItem[]> => {
        try {
            const q = query(collection(db, 'inventory'), orderBy('name'));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
        } catch (error) {
            console.error("Error fetching inventory", error);
            return [];
        }
    },

    // 2. Add New Item (Seed)
    addItem: async (item: Omit<InventoryItem, 'id'>) => {
        return await addDoc(collection(db, 'inventory'), item);
    },

    // 3. Consume Stock (Deduct)
    consumeStock: async (itemId: string, amount: number) => {
        const itemRef = doc(db, 'inventory', itemId);
        await updateDoc(itemRef, {
            stockLevel: increment(-amount)
        });
    },

    // 4. Restock (Add)
    restock: async (itemId: string, amount: number) => {
        const itemRef = doc(db, 'inventory', itemId);
        await updateDoc(itemRef, {
            stockLevel: increment(amount),
            lastRestocked: new Date().toISOString()
        });
    },

    // 5. Seed Initial Data (Helper)
    seedInitialInventory: async () => {
        const initialItems: Omit<InventoryItem, 'id'>[] = [
            { name: 'Mahanarayan Taila', type: 'Oil', stockLevel: 5000, unit: 'ml', lowStockThreshold: 1000 },
            { name: 'Dhanwantharam Taila', type: 'Oil', stockLevel: 3000, unit: 'ml', lowStockThreshold: 500 },
            { name: 'Ksheerabala 101', type: 'Medicine', stockLevel: 50, unit: 'capsules', lowStockThreshold: 10 },
            { name: 'Nasya Oil (Anu Taila)', type: 'Oil', stockLevel: 200, unit: 'ml', lowStockThreshold: 50 },
            { name: 'Triphala Churna', type: 'Medicine', stockLevel: 2000, unit: 'g', lowStockThreshold: 200 },
        ];

        for (const item of initialItems) {
            await addDoc(collection(db, 'inventory'), item);
        }
    }
};
