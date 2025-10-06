import { PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router() 

const personagemSchema = z.object({
  nome: z.string().min(4,
    { message: "Nome deve possuir, no mínimo, 4 caracteres" }),
  idade: z.number().int().nonnegative(
    { message: "A idade deve possuir apenas numeros inteiros positivos" }),
  descricao: z.string().optional(),
  caracteristicas: z.string().optional(),
  foto: z.string(),                      //serve para adicionar as fotos
  nivel: z.number().int().nonnegative(
    { message: "O nível deve ser zero ou possuir apenas numeros inteiros positivos" }),
  experiencia: z.number().nonnegative(
    { message: "A experiência deve ser zero ou possuir apenas numeros positivos" }),
})

router.get("/", async (req, res) => {
    try {
        const personagems = await prisma.personagem.findMany({
        include: {
        status: true,
        atributos: true,
        pericias: true,
        profissoes: true,
        especiais: true,
        armamentos: true,
       }
        })
        res.status(200).json(personagems)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post("/", async (req, res) => {

    const valida = personagemSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const { nome, idade, descricao = null, caracteristicas = null, nivel, foto, experiencia} = valida.data

    try {
      const personagem = await prisma.personagem.create({
        data: {
            nome, idade, descricao, caracteristicas, nivel, foto, experiencia
        }
      })
      res.status(201).json(personagem)
    } catch (error) {
        res.status(400).json({ error })
    }
})


router.delete("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const personagem = await prisma.personagem.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(personagem)
  } catch (error) {
    res.status(400).json({ erro: error })
  }
})

router.put("/:id", async (req, res) => {
    const { id } = req.params

    const valida = personagemSchema.safeParse(req.body)
    if (!valida.success) {
        res.status(400).json({ erro: valida.error })
        return
    }

    const {nome, idade, descricao, caracteristicas, nivel, foto, experiencia} = valida.data

    try {
        const personagem = await prisma.personagem.update({
            where: { id: Number(id)},
            data: {
                nome, idade, descricao, caracteristicas, nivel, foto, experiencia
            }
        })
        res.status(200).json(personagem)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router