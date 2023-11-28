// @ts-check

const {
  PrismaClient,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Prisma,
  // eslint-disable-next-line @typescript-eslint/no-var-requires
} = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * @alias {import('@prisma/client').Prisma} Prisma
 */

/**
 * @function
 * @template {Record<string, Prisma.CommerceCreateWithoutOffersInput>} InputType
 * @param {InputType} input
 * @returns {Promise<Record<keyof InputType, Prisma.$CommercePayload['scalars']>>}
 */
async function createCommerces(input) {
  /** @type {Record<keyof InputType, any>} */
  const createdCommerces = { ...input };

  for (let key in input) {
    const data = input[key];

    let result = await prisma.commerce.findFirst({
      where: {
        name: data.name,
        address: data.address,
      },
    });

    if (!result) {
      result = await prisma.commerce.create({
        data: data,
      });
    }

    createdCommerces[key] = result;
  }

  return /** @type {Record<keyof InputType, Prisma.$CommercePayload['scalars']>} */ (
    createdCommerces
  );
}

/**
 * @template {Record<string, Prisma.CategoryCreateWithoutProductInput>} InputType
 * @param {InputType} input
 * @returns {Promise<Record<keyof InputType, Prisma.$CategoryPayload['scalars']>>}
 */
async function createCategories(input) {
  /** @type {Record<keyof InputType, any>} */
  const createdCategories = { ...input };

  for (const key in input) {
    const data = input[key];
    let result = await prisma.category.upsert({
      where: { name: data.name },
      update: {},
      create: {
        name: data.name,
      },
    });

    createdCategories[key] = result;
  }

  return /** @type {Record<keyof InputType, Prisma.$CategoryPayload['scalars']>} */ (
    createdCategories
  );
}

/**
 * @function
 * @template {Record<string, Prisma.ProductCreateWithoutOffersInput & {category: Prisma.$CategoryPayload['scalars']}>} InputType
 * @param {InputType} input
 * @returns {Promise<Record<keyof InputType, Prisma.$ProductPayload['scalars']>>}
 */
async function createProducts(input) {
  /** @type {Record<keyof InputType, any>} */
  const createdProducts = { ...input };

  for (const key in input) {
    const data = input[key];
    let result = await prisma.product.upsert({
      where: { name: data.name },
      update: {
        name: data.name,
        category: {
          connect: { id: data.category.id },
        },
      },
      create: {
        name: data.name,
        category: {
          connectOrCreate: {
            where: { id: data.category.id, name: data.category.name },
            create: { name: data.category.name },
          },
        },
      },
    });

    createdProducts[key] = result;
  }
  return /** @type {} */ createdProducts;
}

async function main() {
  const Commerces = await createCommerces({
    BLUE: {
      name: "Comercio Blue",
      address: "Azul 115",
      observations: null,
    },
    NEW_BLUE: {
      name: "Comercio Blue",
      address: "Azulado 229",
      observations: "Nuevo, Cerca de la playa",
    },
    RED: {
      name: "Comercio Red",
      address: "Rojo 522",
      observations: null,
    },
    NEW_RED: {
      name: "Comercio Red",
      address: "Enrojado 933",
      observations: "Nuevo, Cerca de la rotonda",
    },
  });

  const Categories = await createCategories({
    INSUMOS: { name: "Insumos" },
    LACTEOS: { name: "Lacteos" },
  });

  const Products = await createProducts({
    MAPLE_HUEVOS: {
      name: "Maple de huevos",
      category: Categories.INSUMOS,
    },
    QUESO_CREMA: {
      name: "Queso Crema",
      category: Categories.LACTEOS,
    },
    LECHE_1L: {
      name: "Leche 1L",
      category: Categories.LACTEOS,
    },
  });

  await prisma.offer.createMany({
    data: [
      {
        commerceId: Commerces.BLUE.id,
        productId: Products.MAPLE_HUEVOS.id,
        price: 2500,
      },
      {
        commerceId: Commerces.RED.id,
        productId: Products.MAPLE_HUEVOS.id,
        price: 2250,
      },
      {
        commerceId: Commerces.NEW_BLUE.id,
        productId: Products.LECHE_1L.id,
        price: 716,
      },
      {
        commerceId: Commerces.NEW_RED.id,
        productId: Products.LECHE_1L.id,
        price: 800,
      },
    ],
  });

  await prisma.offer.findMany({
    include: {
      product: true,
      commerce: true,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
