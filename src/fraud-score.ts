import { TransactionRequest } from "./interface/transcation.js"
import { Vector } from "./interface/vector.js"
import { Constants } from "./interface/constants.js"

import { MccRisk } from "./interface/mcc-risk.js"
import { limit, parseHourOfDay, parseDayOfWeek, parseMinutesSinceLastTx, parseKmLastTx, parseKmFromHome, hasUnknownMerchant, findMccRisk } from "./parse-values.js"
export const getFraudScore = async (_transactionRequests: TransactionRequest[], _constants: Constants, mcc_risk: MccRisk) => {

  const vectors: Vector[] = []

  for (const transactionRequest of _transactionRequests) {
    const vector: Vector = {
      amount: limit(transactionRequest.transaction.amount / _constants.max_amount, 0, 1),
      installments: limit(transactionRequest.transaction.installments, 1, _constants.max_installments),
      amount_vs_avg: limit(transactionRequest.transaction.amount / transactionRequest.customer.avg_amount, 0, 1),
      hour_of_day: parseHourOfDay(transactionRequest.transaction.requested_at),
      day_of_week: parseDayOfWeek(transactionRequest.transaction.requested_at),
      minutes_since_last_tx: parseMinutesSinceLastTx({ last_transaction: transactionRequest.last_transaction, requested_at: transactionRequest.transaction.requested_at, max_minutes: _constants.max_minutes }),
      km_from_last_tx: parseKmLastTx({ last_transaction: transactionRequest.last_transaction, max_km: _constants.max_km }),
      km_from_home: parseKmFromHome({ terminal: transactionRequest.terminal, max_km: _constants.max_km }),
      tx_count_24h: limit(transactionRequest.customer.tx_count_24h / _constants.max_tx_count_24h, 0, 1),
      is_online: transactionRequest.terminal.is_online ? 1 : 0,
      card_present: transactionRequest.terminal.card_present ? 1 : 0,
      unknown_merchant: hasUnknownMerchant({ currentmerchant: transactionRequest.merchant, listMerchants: transactionRequest.customer.known_merchants }),
      mcc_risk: findMccRisk({ mcc: transactionRequest.merchant?.mcc ?? null, mcc_risk }),
      merchant_avg_amount: limit(transactionRequest.merchant.avg_amount / _constants.max_merchant_avg_amount, 0, 1),
    }
    vectors.push(vector)
    console.log(vector);
  }

  return [0.0];
}   


