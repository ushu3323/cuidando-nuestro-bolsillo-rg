INSERT INTO "Post"
SELECT "id", "productId", "commerceId", "price", "authorUID", "publishDate"
FROM "Offer"
