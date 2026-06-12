
export interface TransactionRequest {
    id: string
    transaction: Transaction,
    customer: Customer,
    terminal: Terminal,
    last_transaction: LastTransaction | null,
    merchant: Merchant | null,
}


export interface Transaction {
    amount: number,
    installments: number,
    requested_at: string,
}

export interface Customer {
    avg_amount: number,
    tx_count: number,
    known_merchants: string[],
}

export interface Merchant {
    id: string,
    mcc: string,
    avg_amount: number,
}

export interface Terminal {
    is_online: boolean,
    card_present: boolean,
    km_from_home: number,
}

export interface LastTransaction {
    timestamp: string,
    km_from_home: number,
}
