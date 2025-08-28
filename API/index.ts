import express from 'express'
import cors from 'cors'

import routesPersonagens from './routes/personagens'
import routesStatus from './routes/status'
import routesCondicoes from './routes/condicoes'
import routesAtributos from './routes/atributos'
import routesPericias from './routes/pericias'
import routesHabilidades from './routes/habilidades'
import routesEspeciais from './routes/especiais'
import routesProfissoes from './routes/profissoes'
import routesRequerimentos from './routes/requerimentos'
import routesCaracteristicas from './routes/caracteristicas'
import routesArmamentos from './routes/armamentos'

const app = express()
const port = 3000

app.use(express.json())
app.use(cors())

app.use("/personagens", routesPersonagens)
app.use("/status", routesStatus)
app.use("/condicoes", routesCondicoes)
app.use("/atributos", routesAtributos)
app.use("/pericias", routesPericias)
app.use("/habilidades", routesHabilidades)
app.use("/especiais", routesEspeciais)
app.use("/profissoes", routesProfissoes)
app.use("/requerimentos", routesRequerimentos)
app.use("/caracteristicas", routesCaracteristicas)
app.use("/armamentos", routesArmamentos)

app.get('/', (req, res) => {
  res.send('API: MySquire')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})