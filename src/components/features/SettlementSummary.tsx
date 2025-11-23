import React from "react";
import { Bill, Participant } from "@/types";
import { Card } from "@/components/ui/Card";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface SettlementSummaryProps {
    bills: Bill[];
    participants: Participant[];
}

interface Transaction {
    from: string;
    to: string;
    amount: number;
}

export function SettlementSummary({ bills, participants }: SettlementSummaryProps) {
    // Calculate net balances
    const balances: Record<string, number> = {};
    participants.forEach((p) => (balances[p.id] = 0));

    bills.forEach((bill) => {
        const sharedPerPerson = bill.sharedAmount / participants.length;

        participants.forEach((p) => {
            // Calculate cost for this person
            const personalItems = bill.items.filter((i) => i.ownerId === p.id);
            const personalItemsTotal = personalItems.reduce((sum, i) => sum + i.amount, 0);
            const totalCost = personalItemsTotal + sharedPerPerson;

            // If payer, they GAIN the total amount (since they paid it) but LOSE their cost
            // If not payer, they just LOSE their cost
            if (p.id === bill.payerId) {
                balances[p.id] += bill.totalAmount - totalCost;
            } else {
                balances[p.id] -= totalCost;
            }
        });
    });

    // Calculate transactions to settle
    const transactions: Transaction[] = [];
    const debtors = Object.entries(balances)
        .filter(([_, amount]) => amount < -0.01)
        .sort((a, b) => a[1] - b[1]); // Ascending (most negative first)

    const creditors = Object.entries(balances)
        .filter(([_, amount]) => amount > 0.01)
        .sort((a, b) => b[1] - a[1]); // Descending (most positive first)

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i];
        const creditor = creditors[j];

        // The amount to settle is the minimum of what debtor owes and creditor is owed
        const amount = Math.min(Math.abs(debtor[1]), creditor[1]);

        transactions.push({
            from: debtor[0],
            to: creditor[0],
            amount: amount,
        });

        // Update remaining amounts
        debtor[1] += amount;
        creditor[1] -= amount;

        // Move indices if settled
        if (Math.abs(debtor[1]) < 0.01) i++;
        if (creditor[1] < 0.01) j++;
    }

    if (bills.length === 0) return null;

    return (
        <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Settlement Plan</h2>
            </div>

            {transactions.length === 0 ? (
                <div className="text-center py-4 text-green-400 font-medium">
                    All settled up! No one owes anything.
                </div>
            ) : (
                <div className="space-y-3">
                    {transactions.map((t, idx) => {
                        const fromName = participants.find((p) => p.id === t.from)?.name;
                        const toName = participants.find((p) => p.id === t.to)?.name;

                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-between bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:border-purple-500/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-red-400">{fromName}</span>
                                    <span className="text-gray-400 text-sm">pays</span>
                                    <span className="font-semibold text-green-400">{toName}</span>
                                </div>
                                <div className="text-xl font-bold text-white">
                                    ${t.amount.toFixed(2)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
