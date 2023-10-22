import { DataScroller } from "primereact/datascroller";
import { ProgressSpinner } from "primereact/progressspinner";
import { Ripple } from "primereact/ripple";
import { api, type RouterOutputs } from "~/utils/api";

export default function ProductsList() {
  const { data: offers, isLoading } = api.offer.getDaily.useQuery();

  const offerItemTemplate = (o: RouterOutputs["offer"]["getDaily"][number]) => {
    return (
      <article className="p-ripple p-card select-none bg-gray-100 px-4 py-2 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center opacity-70">
              <i className="pi pi-clock me-2"></i>
              <p className="my-1">
                {o.publishDate.toLocaleString(undefined, {
                  dateStyle: "full",
                })}
              </p>
            </div>
            <h3 className="my-2">{o.brandedProduct.product.name}</h3>
            <p className="my-2">{o.brandedProduct.brand.name}</p>
          </div>
          <span className="font-bold">${o.price.toFixed(2)}</span>
        </div>
        <Ripple />
      </article>
    );
  };

  if (isLoading) {
    return (
      <div className="flex grow flex-col justify-center">
        <ProgressSpinner></ProgressSpinner>
      </div>
    );
  }

  return (
    <DataScroller
      value={offers}
      buffer={0.5}
      rows={5}
      itemTemplate={offerItemTemplate}
      pt={{
        list: { className: "flex flex-col gap-5 py-4 px-2" },
      }}
    ></DataScroller>
  );
}
