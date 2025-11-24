import { Grau, PrismaClient, Tipo, Subtipo, Custo, CuraMin, CuraMax, Alvo, TipoAlvo, Duracao, Purifica, Alcance, DanoMin, DanoMax, EscudoMax, EscudoMin, VidaInvo, DefInvo }  from '@prisma/client'
import { Router } from 'express'
import { z } from 'zod'

const prisma = new PrismaClient()

const router = Router()

const magiaSchema = z.object({
    nome: z.string(
        { message: "O nome deve possuir só caractere string e no mínimo 3 de caractere" }).min(3),
    tipo: z.nativeEnum(Tipo),
    personagemId: z.number().int().nonnegative(
        { message: "PersonagemId obrigatório e deve ser número inteiro positivo"}),
})

function grauToNum(grau: Grau): number {
  return Number(grau.replace("Grau", ""));
}

function safeEnum<T>(prefix: string, n: number, enumObj: any): T | undefined {
  const key = `${prefix}${n}`;
  return enumObj[key] ?? undefined;
}

function valoresPorGrau(grau: Grau) {
  const n = grauToNum(grau);

  return {
    custo: safeEnum<Custo>("Custo", n, Custo),

    curaMin: safeEnum<CuraMin>("CuraMin", n, CuraMin),
    curaMax: safeEnum<CuraMax>("CuraMax", n, CuraMax),

    danoMin: safeEnum<DanoMin>("DanoMin", n, DanoMin),
    danoMax: safeEnum<DanoMax>("DanoMax", n, DanoMax),

    escudoMin: safeEnum<EscudoMin>("EscudoMin", n, EscudoMin),
    escudoMax: safeEnum<EscudoMax>("EscudoMax", n, EscudoMax),

    vidaInvo: safeEnum<VidaInvo>("Vida", n, VidaInvo),
    defInvo: safeEnum<DefInvo>("Def", n, DefInvo),

    duracao: safeEnum<Duracao>("Dura", n, Duracao),
  };
}

router.get("/", async (req, res) => {
    try {
        const magias = await prisma.magia.findMany({
        include: {
        cura: true,
        buff: true,
        cleanse: true,
        movimento: true,
        dano: true,
        dot: true,
        debuff: true,
        curse: true,
        moveIni: true,
        escudo: true,
        resguardo: true,
        zumbi: true,
        golem: true,
        bicho: true
       }
        })
        res.status(200).json(magias)
    } catch (error) {
        res.status(500).json({ erro: error })
    }
})

