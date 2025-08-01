-- CreateTable
CREATE TABLE "Evento" (
    "id" SERIAL NOT NULL,
    "nome_evento" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "template_url" TEXT NOT NULL,
    "campo_extra_label" TEXT,
    "foto_x" INTEGER NOT NULL,
    "foto_y" INTEGER NOT NULL,
    "foto_width" INTEGER NOT NULL,
    "foto_height" INTEGER NOT NULL,
    "nome_x" INTEGER NOT NULL,
    "nome_y" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participacao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "empresa" TEXT NOT NULL,
    "campo_extra_valor" TEXT,
    "foto_url" TEXT NOT NULL,
    "card_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evento_id" INTEGER NOT NULL,

    CONSTRAINT "Participacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Evento_slug_key" ON "Evento"("slug");

-- AddForeignKey
ALTER TABLE "Participacao" ADD CONSTRAINT "Participacao_evento_id_fkey" FOREIGN KEY ("evento_id") REFERENCES "Evento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
