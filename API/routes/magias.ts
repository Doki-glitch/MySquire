import {  Alvo, PrismaClient, Purifica, Subtipo, Tipo, TipoAlvo } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiaSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    custo: z.number(
        { message: "O custo só pode chegar ao valor máximo de 100"}).lte(100).nonnegative(),
    tipo: z.nativeEnum(Tipo),
    subtipo: z.nativeEnum(Subtipo),
    curaMin: z.number().int(
        { message: "A cura mínima deve possuir apenas numeros inteiros positivos e valor maior do que  zero" }).gte(1).optional(),
    curaMax: z.number().int(
        { message: "A cura máxima deve possuir apenas numeros inteiros positivos e pode chegar até 100" }).nonnegative().lte(100).optional(),
    duracao: z.number().int().lte(60).nonnegative(
        { message: "A duração deve possuir apenas numeros inteiros positivos e valor máximo de 60" }),
    purifica: z.nativeEnum(Purifica).optional(),
    danoMin: z.number().int(
        { message: "O dano mínimo deve possuir apenas numeros inteiros positivos e valor maior do que zero" }).gte(1).optional(),
    danoMax: z.number().int(
        { message: "O dano máximo deve possuir apenas numeros inteiros positivos e pode chegar até 100" }).nonnegative().lte(100).optional(),
    escudoMin: z.number().int(
        { message: "O escudo mínimo deve possuir apenas numeros inteiros positivos e valor maior do que zero" }).gte(1).optional(),
    escudoMax: z.number().int(
        { message: "O escudo máximo deve possuir apenas numeros inteiros positivos e pode chegar até 100" }).nonnegative().lte(100).optional(),
    alvos: z.nativeEnum(Alvo).optional(),
    tipoAlvo: z.nativeEnum(TipoAlvo).optional(),
    invoHPMin: z.number().int(
        { message: "O hp mínimo da invocação deve possuir apenas numeros inteiros positivos e valor maior do que  zero" }).gte(1).optional(),
    invoHPMax: z.number().int(
        { message: "O hp máximo da invocação deve possuir apenas numeros inteiros positivos e pode chegar até 100" }).nonnegative().lte(100).optional(),
    invoATKMin: z.number().int(
        { message: "O ataque mínimo da invocação deve possuir apenas numeros inteiros positivos e valor maior do que zero" }).gte(1).optional(),
    invoATKMax: z.number().int(
        { message: "O ataque máximo da invocação deve possuir apenas numeros inteiros positivos e pode chegar até 100" }).nonnegative().lte(100).optional(),
    invoLS: z.boolean(),
    invoCRIT: z.boolean(),
    invoDEF: z.number().int(
        { message: "A defesa da invocação deve possuir apenas numeros inteiros positivos e valor maior do que zero" }).gte(1),
    invoSELF: z.boolean(),
    invoSPWNMin: z.number().int(
       { message: "O spawn mínimo da invocação deve possuir apenas numeros inteiros positivos e valor maior do que zero" }).gte(1).optional(),
    invoSPWNMax: z.number().int(
        { message: "O spawn máximo da invocação deve possuir apenas numeros inteiros positivos e pode chegar até 100" }).nonnegative().lte(100).optional(),
    invoSPEC: z.boolean(),
})

router.get("/", async (req, res) => {
    try {
        const magias = await prisma.magia.findMany({
        include: {
        efeito: true,
       }
        })
        res.status(200).json(magias)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = magiaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, custo, tipo, subtipo, curaMin, curaMax, duracao, purifica, danoMin, danoMax, escudoMin,
            escudoMax, alvos, tipoAlvo, invoHPMin, invoHPMax, invoATKMin, invoATKMax, invoLS, invoCRIT,
            invoDEF, invoSELF, invoSPWNMin, invoSPWNMax, invoSPEC} = valida.data

    try {
      const magia = await prisma.magia.create({
        data: {
            nome, custo, tipo, subtipo, curaMin, curaMax, duracao, purifica, danoMin, danoMax, escudoMin,
            escudoMax, alvos, tipoAlvo, invoHPMin, invoHPMax, invoATKMin, invoATKMax, invoLS, invoCRIT,
            invoDEF, invoSELF, invoSPWNMin, invoSPWNMax, invoSPEC
        }
      })
      res.status(201).json(magia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const magia = await prisma.magia.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(magia)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = magiaSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, custo, tipo, subtipo, curaMin, curaMax, duracao, purifica, danoMin, danoMax, escudoMin,
            escudoMax, alvos, tipoAlvo, invoHPMin, invoHPMax, invoATKMin, invoATKMax, invoLS, invoCRIT,
            invoDEF, invoSELF, invoSPWNMin, invoSPWNMax, invoSPEC } = valida.data

    try {
        const magia = await prisma.magia.update({
            where: { id: Number(id)},
            data: {
                nome, custo, tipo, subtipo, curaMin, curaMax, duracao, purifica, danoMin, danoMax, escudoMin,
            escudoMax, alvos, tipoAlvo, invoHPMin, invoHPMax, invoATKMin, invoATKMax, invoLS, invoCRIT,
            invoDEF, invoSELF, invoSPWNMin, invoSPWNMax, invoSPEC
            }
        })
        res.status(200).json(magia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router