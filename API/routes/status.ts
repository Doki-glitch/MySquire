import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const statusSchema = z.object({
     vida: z.number().int().nonnegative(
    { message: "A vida deve possuir apenas numeros inteiros positivos ou zero" }),
    sanidade: z.number().int(
    { message: "A sanidade deve possuir apenas numeros inteiros positivos ou negativos" }),
    mana: z.number().int().nonnegative(
    { message: "A mana deve possuir apenas numeros inteiros positivos ou zero" }),
    afinco: z.number().int().nonnegative(
    { message: "O afinco deve possuir apenas numeros inteiros positivos ou zero" }),
    armadura: z.number().int().nonnegative(
    { message: "A armadura deve possuir apenas numeros inteiros positivos ou zero" }),
    estoicismo: z.number().int().nonnegative(
    { message: "O estoicismo deve possuir apenas numeros inteiros positivos ou zero" }),
    personagemId: z.number().int().nonnegative(
        { message: "PersonagemId obrigatório e deve ser inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const status = await prisma.status.findMany({
        include: {
        personagem: true,
        condicoes: true,
       }
        })
        res.status(200).json(status)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = statusSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { vida, sanidade, mana, afinco, armadura, estoicismo, personagemId} = valida.data

    try {
      const status = await prisma.status.create({
        data: {
            vida, sanidade, mana, afinco, armadura, estoicismo, personagemId
        }
      })
      res.status(201).json(status)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const status = await prisma.status.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(status)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = statusSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {vida, sanidade, mana, afinco, armadura, estoicismo, personagemId} = valida.data

    try {
        const status = await prisma.status.update({
            where: { id: Number(id)},
            data: {
                vida, sanidade, mana, afinco, armadura, estoicismo, personagemId
            }
        })
        res.status(200).json(status)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router