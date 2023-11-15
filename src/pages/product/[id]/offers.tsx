import { useRouter } from "next/router";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { ProgressSpinner } from "primereact/progressspinner";
import { api } from "~/utils/api";

export default function ProductOffers() {
  const router = useRouter();

  const {
    data: brandedProduct,
    isLoading,
    error,
  } = api.product.getBrandedWithOffers.useQuery(
    {
      brandedProductId: router.query.id as string,
    },
    {
      retry(failureCount, error) {
        switch (error.data?.code) {
          case "NOT_FOUND":
          case "BAD_REQUEST":
            return false;
          default:
            return true;
        }
      },
    },
  );

  if (isLoading) {
    return (
      <div className="flex grow flex-col justify-center">
        <ProgressSpinner />
      </div>
    );
  }

  switch (error?.data?.code) {
    case "NOT_FOUND":
      return <div className="flex min-h-[100dvh]">El producto no existe</div>;
    case "BAD_REQUEST":
      return <div className="flex min-h-[100dvh]">BAD_REQUEST</div>;
    default:
      break;
  }

  const offers = brandedProduct?.offers.map((offer) => ({
    ...offer,
    price: offer.price.toNumber(),
  }));

  type Offer = NonNullable<typeof offers>[number];
  return (
    <div className="m-auto flex h-screen w-full flex-col sm:p-4 md:w-4/5 lg:max-w-2xl">
      <div className="flex flex-col">
        <div className="flex px-5 pt-5 sm:p-0">
          <Button
            icon={PrimeIcons.ARROW_LEFT}
            severity="secondary"
            onClick={() => router.back()}
            rounded
            text
          ></Button>
        </div>
        <div className="px-5 sm:p-0">
          <h1 className="text-2xl">
            {brandedProduct?.product.name} - {brandedProduct?.brand.name}
          </h1>
          <p className="opacity-60">Mostrando los ultimos precios publicados</p>
        </div>
      </div>
      <div className="overflow-y-scroll">
        <DataTable
          value={offers}
          sortField="price"
          sortOrder={1}
          removableSort
          size="small"
          pt={{
            headerRow: {
              className: "bg-zinc-300",
            },
          }}
          rowClassName={() => "even:bg-zinc-100"}
          cellClassName={() => "py-3 px-2"}
          scrollable
          scrollHeight="flex"
        >
          <Column
            field="commerce.name"
            header="Comercio"
            sortField="commerce.name"
            headerClassName=""
            bodyClassName="w-full"
            body={({ commerce }: Offer) => (
              <p className="m-0">
                {commerce.name}{" "}
                <span className="inline-block">({commerce.street})</span>
              </p>
            )}
            sortable
          ></Column>
          <Column
            field="publishDate"
            header="Fecha"
            align="right"
            bodyClassName="whitespace-nowrap"
            body={(
              offer: NonNullable<typeof brandedProduct>["offers"][number],
            ) => offer.publishDate.toLocaleDateString()}
            sortable
          ></Column>
          <Column
            field="price"
            filterField="price"
            sortField="price"
            header="Precio"
            align="right"
            bodyClassName="whitespace-nowrap"
            body={(offer: Offer) =>
              offer.price.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })
            }
            alignFrozen="right"
            frozen={true}
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
