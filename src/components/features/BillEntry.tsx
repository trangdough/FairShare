import React, { useState, useEffect } from "react";
import { Participant, BillItem, Bill } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Plus, Trash2, Receipt, ShoppingBag, X } from "lucide-react";

interface BillEntryProps {
    participants: Participant[];
    onAddBill: (bill: {
        payerId: string;
        totalAmount: number;
        description: string;
        items: BillItem[];
        date: string;
    }) => void;
    onUpdateBill?: (id: string, bill: {
        payerId: string;
        totalAmount: number;
        description: string;
        items: BillItem[];
        date: string;
    }) => void;
    editingBill?: Bill | null;
    onCancelEdit?: () => void;
}

export function BillEntry({ participants, onAddBill, onUpdateBill, editingBill, onCancelEdit }: BillEntryProps) {
    const [description, setDescription] = useState("");
    const [totalAmount, setTotalAmount] = useState("");
    const [payerId, setPayerId] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState<BillItem[]>([]);

    // Item entry state
    const [itemName, setItemName] = useState("");
    const [itemAmount, setItemAmount] = useState("");
    const [itemOwnerId, setItemOwnerId] = useState("");

    // Populate form when editing
    useEffect(() => {
        if (editingBill) {
            setDescription(editingBill.description);
            setTotalAmount(editingBill.totalAmount.toString());
            setPayerId(editingBill.payerId);
            setDate(editingBill.date.split('T')[0]);
            setItems(editingBill.items);
        }
    }, [editingBill]);

    const parsedTotal = parseFloat(totalAmount) || 0;
    const itemsTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const sharedAmount = Math.max(0, parsedTotal - itemsTotal);

    const handleAddItem = () => {
        if (itemName && itemAmount && itemOwnerId) {
            const newItem: BillItem = {
                id: Math.random().toString(36).substr(2, 9),
                name: itemName,
                amount: parseFloat(itemAmount),
                ownerId: itemOwnerId,
            };
            setItems([...items, newItem]);
            setItemName("");
            setItemAmount("");
            setItemOwnerId("");
        }
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (payerId && parsedTotal > 0 && description) {
            if (editingBill && onUpdateBill) {
                onUpdateBill(editingBill.id, {
                    payerId,
                    totalAmount: parsedTotal,
                    description,
                    items,
                    date,
                });
            } else {
                onAddBill({
                    payerId,
                    totalAmount: parsedTotal,
                    description,
                    items,
                    date,
                });
            }
            // Reset form
            setDescription("");
            setTotalAmount("");
            setPayerId("");
            setDate(new Date().toISOString().split('T')[0]);
            setItems([]);
            if (onCancelEdit) onCancelEdit();
        }
    };

    if (participants.length === 0) {
        return (
            <Card className="opacity-50 pointer-events-none">
                <div className="text-center py-8 text-slate-400">
                    Add participants above to start adding bills.
                </div>
            </Card>
        );
    }

    return (
        <Card className={editingBill ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20" : ""}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
                        <Receipt className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">
                        {editingBill ? "Edit Bill" : "Add New Bill"}
                    </h2>
                    {editingBill && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Editing
                        </span>
                    )}
                </div>
                {editingBill && onCancelEdit && (
                    <button
                        onClick={() => {
                            onCancelEdit();
                            setDescription("");
                            setTotalAmount("");
                            setPayerId("");
                            setDate(new Date().toISOString().split('T')[0]);
                            setItems([]);
                        }}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Main Bill Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Description</label>
                        <Input
                            placeholder="e.g. Walmart Grocery"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Total Amount ($)</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={totalAmount}
                            onChange={(e) => setTotalAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-200">Who paid?</label>
                        <select
                            className="w-full h-12 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 text-sm text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            value={payerId}
                            onChange={(e) => setPayerId(e.target.value)}
                            required
                        >
                            <option value="">Select payer...</option>
                            {participants.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-200">Date</label>
                        <Input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                        />
                    </div>
                </div>

                {/* Itemized Splitting Section */}
                <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-gray-200 flex items-center gap-2">
                            <ShoppingBag className="w-4 h-4" />
                            Individual Items (Optional)
                        </h3>
                        <span className="text-xs text-gray-400">
                            Shared Pool: <span className="text-purple-400 font-bold">${sharedAmount.toFixed(2)}</span>
                        </span>
                    </div>

                    {/* Add Item Form */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4 bg-white/5 p-3 rounded-lg border border-white/10">
                        <Input
                            placeholder="Item name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            className="h-9 text-sm"
                        />
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount"
                            value={itemAmount}
                            onChange={(e) => setItemAmount(e.target.value)}
                            className="h-9 text-sm"
                        />
                        <div className="flex gap-2">
                            <select
                                className="flex-1 h-9 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-2 text-xs text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                value={itemOwnerId}
                                onChange={(e) => setItemOwnerId(e.target.value)}
                            >
                                <option value="">Assign to...</option>
                                {participants.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleAddItem}
                                disabled={!itemName || !itemAmount || !itemOwnerId}
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Items List */}
                    {items.length > 0 && (
                        <div className="space-y-2 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between bg-white/5 px-3 py-2 rounded text-sm border border-white/5">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-200">{item.name}</span>
                                        <span className="text-gray-400 text-xs">
                                            ({participants.find(p => p.id === item.ownerId)?.name})
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-medium text-white">${item.amount.toFixed(2)}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-gray-400 hover:text-red-400"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                    {editingBill ? "Update Bill" : "Add Bill"}
                </Button>
            </form>
        </Card>
    );
}
