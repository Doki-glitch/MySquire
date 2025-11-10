import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const equipamentoSchema = z.object({
     armadura: z.string().optional().nullable(),
     capacete: z.string().optional().nullable(),
     ombreira: z.string().optional().nullable(),
     capa: z.string().optional().nullable(), 
     luva: z.string().optional().nullable(),
     cinto: z.string().optional().nullable(),
     colar: z.string().optional().nullable(),
     anel1: z.string().optional().nullable(),
     anel2: z.string().optional().nullable(),
     armaMaoEsquerda: z.string().optional().nullable(),
     botas: z.string().optional().nullable(),
     armaMaoDireita: z.string().optional().nullable(),
     personagemId: z.number().int().nonnegative(
         { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

const patchSchema = z.object({
    slot: z.string().min(1, { message: "O nome do slot é obrigatório." }), 
    caminhoImagem: z.string().optional().nullable(), 
});

router.get("/:personagemId", async (req, res) => {
    const { personagemId } = req.params;
    
    try {
        const equipamento = await prisma.equipamentoCosmetico.findUnique({
            where: { personagemId: Number(personagemId) },
        });

        res.status(200).json(equipamento); 
    } catch (error) {
        console.error("Erro ao buscar equipamento cosmético:", error);
        res.status(500).json({ erro: "Erro ao buscar equipamento cosmético" });
    }
});

router.post("/", async (req, res) => {

    const valida = equipamentoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { armadura, capacete, ombreira, capa, luva, cinto, colar, anel1, anel2, armaMaoEsquerda, botas,
             armaMaoDireita, personagemId } = valida.data

    try {
      const equipamentocosmetico = await prisma.equipamentoCosmetico.create({
         data: {
             armadura, capacete, ombreira, capa, luva, cinto, colar, anel1, anel2, armaMaoEsquerda, botas,
             armaMaoDireita, personagemId 
         }
      })
      res.status(201).json(equipamentocosmetico)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = equipamentoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {  armadura, capacete, ombreira, capa, luva, cinto, colar, anel1, anel2, armaMaoEsquerda, botas,
              armaMaoDireita, personagemId  } = valida.data

    try {
        const equipamentocosmetico = await prisma.equipamentoCosmetico.update({
            where: { id: Number(id)},
            data: {
                armadura, capacete, ombreira, capa, luva, cinto, colar, anel1, anel2, armaMaoEsquerda, botas,
                armaMaoDireita, personagemId 
            }
        })
        res.status(200).json(equipamentocosmetico)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.patch("/:personagemId", async (req, res) => {
    const { personagemId } = req.params;
    const valida = patchSchema.safeParse(req.body);

    if (!valida.success) {
        return res.status(400).json({ erro: valida.error });
    }

    const { slot, caminhoImagem } = valida.data;
    const caminhoDoSlot = (caminhoImagem ?? '') === '' ? null : (caminhoImagem as string);
    const dataToUpdate: { [key: string]: string | null } = { [slot]: caminhoDoSlot };

    try {
        const equipamento = await prisma.equipamentoCosmetico.upsert({
            where: { personagemId: Number(personagemId) },
            update: dataToUpdate,
            create: {
                personagemId: Number(personagemId),
                ...dataToUpdate,
            },
        });

        res.status(200).json(equipamento);
    } catch (error) {
        console.error("Erro ao atualizar equipamento cosmético:", error);
        res.status(400).json({ erro: "Falha ao salvar o equipamento cosmético" });
    }
});

router.delete("/:id", async (req, res) => {
    const { id } = req.params
 
    try {
      const equipamentocosmetico = await prisma.equipamentoCosmetico.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(equipamentocosmetico)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
});

export default router