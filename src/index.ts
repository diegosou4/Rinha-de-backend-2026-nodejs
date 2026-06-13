import fastify from 'fastify'
import { TransactionRequest } from './interface/transcation.js'
import { Constants } from './interface/constants.js'
import { MccRisk } from './interface/mcc-risk.js'
import { getFraudScore } from './fraud-score.js'
import { loadJson, loadReferences } from './utils.js'
import { appState } from './state.js'

const server = fastify()

async function bootstrap() {
  appState.normalization = await loadJson<Constants>('resources/normalization.json')
  appState.mccRisk = await loadJson<MccRisk>('resources/mcc_risk.json')
  appState.references = await loadReferences('resources/references.json.gz')
  appState.isReady = true
}


server.get('/ready', async (_, reply) => {
  if (!appState.isReady) {
    return reply.code(503).send({ status: 'loading' })
  }
  return { status: 'ok' }  
})

server.post('/fraud-score', async (request, reply) => {
  const { normalization, mccRisk } = appState

  if (!appState.isReady || !normalization || !mccRisk) {
    return reply.code(503).send({ status: 'loading' })
  }

  const transactionRequest = request.body as TransactionRequest

  const score = await getFraudScore(transactionRequest, normalization, mccRisk)
  return {
    code: 200,
    status: 'ok',
    score
  }
})

async function main() {
  bootstrap().catch((err) => {
    console.error(err)
    process.exit(1)
  })
  const address = await server.listen({ port: 3000 })
  console.log(`Server listening at ${address}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})