import { Prisma } from "@prisma/client";

const offerWithProductAndCommerce = Prisma.validator<Prisma.OfferDefaultArgs>()(
  {
    select: {
      id: true,
      product: true,
      commerce: true,
      authorUID: true,
      price: true,
      publishDate: true,
    },
  },
);
type OfferWithProductAndCommerce = Prisma.OfferGetPayload<
  typeof offerWithProductAndCommerce
>;

// TODO: Replace `Offer` with Post model
export type Post = OfferWithProductAndCommerce & { image?: string };

export const posts: Post[] = [
  {
    id: "uhfeh9wfe7efw7yfey-sadsd24ew3fw3saijo-43uefhu2r3r3wr",
    product: {
      id: "1010101010",
      name: "Maple de huevos del nuevo amanecer",
      categoryId: "",
    },
    commerce: {
      id: new Date().getTime().toString(),
      name: "La Anonima",
      address: "An address",
      observations: "",
    },
    authorUID: "",
    price: new Prisma.Decimal(4000),
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    publishDate: new Date(),
  },
  {
    id: "uhfeh9wfe7efw7yfey-sadsd24ew3fw3saijo-reoiwuroweiruds",
    product: {
      id: "1010101010",
      name: "Manzana x KG",
      categoryId: "",
    },
    commerce: {
      id: new Date().getTime().toString(),
      name: "La Anonima",
      address: "Calle Blue 244",
      observations: "",
    },
    authorUID: "",
    price: new Prisma.Decimal(4000),
    publishDate: new Date(),
    image:
      "https://images.unsplash.com/photo-1589217157232-464b505b197f?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uhfeh9wfe7efw7yfey-sadsd24ew3fw3saijo-dowijdoiwajdaw",
    product: {
      id: "1010101010",
      name: "Pera x KG",
      categoryId: "",
    },
    commerce: {
      id: new Date().getTime().toString(),
      name: "La Anonima",
      address: "An address",
      observations: "",
    },
    authorUID: "",
    price: new Prisma.Decimal(4000),
    publishDate: new Date(),
    image:
      "https://images.unsplash.com/photo-1589217157232-464b505b197f?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "uhfeh9wfe7efw7yfey-sadsd24ew3fw3saijo-dowijdoiw242ajdaw",
    product: {
      id: "1010101010",
      name: "Papa x Kg",
      categoryId: "",
    },
    commerce: {
      id: new Date().getTime().toString(),
      name: "La Anonima",
      address: "An address",
      observations: "",
    },
    authorUID: "",
    price: new Prisma.Decimal(4000),
    publishDate: new Date(),
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
