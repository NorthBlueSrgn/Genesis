import React, { useState } from 'react';
import { X, FileText, Clock, Pause, Play, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskEditModalProps {
    task: Task;
    pathId: string;
    onClose: () => void;
    onSave: (updates: Partial<Task>) => void;
    onDelete: () => void;
    onSnooze: (until?: string) => void;
    onUnsnooze: () => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
    task,
    pathId,
    onClose,
    onSave,
    onDelete,
    onSnooze,
    onUnsnooze
}) => {
    const [description, setDescription] = useState(task.description);
    const [notes, setNotes] = useState(task.notes || '');
    const [snoozeUntil, setSnoozeUntil] = useState(
        task.snoozedUntil ? new Date(task.snoozedUntil).toISOString().split('T')[0] : ''
    );

    const handleSave = () => {
        onSave({ description, notes });
        onClose();
    };

    const handleSnooze = () => {
        if (snoozeUntil) {
            onSnooze(new Date(snoozeUntil).toISOString());
        } else {
            // Snooze for 1 day if no date selected
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            onSnooze(tomorrow.toISOString());
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-sm bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black font-orbitron text-white uppercase tracking-wide">
                                Edit Task
                            </h2>
                            <p className="text-xs text-gray-500 font-mono mt-0.5">
                                0x{task.id.slice(0, 8).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-sm transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Description */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                            Task Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-sm text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="Enter task description..."
                        />
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                            Notes / Details
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-sm text-white font-mono text-sm focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                            placeholder="Add optional notes or instructions..."
                        />
                    </div>

                    {/* Snooze Section */}
                    <div className="border-t border-gray-800 pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-amber-400" />
                            <label className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                Snooze Task
                            </label>
                        </div>
                        
                        {task.isSnoozed ? (
                            <div className="space-y-3">
                                <div className="px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-sm">
                                    <p className="text-sm text-amber-400 font-mono">
                                        Task snoozed until: {task.snoozedUntil ? new Date(task.snoozedUntil).toLocaleDateString() : 'indefinitely'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => { onUnsnooze(); onClose(); }}
                                    className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 rounded-sm text-green-400 font-black text-sm uppercase tracking-wide hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Play className="w-4 h-4" />
                                    Unsnooze Task
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <input
                                    type="date"
                                    value={snoozeUntil}
                                    onChange={(e) => setSnoozeUntil(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-sm text-white font-mono text-sm focus:outline-none focus:border-amber-500/50 transition-colors"
                                />
                                <button
                                    onClick={handleSnooze}
                                    className="w-full px-4 py-3 bg-amber-500/10 border border-amber-500/30 rounded-sm text-amber-400 font-black text-sm uppercase tracking-wide hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Pause className="w-4 h-4" />
                                    Snooze Task
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-900 border-t border-gray-800 p-6 flex gap-3">
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
                                onDelete();
                                onClose();
                            }
                        }}
                        className="px-6 py-3 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 font-black text-sm uppercase tracking-wide hover:bg-red-500/20 transition-colors flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </button>
                    <div className="flex-1" />
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-sm text-gray-300 font-black text-sm uppercase tracking-wide hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-sm text-cyan-400 font-black text-sm uppercase tracking-wide hover:bg-cyan-500/20 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskEditModal;
