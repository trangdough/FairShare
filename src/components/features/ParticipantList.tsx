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
        <Card className="w-full">
            <div className="flex items-center gap-2 mb-5">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Participants</h2>
            </div>

            <form onSubmit={handleAdd} className="flex gap-2 mb-6">
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

            <div className="flex flex-wrap gap-2">
                {participants.map((participant) => (
                    <div
                        key={participant.id}
                        className="group flex items-center gap-2 bg-gray-100 border border-gray-200 rounded-full pl-3.5 pr-1.5 py-1.5 transition-all hover:bg-gray-50 hover:border-blue-300"
                    >
                        <span className="text-sm font-medium text-gray-800">
                            {participant.name}
                        </span>
                        <button
                            onClick={() => onRemoveParticipant(participant.id)}
                            className="p-1 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Remove ${participant.name}`}
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ))}

                {participants.length === 0 && (
                    <p className="text-sm text-gray-500 w-full text-center py-4">
                        No participants yet. Add someone to get started!
                    </p>
                )}
            </div>
        </Card>
    );
}
