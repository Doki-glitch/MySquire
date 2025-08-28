import { Alcance, PrismaClient, Recarga } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const armamentoSchema = z.object({
     nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    danoMin: z.number().int(
        { message: "O dano mínimo deve possuir apenas numeros inteiros positivos e valor maior do que  zero" }).gte(1),
    danoMax: z.number().int(
            { message: "o dano máximo deve possuir apenas numeros inteiros positivos e valor pode chegar até 100" }).nonnegative().lte(100),
    habilidade: z.string(
                { message: "A habilidade deve possuir só caractere string e no mínimo 2 de caractere" }).min(2),
    alcance: z.nativeEnum(Alcance),
    carregador: z.number().gte(1).nonnegative().optional(),
    recarga: z.nativeEnum(Recarga).optional(),
    cadencia: z.number().int().gte(1).optional(),
    personagemId: z.number().int().nonnegative(
        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const armamentos = await prisma.armamento.findMany({
        include: {
        personagem: true,
        caracteristica: true,
        requerimento: true,
        penalidade: true,
       }
        })
        res.status(200).json(armamentos)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = armamentoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, danoMin, danoMax, habilidade, alcance, carregador,
            recarga, cadencia,  personagemId } = valida.data

    try {
      const armamento = await prisma.armamento.create({
        data: {
            nome, danoMin, danoMax, habilidade, alcance, carregador,
            recarga, cadencia, personagemId
        }
      })
      res.status(201).json(armamento)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const armamento = await prisma.armamento.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(armamento)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = armamentoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, danoMin, danoMax, habilidade, alcance, carregador,
        recarga, cadencia, personagemId } = valida.data

    try {
        const armamento = await prisma.armamento.update({
            where: { id: Number(id)},
            data: {
                nome, danoMin, danoMax, habilidade, alcance, carregador,
            recarga, cadencia, personagemId
            }
        })
        res.status(200).json(armamento)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router