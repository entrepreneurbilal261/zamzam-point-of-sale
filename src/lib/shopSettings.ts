// Shop info: editable via Settings, stored in localStorage, fallback to default
import { shopInfo as defaultShop } from '@/data/menu';

const STORAGE_KEY = 'zamzam_shop_settings';

export interface ShopInfo {
  name: string;
  phone: string;
  address: string;
}

export function getShopInfo(): ShopInfo {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ShopInfo>;
      return {
        name: parsed.name ?? defaultShop.name,
        phone: parsed.phone ?? defaultShop.phone,
        address: parsed.address ?? defaultShop.address,
      };
    }
  } catch (_) {}
  return {
    name: defaultShop.name,
    phone: defaultShop.phone,
    address: defaultShop.address,
  };
}

export function saveShopInfo(info: Partial<ShopInfo>): void {
  const current = getShopInfo();
  const next = {
    name: info.name ?? current.name,
    phone: info.phone ?? current.phone,
    address: info.address ?? current.address,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
