import { Afinidade, PrismaClient } from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router() 

const personagemSchema = z.object({
  nome: z.string().max(50,
    { message: "O nome não pode possuir mais do que 50 caracteres" }),
  idade: z.number().int().positive(
    { message: "A idade deve possuir apenas numeros inteiros positivos" }),
  raca: z.string().max(30,
    { message: "O nome da raça do personagem não pode possuir mais do que 30 caracteres"}).optional(),
  background: z.string().optional(),
  caracteristicas: z.string().optional(),
  afinidade: z.nativeEnum(Afinidade),
  ranque: z.number().int().nonnegative(
    { message: "O nível deve ser zero ou possuir apenas numeros inteiros positivos" }),
  experiencia: z.number().nonnegative(
    { message: "A experiência deve ser zero ou possuir apenas numeros positivos" }),
  altura: z.number().positive(
    { message: "A altura deve ser maior do que zero"}),
  foto: z.string(),
  movimento: z.number().nonnegative( 
    {message: "Valor de movimento é obrigatório e não pode ser negativo"}),
  usuarioId:  z.string().uuid()
})

router.get("/", async (req, res) => {
    try {
        const { usuarioId } = req.query
        const personagems = await prisma.personagem.findMany({
        where: {
         ...(usuarioId ? { usuarioId: String(usuarioId) } : {})
         },
        include: {
        status: true,
        atributos: true,
        pericias: true,
        profissoes: true,
        especiais: true,
        armamentos: true,
        armaduras: true,
        itens: true
       }
        })
        res.status(200).json(personagems)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const personagem = await prisma.personagem.findUnique({
      where: { id: Number(id) },
      include: {
        atributos: true,
        status: true,
        pericias: true,
        profissoes: true,
        especiais: true,
        armamentos: true,
      },
    })

    if (!personagem) {
      return res.status(404).json({ erro: "Personagem não encontrado" })
    }

    res.status(200).json(personagem)
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

    const { nome, idade, background = null, caracteristicas = null, ranque, 
            experiencia, foto, altura, raca = null, afinidade, movimento, usuarioId } = valida.data

    try {
      const personagem = await prisma.personagem.create({
        data: {
           nome, idade, background, caracteristicas, ranque, experiencia, foto, altura, raca,
           afinidade, movimento, usuarioId
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

    const {nome, idade, background = null, caracteristicas = null, ranque, 
           experiencia, foto, altura, raca = null, afinidade, movimento, usuarioId} = valida.data

    try {
        const personagem = await prisma.personagem.update({
            where: { id: Number(id)},
            data: {
            nome, idade, background, caracteristicas, ranque, experiencia, foto, altura, raca,
            afinidade, movimento, usuarioId
            }
        })
        res.status(200).json(personagem)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router
