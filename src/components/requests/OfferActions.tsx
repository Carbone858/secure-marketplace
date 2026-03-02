'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Props {
    offerId: string;
    requestId: string;
    acceptLabel: string;
    rejectLabel: string;
}

export function OfferActions({ offerId, requestId, acceptLabel, rejectLabel }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState<'accept' | 'reject' | null>(null);

    const updateOffer = async (action: 'accept' | 'reject') => {
        setLoading(action);
        try {
            const status = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
            const res = await fetch(`/api/offers/${offerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed');
            toast.success(
                action === 'accept' ? 'Offer accepted! 🎉' : 'Offer rejected',
                { description: action === 'accept' ? 'The company has been notified.' : 'The company has been notified.' }
            );
            router.refresh();
        } catch (err: any) {
            toast.error(err.message || `Failed to ${action} offer`);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="mt-4 flex gap-3">
            <button
                onClick={() => updateOffer('accept')}
                disabled={!!loading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
            >
                {loading === 'accept' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                {acceptLabel}
            </button>
            <button
                onClick={() => updateOffer('reject')}
                disabled={!!loading}
                className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted disabled:opacity-60 transition-colors"
            >
                {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                {rejectLabel}
            </button>
        </div>
    );
}
