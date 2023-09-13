-- CreateTable
CREATE TABLE "AuthRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "groceryCardNo" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "AuthRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "rank" TEXT NOT NULL,
    "groceryCardNo" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthRequest_email_key" ON "AuthRequest"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
