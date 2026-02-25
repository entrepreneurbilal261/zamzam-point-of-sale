import { useEffect, useState, useCallback } from 'react';
import { localDatabase } from '@/lib/localDatabase';
import { menuData } from '@/data/menu';
import type { MenuCategory } from '@/data/menu';

export function useMenu() {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMenu = useCallback(async () => {
    setLoading(true);
    try {
      await localDatabase.init();
      const dbMenu = await localDatabase.getFullMenuFromDb();
      if (dbMenu.length > 0) {
        setMenu(dbMenu as MenuCategory[]);
      } else {
        await localDatabase.seedMenuFromDefault(menuData);
        setMenu(menuData);
      }
    } catch (e) {
      console.error('Failed to load menu:', e);
      setMenu(menuData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return { menu, loading, refreshMenu: loadMenu };
}
