import { Peca, PrismaClient, Tamanho } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const armaduraSchema = z.object({
      nome: z.string(
             { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
         protecao: z.number().int(
             { message: "A proteção deve possuir apenas numeros inteiros positivos e valor maior do que  zero" }).gte(1),
         peca: z.nativeEnum(Peca),
         personagemId: z.number().int().nonnegative(
             { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
         equipado: z.boolean(),
         tamanho: z.nativeEnum(Tamanho),
         descricao: z.string().optional(),
})


router.get("/", async (req, res) => {
  try {
    const { personagemId } = req.query;

    // Se vier personagemId, converte para número
    const personagemIdNum = Number(req.query.personagemId);
    const filtro = !isNaN(personagemIdNum) && personagemIdNum > 0
  ? { personagemId: personagemIdNum }
  : {};

    const armaduras = await prisma.armadura.findMany({
      where: filtro,
      include: {
        caracteristicas: true,
      },
      orderBy: { id: "asc" },
    });

    res.status(200).json(armaduras);
  } catch (error) {
   res.status(500).json({ erro: error })
  }
});



router.post("/", async (req, res) => {

    const valida = armaduraSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, peca, personagemId, equipado, tamanho, descricao, protecao } = valida.data

    try {
      const armadura = await prisma.armadura.create({
        data: {
            nome, peca, protecao, personagemId, equipado, tamanho, descricao
        }
      })
      res.status(201).json(armadura)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const armadura = await prisma.armadura.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(armadura)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = armaduraSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, peca, personagemId, equipado, tamanho, descricao, protecao } = valida.data

    try {
        const armadura = await prisma.armadura.update({
            where: { id: Number(id)},
            data: {
                nome, peca, personagemId, equipado, tamanho, descricao, protecao
            }
        })
        res.status(200).json(armadura)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router