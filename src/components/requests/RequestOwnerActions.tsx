'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Trash2, Loader2, RefreshCw, Edit2 } from 'lucide-react';

interface Props {
    requestId: string;
    deleteLabel: string;
    editHref: string;
    editLabel: string;
    status?: string;
    repostLabel?: string;
}

export function RequestOwnerActions({ requestId, deleteLabel, editHref, editLabel, status, repostLabel }: Props) {
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

    const isTerminal = status === 'CANCELLED' || status === 'REJECTED' || status === 'EXPIRED';

    return (
        <div className="flex gap-2">
            {isTerminal ? (
                <a
                    href={editHref} // Context: editHref is now a clone link e.g., /requests/new?clone=...
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
                >
                    <RefreshCw className="w-4 h-4" /> {repostLabel || 'Repost'}
                </a>
            ) : (
                <a
                    href={editHref}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border border-input rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                    <Edit2 className="w-4 h-4" /> {editLabel}
                </a>
            )}
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
