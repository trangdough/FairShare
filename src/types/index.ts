export interface Participant {
    id: string;
    name: string;
}

export interface BillItem {
    id: string;
    name: string;
    amount: number;
    ownerId: string; // ID of the participant who owns this item
}

export interface Bill {
    id: string;
    payerId: string;
    totalAmount: number;
    description: string;
    date: string;
    items: BillItem[];
    sharedAmount: number;
}
