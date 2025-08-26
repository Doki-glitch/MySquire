import { Bonus, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const profissaoSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    bonus: z.nativeEnum(Bonus),
    personagemId: z.number().int().nonnegative(
                        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

router.get("/", async (req, res) => {
    try {
        const profissoes = await prisma.profissao.findMany({
        include: {
        personagem: true,
        habilidades: true,
       }
        })
        res.status(200).json(profissoes)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = profissaoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, bonus, personagemId } = valida.data

    try {
      const profissao = await prisma.profissao.create({
        data: { nome, bonus, personagemId }
      })
      res.status(201).json(profissao)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const profissao = await prisma.profissao.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(profissao)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = profissaoSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, bonus, personagemId} = valida.data

    try {
        const profissao = await prisma.profissao.update({
            where: { id: Number(id)},
            data: { nome, bonus, personagemId }
        })
        res.status(200).json(profissao)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router