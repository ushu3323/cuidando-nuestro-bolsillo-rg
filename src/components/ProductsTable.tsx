import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { api } from "../utils/api";

export default function ProductsTable() {
  const { data, isLoading } = api.post.getAll.useQuery();
  type Product = NonNullable<typeof data>[number];

  return (
    <>
      {data && (
        <DataTable value={data} loading={isLoading}>
          <Column field="product.name" header="Producto"></Column>
          <Column
            field="price"
            header="Precio"
            body={(product: Product) =>
              product.price.toNumber().toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })
            }
          ></Column>
          <Column field="commerce.name" header="Comercio"></Column>
          <Column
            field="publishDate"
            header="Fecha publicación"
            body={(product: Product) =>
              product.publishDate.toLocaleString("es-AR", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            }
          ></Column>
        </DataTable>
      )}
    </>
  );
}
