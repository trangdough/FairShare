"use client";

import React, { useState } from "react";
import { Participant, Bill, BillItem } from "@/types";
import { ParticipantList } from "@/components/features/ParticipantList";
import { BillEntry } from "@/components/features/BillEntry";
import { BillList } from "@/components/features/BillList";
import { SettlementSummary } from "@/components/features/SettlementSummary";
import { Wallet } from "lucide-react";

export default function Home() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const handleAddParticipant = (name: string) => {
    const newParticipant: Participant = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    };
    setParticipants([...participants, newParticipant]);
  };

  const handleRemoveParticipant = (id: string) => {
    // Prevent removing if involved in bills
    const isInvolved = bills.some(
      (b) =>
        b.payerId === id ||
        b.items.some((i) => i.ownerId === id)
    );

    if (isInvolved) {
      alert("Cannot remove participant who is part of existing bills.");
      return;
    }

    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleAddBill = (billData: {
    payerId: string;
    totalAmount: number;
    description: string;
    items: BillItem[];
    date: string;
  }) => {
    const itemsTotal = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const sharedAmount = Math.max(0, billData.totalAmount - itemsTotal);

    const newBill: Bill = {
      id: Math.random().toString(36).substr(2, 9),
      payerId: billData.payerId,
      totalAmount: billData.totalAmount,
      description: billData.description,
      date: new Date(billData.date).toISOString(),
      items: billData.items,
      sharedAmount,
    };

    setBills([newBill, ...bills]);
  };

  const handleRemoveBill = (id: string) => {
    setBills(bills.filter((b) => b.id !== id));
  };

  const handleEditBill = (bill: Bill) => {
    setEditingBill(bill);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateBill = (id: string, billData: {
    payerId: string;
    totalAmount: number;
    description: string;
    items: BillItem[];
    date: string;
  }) => {
    const itemsTotal = billData.items.reduce((sum, item) => sum + item.amount, 0);
    const sharedAmount = Math.max(0, billData.totalAmount - itemsTotal);

    const updatedBill: Bill = {
      id,
      payerId: billData.payerId,
      totalAmount: billData.totalAmount,
      description: billData.description,
      date: new Date(billData.date).toISOString(),
      items: billData.items,
      sharedAmount,
    };

    setBills(bills.map(b => b.id === id ? updatedBill : b));
    setEditingBill(null);
  };

  const handleCancelEdit = () => {
    setEditingBill(null);
  };

  return (
    <main className="min-h-screen px-4 md:px-6 py-8 md:py-12 max-w-xl mx-auto space-y-12 pb-20">
      {/* Header */}
      <header className="text-center space-y-3 pt-8 pb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-50 rounded-full mb-2">
          <Wallet className="w-7 h-7 text-blue-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-semibold text-gray-900">
          Fair Share
        </h1>
        <p className="text-gray-600 text-base max-w-md mx-auto">
          Split bills fairly with friends. Track shared expenses and individual items effortlessly.
        </p>
      </header>


      <div className="space-y-8">
        <section>
          <ParticipantList
            participants={participants}
            onAddParticipant={handleAddParticipant}
            onRemoveParticipant={handleRemoveParticipant}
          />
        </section>

        <section>
          <BillEntry
            participants={participants}
            onAddBill={handleAddBill}
            onUpdateBill={handleUpdateBill}
            editingBill={editingBill}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        <section>
          <SettlementSummary bills={bills} participants={participants} />
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bills</h2>
            <span className="text-sm text-gray-500">
              {bills.length} {bills.length === 1 ? "bill" : "bills"}
            </span>
          </div>
          <BillList
            bills={bills}
            participants={participants}
            onRemoveBill={handleRemoveBill}
            onEditBill={handleEditBill}
          />
        </section>
      </div>
    </main>
  );
}
