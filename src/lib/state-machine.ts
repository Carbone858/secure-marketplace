/**
 * src/lib/state-machine.ts
 *
 * Centralized state-transition guard for Requests and Offers.
 * Call assertValidRequestTransition / assertValidOfferTransition before
 * any status-mutating operation. Any invalid transition throws a typed error
 * that API handlers convert to a 400 response.
 */

// ── Request Status ────────────────────────────────────────────────────────────

export type RequestStatus =
    | 'DRAFT'
    | 'PENDING'
    | 'ACTIVE'
    | 'MATCHING'
    | 'REVIEWING_OFFERS'
    | 'ACCEPTED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'EXPIRED';

/**
 * Valid forward transitions for a ServiceRequest.
 *
 * Rules:
 *   DRAFT          → PENDING, CANCELLED
 *   PENDING        → ACTIVE (admin approve), CANCELLED (admin reject / user delete)
 *   ACTIVE         → MATCHING, REVIEWING_OFFERS, CANCELLED
 *   MATCHING       → REVIEWING_OFFERS, ACTIVE, CANCELLED
 *   REVIEWING_OFFERS → ACCEPTED, ACTIVE, CANCELLED
 *   ACCEPTED       → COMPLETED, CANCELLED
 *   IN_PROGRESS    → COMPLETED, CANCELLED
 *   COMPLETED      → (terminal)
 *   CANCELLED      → (terminal)
 *   EXPIRED        → (terminal)
 */
const REQUEST_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
    DRAFT: ['PENDING', 'CANCELLED'],
    PENDING: ['ACTIVE', 'CANCELLED'],
    ACTIVE: ['MATCHING', 'REVIEWING_OFFERS', 'CANCELLED'],
    MATCHING: ['REVIEWING_OFFERS', 'ACTIVE', 'CANCELLED'],
    REVIEWING_OFFERS: ['ACCEPTED', 'ACTIVE', 'CANCELLED'],
    ACCEPTED: ['COMPLETED', 'CANCELLED'],
    IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
    COMPLETED: [],
    CANCELLED: [],
    EXPIRED: [],
};

/** Thrown when a state transition is illegal. */
export class InvalidTransitionError extends Error {
    public readonly statusCode = 400;
    public readonly errorCode: string;
    constructor(from: string, to: string, entity: 'request' | 'offer') {
        super(`Cannot transition ${entity} from '${from}' to '${to}'.`);
        this.name = 'InvalidTransitionError';
        this.errorCode = `${entity}.invalidTransition`;
    }
}

/**
 * Assert that transitioning a request from `from` → `to` is legal.
 * Throws `InvalidTransitionError` on invalid transitions.
 */
export function assertValidRequestTransition(
    from: RequestStatus,
    to: RequestStatus
): void {
    const allowed = REQUEST_TRANSITIONS[from] ?? [];
    if (!allowed.includes(to)) {
        throw new InvalidTransitionError(from, to, 'request');
    }
}

// ── Offer Status ──────────────────────────────────────────────────────────────

export type OfferStatus =
    | 'PENDING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'WITHDRAWN'
    | 'EXPIRED';

/**
 * Valid transitions for an Offer.
 *
 *   PENDING   → ACCEPTED (request owner), REJECTED (request owner), WITHDRAWN (company)
 *   ACCEPTED  → (terminal — project is created)
 *   REJECTED  → (terminal)
 *   WITHDRAWN → (terminal)
 *   EXPIRED   → (terminal)
 */
const OFFER_TRANSITIONS: Record<OfferStatus, OfferStatus[]> = {
    PENDING: ['ACCEPTED', 'REJECTED', 'WITHDRAWN'],
    ACCEPTED: [],
    REJECTED: [],
    WITHDRAWN: [],
    EXPIRED: [],
};

/**
 * Assert that transitioning an offer from `from` → `to` is legal.
 * Throws `InvalidTransitionError` on invalid transitions.
 */
export function assertValidOfferTransition(
    from: OfferStatus,
    to: OfferStatus
): void {
    const allowed = OFFER_TRANSITIONS[from] ?? [];
    if (!allowed.includes(to)) {
        throw new InvalidTransitionError(from, to, 'offer');
    }
}

// ── Editable states ───────────────────────────────────────────────────────────

/** States in which a request's content (title, description etc.) can be changed. */
export const REQUEST_EDITABLE_STATES: RequestStatus[] = ['DRAFT', 'PENDING', 'ACTIVE'];

/** Assert the request is in an editable state. */
export function assertRequestEditable(status: RequestStatus): void {
    if (!REQUEST_EDITABLE_STATES.includes(status)) {
        throw new InvalidTransitionError(status, 'edited', 'request');
    }
}

/** States in which a request may be cancelled by its owner. */
export const REQUEST_CANCELLABLE_STATES: RequestStatus[] = [
    'DRAFT', 'PENDING', 'ACTIVE', 'MATCHING', 'REVIEWING_OFFERS',
];

export function assertRequestCancellable(status: RequestStatus): void {
    if (!REQUEST_CANCELLABLE_STATES.includes(status)) {
        throw new InvalidTransitionError(status, 'CANCELLED', 'request');
    }
}
