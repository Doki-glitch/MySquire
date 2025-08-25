import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const periciaSchema = z.object({
    adestramento: z.number().int().lte(20).nonnegative(
        { message: "Adestramento deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    ranged: z.number().int().lte(20).nonnegative(
        { message: "Ranged deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    melee: z.number().int().lte(20).nonnegative(
        { message: "Melee deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    desarmado: z.number().int().lte(20).nonnegative(
            { message: "Desarmado deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    atuacao: z.number().int().lte(20).nonnegative(
            { message: "A atuação deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    furtividade: z.number().int().lte(20).nonnegative(
            { message: "A furtividade deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    historia: z.number().int().lte(20).nonnegative(
                { message: "A história deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    iniciativa: z.number().int().lte(20).nonnegative(
                { message: "A iniciativa deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    leitura: z.number().int().lte(20).nonnegative(
                { message: "A leitura deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    medicina: z.number().int().lte(20).nonnegative(
                    { message: "A medicina deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    mitologia: z.number().int().lte(20).nonnegative(
                        { message: "A  mitologia possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    negociacao: z.number().int().lte(20).nonnegative(
                        { message: "A negociação deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    persuasao: z.number().int().lte(20).nonnegative(
                            { message: "A persuasão deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    psicologia: z.number().int().lte(20).nonnegative(
                                { message: "A psicologia deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    teologia: z.number().int().lte(20).nonnegative(
                                    { message: "A teologia deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    personagemId: z.number().int().nonnegative(
                        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const pericias = await prisma.pericia.findMany({
        include: {
        personagem: true,
       }
        })
        res.status(200).json(pericias)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = periciaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { adestramento, ranged, melee, desarmado, atuacao, furtividade, historia,iniciativa, 
            leitura, medicina, mitologia, negociacao, persuasao, psicologia,
            teologia,  personagemId } = valida.data

    try {
      const pericia = await prisma.pericia.create({
        data: {
            adestramento, ranged, melee, desarmado, atuacao, furtividade, historia,iniciativa, 
            leitura, medicina, mitologia, negociacao, persuasao, psicologia, teologia,
            personagemId
        }
      })
      res.status(201).json(pericia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const pericia = await prisma.pericia.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(pericia)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

  
router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = periciaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { adestramento, ranged, melee, desarmado, atuacao, furtividade, historia,iniciativa, 
        leitura, medicina, mitologia, negociacao, persuasao, psicologia,
        teologia,  personagemId } = valida.data

    try {
        const pericia = await prisma.pericia.update({
            where: { id: Number(id)},
            data: {
                adestramento, ranged, melee, desarmado, atuacao, furtividade, historia,iniciativa, 
                leitura, medicina, mitologia, negociacao, persuasao, psicologia, teologia,
                personagemId
            }
        })
        res.status(200).json(pericia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router