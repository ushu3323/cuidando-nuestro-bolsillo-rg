import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { z } from "zod";

const SHOPLIST_KEY = "precios-riogrande.shoplist";

const shopListItemSchema = z.object({
  postId: z.string().uuid(),
  product: z.object({
    name: z.string(),
    category: z.object({
      name: z.string(),
    }),
  }),
  commerce: z.object({
    name: z.string(),
    address: z.string(),
  }),
  price: z.number(),
  done: z.boolean(),
});

export type ShoplistItem = z.infer<typeof shopListItemSchema>;

const shoplistDataSchema = z.array(z.unknown()).transform((items) =>
  items.filter((item): item is ShoplistItem => {
    const result = shopListItemSchema.safeParse(item);
    if (!result.success) {
      console.error(result.error);
    }
    return result.success;
  }),
);

function initShoplistData() {
  const initialValue: ShoplistItem[] = [];
  localStorage.setItem(SHOPLIST_KEY, JSON.stringify(initialValue));
  return initialValue;
}

function getShoplistData(): ShoplistItem[] {
  const value = localStorage.getItem(SHOPLIST_KEY);
  if (value === null) {
    console.log("Shoplist not found on this device, initializing");
    return initShoplistData();
  }

  try {
    const json: unknown = JSON.parse(value);
    const list = shoplistDataSchema.parse(json);
    return list;
  } catch (error) {
    console.error(error);
    console.error("Fallback to initial value");
  }

  return initShoplistData();
}

function saveShoplistData(data: ShoplistItem[]) {
  localStorage.setItem(SHOPLIST_KEY, JSON.stringify(data));
}

interface ShoplistContextValue {
  data: readonly ShoplistItem[];
  setData: Dispatch<SetStateAction<ShoplistItem[]>>;
}

export const ShoplistContext = createContext<ShoplistContextValue | null>(null);

export default function ShoplistProvider({ children }: PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const [data, setData] = useState<ShoplistItem[]>([]);

  useEffect(() => {
    if (ready) {
      const shoplist = getShoplistData();
      setData(shoplist);
    }

    setReady(true);
    return () => setReady(false);
  }, [ready]);

  useEffect(() => {
    if (ready) {
      saveShoplistData(data);
    }
  }, [data]);

  return (
    <ShoplistContext.Provider value={{ data, setData }}>
      {children}
    </ShoplistContext.Provider>
  );
}
