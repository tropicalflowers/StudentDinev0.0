-- CreateTable
CREATE TABLE "feedback" (
    "id" TEXT NOT NULL,
    "legacy_id" TEXT,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL DEFAULT 'Anonymous',
    "order_id" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "feedback_legacy_id_key" ON "feedback"("legacy_id");

-- CreateIndex
CREATE INDEX "feedback_user_id_idx" ON "feedback"("user_id");

-- CreateIndex
CREATE INDEX "feedback_order_id_idx" ON "feedback"("order_id");
