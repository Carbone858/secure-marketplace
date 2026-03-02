'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Trash2, Loader2 } from 'lucide-react';

interface Props {
    requestId: string;
    deleteLabel: string;
    editHref: string;
    editLabel: string;
}

export function RequestOwnerActions({ requestId, deleteLabel, editHref, editLabel }: Props) {
    const router = useRouter();
    const locale = useLocale();
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = async () => {
        if (!confirmDelete) {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 4000); // auto-reset after 4s
            return;
        }
        setDeleting(true);
        try {
            const res = await fetch(`/api/requests/${requestId}`, { method: 'DELETE' });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || 'Failed to delete');
            }
            toast.success('Project deleted successfully');
            router.push(`/${locale}/dashboard/requests`);
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete project');
        } finally {
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    return (
        <div className="flex gap-2">
            <a
                href={editHref}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-input rounded-lg hover:bg-muted transition-colors"
            >
                ✏️ {editLabel}
            </a>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors ${confirmDelete
                        ? 'bg-destructive text-white hover:bg-destructive/90'
                        : 'border border-destructive/40 text-destructive hover:bg-destructive/10'
                    }`}
            >
                {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Trash2 className="w-4 h-4" />
                )}
                {confirmDelete ? '⚠️ Confirm Delete' : deleteLabel}
            </button>
        </div>
    );
}
