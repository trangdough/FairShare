import React, { useState } from "react";
import { Participant } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { X, UserPlus, Users } from "lucide-react";

interface ParticipantListProps {
    participants: Participant[];
    onAddParticipant: (name: string) => void;
    onRemoveParticipant: (id: string) => void;
}

export function ParticipantList({
    participants,
    onAddParticipant,
    onRemoveParticipant,
}: ParticipantListProps) {
    const [newName, setNewName] = useState("");

    const handleAdd = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (newName.trim()) {
            onAddParticipant(newName.trim());
            setNewName("");
        }
    };

    return (
        <Card className="px-10 py-8">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                    <Users className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Participants</h2>
            </div>

            {participants.length === 0 && (
                <p className="text-sm text-gray-400 mb-6 pl-1">
                    No participants yet. Add someone to get started!
                </p>
            )}

            <form onSubmit={handleAdd} className={`flex gap-2 mb-8 ${participants.length > 0 ? 'mt-8' : ''}`}>
                <Input
                    placeholder="Enter name (e.g. Alice)"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={!newName.trim()}>
                    <UserPlus className="w-4 h-4 mr-1.5" />
                    Add
                </Button>
            </form>

            <div className="flex flex-col gap-3">
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className="group flex items-center justify-between bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl px-4 py-3 transition-all hover:from-purple-500/30 hover:to-blue-500/30 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20"
                    >
                        <span className="text-sm font-medium text-gray-100">
                            {participant.name}
                        </span>
                        <button
                            onClick={() => onRemoveParticipant(participant.id)}
                            className="p-1 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                            aria-label={`Remove ${participant.name}`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
}
