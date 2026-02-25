import { useState, useEffect } from 'react';
import { getShopInfo, saveShopInfo, ShopInfo } from '@/lib/shopSettings';

export function useShopInfo(): [ShopInfo, (info: Partial<ShopInfo>) => void] {
  const [info, setInfo] = useState<ShopInfo>(getShopInfo);

  useEffect(() => {
    const onStorage = () => setInfo(getShopInfo());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = (next: Partial<ShopInfo>) => {
    saveShopInfo(next);
    setInfo(getShopInfo());
  };

  return [info, update];
}
