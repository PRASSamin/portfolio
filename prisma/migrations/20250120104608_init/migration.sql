-- CreateTable
CREATE TABLE "ChatInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatInvite_id_key" ON "ChatInvite"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatInvite_token_key" ON "ChatInvite"("token");
