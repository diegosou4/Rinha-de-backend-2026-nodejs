

export interface Vector {
    amount: number,
    installments: number,
    amount_vs_avg: number,
    hour_of_day: number,
    day_of_week: number,
    minutes_since_last_tx: number,
    km_from_last_tx: number,
    km_from_home: number,
    tx_count_24h: number,
    is_online: number,
    card_present: number,
    unknown_merchant: number,
    mcc_risk: number,
    merchant_avg_amount: number,
}