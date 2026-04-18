-- NOTE: Rewritten for PostgreSQL (original was generated with SQLite provider).
-- Adds variantId column to product_images (previously missing from schema)
ALTER TABLE "product_images" ADD COLUMN "variantId" TEXT;

ALTER TABLE "product_images"
  ADD CONSTRAINT "product_images_variantId_fkey"
  FOREIGN KEY ("variantId") REFERENCES "product_variants" ("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
