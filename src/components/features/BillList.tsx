import React from "react";
import { Bill, Participant } from "@/types";
import { Card } from "@/components/ui/Card";
import { Trash2, Calendar, User, DollarSign, Edit2 } from "lucide-react";

interface BillListProps {
    bills: Bill[];
    participants: Participant[];
    onRemoveBill: (id: string) => void;
    onEditBill: (bill: Bill) => void;
}

export function BillList({ bills, participants, onRemoveBill, onEditBill }: BillListProps) {
    if (bills.length === 0) {
        return (
            <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-dashed border-slate-700">
                <p>No bills added yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bills.map((bill) => {
                const payer = participants.find((p) => p.id === bill.payerId);
                const sharedPerPerson = bill.sharedAmount / participants.length;

                return (
                    <Card key={bill.id} className="relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500" />

                        <div className="flex justify-between items-start mb-4 pl-2">
                            <div>
                                <h3 className="text-lg font-semibold text-white">{bill.description}</h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        Paid by <span className="text-purple-400 font-medium">{payer?.name}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(bill.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">
                                    ${bill.totalAmount.toFixed(2)}
                                </div>
                                <div className="flex gap-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                    <button
                                        onClick={() => onEditBill(bill)}
                                        className="text-gray-400 hover:text-purple-400 text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                    <button
                                        onClick={() => onRemoveBill(bill.id)}
                                        className="text-gray-400 hover:text-red-400 text-sm flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 text-sm border border-white/10 space-y-3">
                            {/* Individual Items Section - Grouped by Person */}
                            {bill.items.length > 0 && (
                                <div className="pb-3 border-b border-slate-800">
                                    <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase">Individual Items</h4>
                                    <div className="space-y-3">
                                        {participants.map((p) => {
                                            const personalItems = bill.items.filter((i) => i.ownerId === p.id);
                                            if (personalItems.length === 0) return null;

                                            const personalItemsTotal = personalItems.reduce((sum, i) => sum + i.amount, 0);

                                            return (
                                                <div key={p.id}>
                                                    <div className="font-semibold text-slate-200 mb-1">{p.name}</div>
                                                    <div className="pl-3 space-y-1">
                                                        {personalItems.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center text-slate-300">
                                                                <span>{item.name}</span>
                                                                <span className="font-medium">${item.amount.toFixed(2)}</span>
                                                            </div>
                                                        ))}
                                                        <div className="flex justify-between items-center text-slate-400 text-xs pt-1 border-t border-slate-700/50">
                                                            <span>Subtotal</span>
                                                            <span className="font-semibold">${personalItemsTotal.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}

                                        {/* Total Individual Items */}
                                        <div className="flex justify-between items-center text-slate-200 font-semibold pt-2 border-t border-slate-700">
                                            <span>Total Individual</span>
                                            <span>${bill.items.reduce((sum, i) => sum + i.amount, 0).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Shared Pool */}
                            <div className="pb-3 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400 font-medium">Shared Pool</span>
                                    <div className="text-right">
                                        <div className="text-slate-200 font-semibold">
                                            ${bill.totalAmount.toFixed(2)} - ${bill.items.reduce((sum, i) => sum + i.amount, 0).toFixed(2)} = ${bill.sharedAmount.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-slate-500 text-right mt-1">
                                    Each person pays ${sharedPerPerson.toFixed(2)}
                                </div>
                            </div>

                            {/* Per Person Breakdown */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-400 mb-2 uppercase">Cost Breakdown</h4>
                                <div className="space-y-2">
                                    {participants.map((p) => {
                                        const personalItems = bill.items.filter((i) => i.ownerId === p.id);
                                        const personalItemsTotal = personalItems.reduce((sum, i) => sum + i.amount, 0);
                                        const totalCost = personalItemsTotal + sharedPerPerson;
                                        const isPayer = p.id === bill.payerId;

                                        return (
                                            <div key={p.id} className="bg-slate-950/30 rounded-lg p-3 border border-slate-800/50">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-slate-200">{p.name}</span>
                                                    {isPayer ? (
                                                        <span className="text-green-400 font-bold text-sm">
                                                            +${(bill.totalAmount - totalCost).toFixed(2)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-400 font-bold text-sm">
                                                            -${totalCost.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-400 space-y-0.5">
                                                    {personalItemsTotal > 0 && (
                                                        <div>Personal items: ${personalItemsTotal.toFixed(2)}</div>
                                                    )}
                                                    <div>Shared portion: ${sharedPerPerson.toFixed(2)}</div>
                                                    <div className="font-medium text-slate-300 pt-0.5 border-t border-slate-700/30 mt-1">
                                                        Total cost: ${totalCost.toFixed(2)}
                                                    </div>
                                                    {isPayer && (
                                                        <div className="text-green-400 pt-1">
                                                            Paid ${bill.totalAmount.toFixed(2)}, owed ${(bill.totalAmount - totalCost).toFixed(2)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
