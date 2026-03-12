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
    // optimisticState represents the immediate visual feedback ('ACCEPTED' or 'REJECTED')
    const [optimisticState, setOptimisticState] = useState<'ACCEPTED' | 'REJECTED' | null>(null);
    const [isReverting, setIsReverting] = useState(false);

    const updateOffer = async (action: 'accept' | 'reject') => {
        // Optimistic UI: Immediately update the state as if it succeeded
        const newStatus = action === 'accept' ? 'ACCEPTED' : 'REJECTED';
        setOptimisticState(newStatus);
        
        try {
            const res = await fetch(`/api/offers/${offerId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.message || 'Failed');
            
            // True success: The background request cleared. 
            toast.success(
                action === 'accept' ? 'Offer accepted! 🎉' : 'Offer rejected',
                { description: action === 'accept' ? 'The company has been notified.' : 'The company has been notified.' }
            );
            
            // Re-fetch server components silently
            router.refresh(); 
        } catch (err: any) {
            // Revert Optimistic UI if the network request actually failed
            setIsReverting(true);
            toast.error(err.message || `Failed to ${action} offer. Please check your connection.`);
            setTimeout(() => {
                setOptimisticState(null);
                setIsReverting(false);
            }, 1000); // Brief delay so they read the error before the buttons jump back
        }
    };

    // If we optimistically updated, show the resulting badge instantly
    if (optimisticState) {
        if (optimisticState === 'ACCEPTED') {
            return (
                <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium transition-opacity ${isReverting ? 'opacity-50' : 'animate-in fade-in'}`}>
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    {acceptLabel} {isReverting ? '(Reverting...)' : '(Processing...)'}
                </div>
            );
        }
        return (
            <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 bg-destructive/5 text-destructive border border-destructive/20 rounded-lg font-medium transition-opacity ${isReverting ? 'opacity-50' : 'animate-in fade-in'}`}>
                <XCircle className="w-5 h-5 text-destructive" />
                {rejectLabel} {isReverting ? '(Reverting...)' : '(Processing...)'}
            </div>
        );
    }

    // Default State: Buttons
    return (
        <div className="mt-4 flex gap-3">
            <button
                onClick={() => updateOffer('accept')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                title={acceptLabel}
            >
                <CheckCircle className="w-4 h-4" />
                {acceptLabel}
            </button>
            <button
                onClick={() => updateOffer('reject')}
                className="inline-flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors"
                title={rejectLabel}
            >
                <XCircle className="w-4 h-4 text-muted-foreground" />
                {rejectLabel}
            </button>
        </div>
    );
}
