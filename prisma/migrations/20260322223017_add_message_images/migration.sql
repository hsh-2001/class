ALTER TABLE "messages"
ADD COLUMN "image_url" TEXT,
ALTER COLUMN "content" SET DEFAULT '';