router.post('/', async (req, res) => {
  const { nome, tipo, subtipo, personagemId } = req.body;

  try {
    const magia = await prisma.magia.create({
      data: {
        nome,
        tipo,
        personagemId: Number(personagemId),
      },
    });

    if (subtipo === Subtipo.Cura) {
      const graus = [ Grau.Grau2, Grau.Grau3, Grau.Grau4, Grau.Grau5 ];  

      for (const grau of graus) {
       
        const v = valoresPorGrau(grau);

        await prisma.magiaCura.create({
          data: {
            subtipo: Subtipo.Cura,
            grau,
             custo: v.custo,         
            curaMin: v.curaMin,
            curaMax: v.curaMax,
            alvos: Alvo.Unico,
            tipoAlvo: TipoAlvo.Aliado, 
            magiaId: magia.id,
          },
        });
      }
    }

    if (subtipo === Subtipo.Potencializacao) {

  const graus = [ Grau.Grau2, Grau.Grau3, Grau.Grau4, Grau.Grau5 ];

  for (const grau of graus) {
   
    const v = valoresPorGrau(grau);

    await prisma.magiaBuff.create({
      data: {
        subtipo: Subtipo.Potencializacao, 
        grau,                             
        custo: v.custo,              
        duracao: v.duracao,         
        alvos: Alvo.Unico,               
        tipoAlvo: TipoAlvo.Aliado,        
        magiaId: magia.id,
      }
    });
  }
}

if (subtipo === Subtipo.Purificacao) {

  const graus = [ Grau.Grau2, Grau.Grau3 ];

  for (const grau of graus) {
     
    const v = valoresPorGrau(grau);

    await prisma.magiaCleanse.create({
      data: {
        subtipo: Subtipo.Purificacao,
        grau,
        custo: v.custo,      
        purifica: Purifica.Unico, 
        alvos: Alvo.Unico,
        tipoAlvo: TipoAlvo.Aliado,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Movimento) {

  const graus = [ Grau.Grau2, Grau.Grau3 ];

  for (const grau of graus) {
      
    const v = valoresPorGrau(grau);

    await prisma.magiaMove.create({
      data: {
        subtipo: Subtipo.Movimento,
        grau,
        custo: v.custo,       
        distancia: Alcance.Medio, 
        alvos: Alvo.Unico,
        tipoAlvo: TipoAlvo.Aliado,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Dano) {

  const graus = [ Grau.Grau1, Grau.Grau2, Grau.Grau3, Grau.Grau4, Grau.Grau5 ];

  for (const grau of graus) {
      
    const v = valoresPorGrau(grau);

    await prisma.magiaDano.create({
      data: {
        subtipo: Subtipo.Dano,
        grau,
        custo: v.custo,      
        danoMin: v.danoMin,  
        danoMax: v.danoMax,
        alvos: Alvo.Unico,
        tipoAlvo: TipoAlvo.Inimigo,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Dano_progressivo) {

  const graus = [ Grau.Grau1, Grau.Grau2, Grau.Grau3, Grau.Grau4 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaDoT.create({
      data: {
        subtipo: Subtipo.Dano_progressivo,
        grau,
        custo: v.custo,      
        danoMin: v.danoMin,  
        danoMax: v.danoMax,
        duracao: v.duracao,
        alvos: Alvo.Unico,
        tipoAlvo: TipoAlvo.Inimigo,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Debilitante) {

  const graus = [ Grau.Grau2, Grau.Grau3 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaDebuff.create({
      data: {
        subtipo: Subtipo.Debilitante,
        grau,
        custo: v.custo,      
        alvo: Alvo.Unico,
        tipoAlvo: TipoAlvo.Inimigo,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Opressora) {

  const graus = [ Grau.Grau3, Grau.Grau4 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaCurse.create({
      data: {
        subtipo: Subtipo.Opressora,
        grau,
        custo: v.custo,      
        alvo: Alvo.Unico,
        tipoAlvo: TipoAlvo.Inimigo,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Disruptiva) {

  const graus = [ Grau.Grau2, Grau.Grau3 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaRemove.create({
      data: {
        subtipo: Subtipo.Disruptiva,
        grau,
        custo: v.custo,   
        distancia: Alcance.Medio,   
        alvo: Alvo.Unico,
        tipoAlvo: TipoAlvo.Inimigo,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Escudo) {

  const graus = [ Grau.Grau2, Grau.Grau3, Grau.Grau4 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaEscudo.create({
      data: {
        subtipo: Subtipo.Escudo,
        grau,
        custo: v.custo,   
        escudoMin: v.escudoMin, 
        escudoMax: v.escudoMax,  
        alvo: Alvo.Unico,
        tipoAlvo: TipoAlvo.Aliado,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Necromancia) {

  const graus = [ Grau.Grau2, Grau.Grau3, Grau.Grau4 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaNecro.create({
      data: {
        subtipo: Subtipo.Necromancia,
        grau,
        custo: v.custo,    
        invoPV: v.vidaInvo,
        invoATKMin: v.danoMin,
        invoATKMax: v.danoMax,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Resguardo) {

  const graus = [ Grau.Grau2, Grau.Grau3, Grau.Grau4 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaDef.create({
      data: {
        subtipo: Subtipo.Resguardo,
        grau,
        custo: v.custo,    
        alvo: Alvo.Unico,
        tipoAlvo: TipoAlvo.Aliado,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Animacao) {

  const graus = [ Grau.Grau2, Grau.Grau3 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaGolem.create({
      data: {
        subtipo: Subtipo.Animacao,
        grau,
        custo: v.custo,    
        invoPV: v.vidaInvo,
        invoATKMin: v.danoMin,
        invoATKMax: v.danoMax,
        armadura: v.defInvo,
        magiaId: magia.id
      }
    });
  }
}

if (subtipo === Subtipo.Evocacao) {

  const graus = [ Grau.Grau4, Grau.Grau5 ];

  for (const grau of graus) {

    const v = valoresPorGrau(grau);

    await prisma.magiaIdolo.create({
      data: {
        subtipo: Subtipo.Evocacao,
        grau,
        custo: v.custo,    
        invoPV: v.vidaInvo,
        invoATKMin: v.danoMin,
        invoATKMax: v.danoMax,
        invoDMGMin: v.danoMin,
        invoDMGMax: v.danoMax,
        magiaId: magia.id
      }
    });
  }
}

    res.status(201).json(magia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar magia' });
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

    const { nome, tipo, personagemId } = valida.data

    try {
        const magia = await prisma.magia.update({
            where: { id: Number(id)},
            data: {
                nome, tipo, personagemId
            }
        })
        res.status(200).json(magia)
    } catch (error) {
        res.status(400).json({ error })
    }
})

export default router