import { TransactionRequest } from "./interface/transcation.js"
import { Vector } from "./interface/vector.js"
import { Constants } from "./interface/constants.js"
import { MccRisk } from "./interface/mcc-risk.js"
import { limit, parseHourOfDay, parseDayOfWeek, parseMinutesSinceLastTx, parseKmLastTx, parseKmFromHome, hasUnknownMerchant, findMccRisk } from "./parse-values.js"
import { appState } from "./state.js"
import { ReferenceLabel, References } from "./interface/references.js"

import { Result } from "./interface/result.js"



export const getFraudScore = async (_transactionRequests: TransactionRequest, _constants: Constants, mcc_risk: MccRisk) => {
  let result: Result= { approved: false, fraud_score: 0 }
  const references = appState.references

  if (!references) {
    return result
  }
    const vector: Vector = [
      limit(_transactionRequests.transaction.amount / _constants.max_amount, 0, 1),
      limit(_transactionRequests.transaction.installments, 1, _constants.max_installments),
      limit(_transactionRequests.transaction.amount / _transactionRequests.customer.avg_amount, 0, 1),
      parseHourOfDay(_transactionRequests.transaction.requested_at),
      parseDayOfWeek(_transactionRequests.transaction.requested_at),
      parseMinutesSinceLastTx({ last_transaction: _transactionRequests.last_transaction, requested_at: _transactionRequests.transaction.requested_at, max_minutes: _constants.max_minutes }),
      parseKmLastTx({ last_transaction: _transactionRequests.last_transaction, max_km: _constants.max_km }),
      parseKmFromHome({ terminal: _transactionRequests.terminal, max_km: _constants.max_km }),
      limit(_transactionRequests.customer.tx_count_24h / _constants.max_tx_count_24h, 0, 1),
      _transactionRequests.terminal.is_online ? 1 : 0,
      _transactionRequests.terminal.card_present ? 1 : 0,
      hasUnknownMerchant({ currentmerchant: _transactionRequests.merchant, listMerchants: _transactionRequests.customer.known_merchants }),
      findMccRisk({ mcc: _transactionRequests.merchant?.mcc ?? null, mcc_risk }),
      limit((_transactionRequests.merchant?.avg_amount ?? 0) / _constants.max_merchant_avg_amount, 0, 1),
    ]
   
    result = calculateResult(vector, references, 5) ?? { approved: false, fraud_score: 0 }

  
  return result;
}   


function euclideanDistance(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < 14; i++) {
    const d = a[i] - b[i]
    sum += d * d
  }
  return Math.sqrt(sum)
}

const calculateResult = (_vector: Vector, _references: References, k  = 5) => {
  const top = calculateKNN(_vector, _references, k)
  const legit = top.filter(result => result.label === ReferenceLabel.LEGIT).length
  const fraud = top.filter(result => result.label === ReferenceLabel.FRAUD).length
  
  if(legit > fraud) return { approved: true, fraud_score: legit / k }
  if(fraud > legit) return { approved: false, fraud_score: fraud / k }


}


const calculateKNN = (_vector: Vector, _references: References, k  = 5) => {


  const top: { label: string; distance: number }[] = []

  for (const reference of _references) {
    const distance = euclideanDistance(_vector, reference.vector)
    if(top.length < k) {
      top.push({ label: reference.label, distance })
      if (top.length === k) top.sort((a, b) => a.distance - b.distance)
      continue
      }
      if (distance >= top[k - 1].distance) continue

      top[k - 1] = { label: reference.label, distance }
      top.sort((a, b) => a.distance - b.distance)
  
  }
  return top
}

