import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const atributoSchema = z.object({
    constituicao: z.number().int().lte(20).nonnegative(
        { message: "A constituição deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    curiosidade: z.number().int().lte(20).nonnegative(
        { message: "A curiosidade deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    destreza: z.number().int().lte(20).nonnegative(
        { message: "A destreza deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    forca: z.number().int().lte(20).nonnegative(
            { message: "A força deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    mistico: z.number().int().lte(20).nonnegative(
            { message: "Místico deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    percepcao: z.number().int().lte(20).nonnegative(
            { message: "A percepção deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    presenca: z.number().int().lte(20).nonnegative(
                { message: "A presença deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    razao: z.number().int().lte(20).nonnegative(
                { message: "A razão deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    sorte: z.number().int().lte(20).nonnegative(
                { message: "A sorte deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    vontade: z.number().int().lte(20).nonnegative(
                    { message: "A vontade deve possuir apenas números inteiros positivos ou zero, é valor máximo de 20" }),
    personagemId: z.number().int().nonnegative(
                        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})


router.get("/", async (req, res) => {
    try {
        const atributos = await prisma.atributo.findMany({
        include: {
        personagem: true,
       }
        })
        res.status(200).json(atributos)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = atributoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { constituicao, curiosidade, destreza, forca, mistico, percepcao, 
            presenca, razao, sorte, vontade, personagemId } = valida.data

    try {
      const atributo = await prisma.atributo.create({
        data: {
            constituicao, curiosidade, destreza, forca, mistico, percepcao, 
            presenca, razao, sorte, vontade, personagemId
        }
      })
      res.status(201).json(atributo)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params
  
    try {
      const atributo = await prisma.atributo.delete({
        where: { id: Number(id) }
      })
      res.status(200).json(atributo)
    } catch (error) {
      res.status(400).json({ erro: error })
    }
  })

  
router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = atributoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { constituicao, curiosidade, destreza, forca, mistico, percepcao, 
            presenca, razao, sorte, vontade, personagemId } = valida.data

    try {
        const atributo = await prisma.atributo.update({
            where: { id: Number(id)},
            data: {
                constituicao, curiosidade, destreza, forca, mistico, percepcao, 
                presenca, razao, sorte, vontade, personagemId
            }
        })
        res.status(200).json(atributo)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router