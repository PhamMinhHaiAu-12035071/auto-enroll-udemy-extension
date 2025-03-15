import { useState, useEffect } from 'react';
import { IRootStore, getStoreAsync } from '../models/RootStore';

export const useAsyncStore = () => {
    const [store, setStore] = useState<IRootStore | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initStore = async () => {
            try {
                const initializedStore = await getStoreAsync();
                setStore(initializedStore);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to initialize store'));
                console.error('Store initialization failed:', err);
            } finally {
                setIsLoading(false);
            }
        };

        initStore();
    }, []);

    return { store, isLoading, error };
}; 