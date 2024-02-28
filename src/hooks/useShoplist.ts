import { useContext } from "react";
import { ShoplistContext, type ShoplistItem } from "../providers/shoplistProvider";

type Shoplist = {
  data: readonly ShoplistItem[];
  add: (item: Omit<ShoplistItem, "done">) => void;
  remove: (postId: string) => void;
  setDone: (postId: string, done: boolean) => void;
};

export default function useShoplist(): Shoplist {
  const ctx = useContext(ShoplistContext);
  if (!ctx) {
    throw new Error("`useShoplist` must be wrapped in a <ShoplistProvider />");
  }

  const { data, setData } = ctx;

  const add = (item: Omit<ShoplistItem, "done">) => {
    // Check if exists
    if (data.find((x) => x.postId === item.postId)) {
      console.warn("Tried to add a shoplist item that already exists");
      return;
    }

    setData([...data, { ...item, done: false }]);
  };

  const remove = (postId: string) => {
    const index = data.findIndex((item) => item.postId === postId);
    if (index >= 0) {
      const newData = [...data];
      newData.splice(index, 1);
      setData(newData);
      return;
    }
    console.warn("Tried to remove an item that doesn't exists");
  };

  const setDone = (postId: string, value: boolean) => {
    const newData = [...data];
    const item = newData.find((item) => item.postId === postId)
    if (!item) {
      console.warn("Tried to update an item that doesn't exists");
      return
    }

    item.done = value;

    setData(newData)
  }

  return {
    data,
    add,
    remove,
    setDone,
  };
}
