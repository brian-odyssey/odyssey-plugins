# Waitlist and cancellation policy

## What it is

The UX contract that governs what happens when a class is sold out, when a user wants out of a booked class, and how fees are disclosed along the way. Concretely: how the sold-out state offers a path forward (waitlist with visible count), how the user is told they'll be notified if they get promoted to a confirmed spot (and through which channel), how the late-cancel fee and window are disclosed before booking (not after), and how a booked user cancels in one action from wherever they are looking at their schedule. Every step must be legible on a phone, one-handed, while walking.

## Why it matters in fitness

Fitness inventory is perishable and capped — a reformer spot at 6:15am Tuesday either sells or it doesn't, and a no-show means a spot goes empty while another member who wanted it got nothing. That's why virtually every serious studio charges a late-cancel fee (typically $10–25) or forfeits a class credit on a 8–12 hour window. Those policies are a business necessity, but when they appear as a surprise — buried in fine print, revealed only post-charge — they're the single most common trigger for negative reviews and membership cancellations. Pre-booking disclosure is a fairness contract; omitting it destroys trust on the first violation.

Waitlist UX cuts the other way: shown well (with a count of people ahead, and a clear promotion-notification promise), it is simultaneously social proof ("this class is popular enough to wait for") and a capture mechanism for booking intent that would otherwise evaporate. Shown badly (a bare "Waitlist" button with no count, no channel, no timing), it is a dead-end — users click once, hear nothing, and go to a competitor next week. Barry's and SoulCycle have trained the market to expect waitlist-as-social-proof; studios that ship a bare waitlist button are implicitly saying "we're not serious."

## Anti-patterns

### waitlist-as-dead-end
A "Waitlist" button with no count, no promotion-notification promise, and no explanation of what happens next. User taps, gets added, hears nothing. Generic design reviewers see "waitlist button exists, fine"; fitness-aware reviewers see "zero social proof, zero trust, zero conversion." The waitlist becomes a black box the user won't trust twice.

### hidden-late-cancel-fee
Late-cancel fee amount and window revealed only after booking — in the confirmation email fine print — or worse, revealed only after cancellation, as a surprise line item on the next statement. Violates the fairness contract. Studios lose members over surprise fees more often than over the fees themselves.

### no-promotion-notification
When a user is promoted off the waitlist into a confirmed spot, the system fires an email two hours later (or nothing at all). User misses the class because they never saw the promotion. Studio loses a spot AND a member who now mistrusts the waitlist. Worst-of-both outcome — worse than just leaving the user on the waitlist.

### cancellation-buried-in-settings
Canceling a booked reservation requires Account → Bookings → Past Bookings → Upcoming → tap class → Confirm → second confirm. Fitness cancellations happen on the move, often under time pressure ("my kid is sick, I can't make 5:45"). Friction here doesn't prevent cancellations — it produces no-shows, which is strictly worse for the studio.

### full-without-waitlist
Class is at capacity, UI shows "FULL" as a dead-end label with no waitlist, no alternative time, no other instructor. User's booking intent is wasted. This is a conversion loss the studio paid to acquire.

### generic-scarcity-copy
E-commerce scarcity language ("Hurry, only 2 left!!") dropped into a class card instead of the fitness-native waitlist convention. Reads as spam to fitness buyers who recognize the pattern from Temu and Shein. Fitness audiences respond to instructor trust and peer social proof, not countdown timers.

## Real-world references

### Barry's (US)
- Pattern observed: sold-out classes route to a waitlist where clients are auto-added in order as others cancel. Email notification fires when a spot is secured, but only if promotion happens more than 6 hours before class start. Late-cancel window is 12 hours; inside that window, members forfeit the class from their package and incur a no-show fee (amount varies by studio). Black-tier members get 5 late-cancel-forgiveness credits per quarter automatically applied.
- URL: https://www.barrys.com/faq
- last_verified: 2026-04-15
- What to notice: the auto-promote contract is explicit (order of signup, email channel, 6-hour cutoff for notification) and disclosed on the FAQ before booking.

### SoulCycle
- Pattern observed: unreserve by 5pm the night before class to avoid penalty. $20 late-cancellation fee inside the 12-hour window. Unlimited-series members pay a separate $15 (US) / £10 (UK) penalty for late-cancel or no-show. SuperSoul VIP tier includes priority waitlist status as a named benefit.
- URL: https://www.soul-cycle.com/uk/faq/
- last_verified: 2026-04-15
- What to notice: exact fee dollar amount published on the FAQ. Waitlist priority is productized as a tier benefit, which only works because the waitlist UX is trusted enough to be worth jumping.

### Solidcore
- Pattern observed: 10-hour cancellation window (not 12, which is the boutique-Pilates norm). Unlimited-membership members who late-cancel or no-show incur a fee; first offense in any 30-day period is auto-waived for monthly unlimited members. Arriving 5+ minutes late counts as a no-show. Separate published blog post titled "Tips and Tricks for Getting Off the solidcore Waitlist" treats the waitlist as a documented, engaged-with system.
- URL: https://solidcore.co/cancellation-policy
- last_verified: 2026-04-15
- What to notice: the first-offense-forgiveness pattern is a trust-building mechanic worth copying — it converts a fee event into a loyalty event. Tardiness is in the same policy surface as cancellation, which is the right conceptual grouping.

### Equinox
- Pattern observed: 3-hour cancellation window for group fitness booked via the app. No direct dollar fee, but 3 no-shows in a 30-day window trigger a 7-day booking ban. Missed/late-cancelled sessions are explicitly non-refundable and non-reinstateable.
- URL: https://www.equinox.com/member-policies
- last_verified: 2026-04-15
- What to notice: membership-gym alternative model — instead of per-incident fees, Equinox uses behavioral throttling (temporary booking ban). Works because the core product is the membership, not the class credit. Boutique studios with class-pack economics can't use this pattern.

### Orangetheory
- Pattern observed: 8-hour cancellation window is the franchise default, but individual studios set their own and some require 12 hours. Late-cancel fee $10–$15 depending on location. Premier (unlimited) members pay the fee directly; Basic/Elite members forfeit a class credit. Cancel via app or by calling the studio.
- URL: https://o-theoryfitnesspricing.com/late-cancel-no-show-fees/
- last_verified: 2026-04-15
- What to notice: franchise-inconsistency risk. When fee and window vary by location, the UI must show the exact studio's policy on the class card, not a brand-level average. Otherwise the fee feels like a bait-and-switch.

## Reference implementation (shadcn + Tailwind)

```tsx
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type ClassCardProps = {
  title: string
  instructor: string
  startsAt: string // e.g. "Tue 6:15am"
  isFull: boolean
  waitlistCount: number
  bookedByUser: boolean
  lateCancelFeeUsd: number
  cancelWindowHours: number
  notificationChannel: "text" | "push" | "email"
  onJoinWaitlist: () => void
  onCancelBooking: () => void
}

export function ClassCard(props: ClassCardProps) {
  const {
    title, instructor, startsAt, isFull, waitlistCount, bookedByUser,
    lateCancelFeeUsd, cancelWindowHours, notificationChannel,
    onJoinWaitlist, onCancelBooking,
  } = props

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {instructor} · {startsAt}
          </p>
        </div>
        {isFull && !bookedByUser && (
          <Badge variant="secondary" className="shrink-0">
            Waitlist · {waitlistCount} ahead
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Fee disclosure is INLINE on the card, not in a confirmation email */}
        <p className="text-xs text-muted-foreground">
          Cancel {cancelWindowHours}+ hours ahead to avoid the $
          {lateCancelFeeUsd} late-cancel fee.
        </p>

        {isFull && !bookedByUser && (
          <Alert>
            <AlertDescription className="text-xs">
              We'll {notificationChannel} you if a spot opens — up to 2 hours
              before class.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {bookedByUser ? (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel {title}?</DialogTitle>
                <DialogDescription>
                  Canceling now is inside the {cancelWindowHours}-hour window,
                  so you'll be charged the ${lateCancelFeeUsd} late-cancel fee.
                  This fee covers the spot we can't resell this close to class.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Keep my spot</Button>
                <Button variant="destructive" onClick={onCancelBooking}>
                  Cancel & pay ${lateCancelFeeUsd}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        ) : isFull ? (
          <Button onClick={onJoinWaitlist}>
            Join waitlist · {waitlistCount} ahead
          </Button>
        ) : (
          <Button>Book</Button>
        )}
      </CardFooter>
    </Card>
  )
}
```

Three things to notice in the snippet: (1) the waitlist count appears in both the badge and the button label — redundant on purpose, because the count is the social-proof signal and the CTA; (2) the late-cancel fee and window are on the card body regardless of booking state, so users see them before they book; (3) the cancel dialog restates the exact fee amount and explains why (the resell window closed) — never surprises the user with the number.

## Measurable checks

### waitlist_count_visible
**Condition:** When a class is at capacity, the waitlist CTA shows a count of people currently on the waitlist (e.g., "Join waitlist · 4 ahead"). A bare "Waitlist" label with no count fails.
**Reasoning:** The count is simultaneously social proof and intent-calibration. Without it, users can't tell if the waitlist is worth joining, and the pattern collapses into a dead-end.

### promotion_notification_promise
**Condition:** Before the user commits to joining the waitlist, the UI discloses (a) through which channel they'll be notified if promoted — text, push, or email, named explicitly — and (b) the timing guarantee ("up to 2 hours before class" or equivalent). "We'll let you know" without channel and timing fails.
**Reasoning:** Users won't join a waitlist they don't trust to reach them in time. Barry's 6-hour email cutoff is a transparent version of this; silent waitlists are the opaque version.

### late_cancel_fee_disclosed_before_booking
**Condition:** The late-cancel fee amount in dollars and the cancellation window in hours is visible on the class card or the checkout screen before the user confirms the booking. Disclosure only in a post-booking confirmation email or a terms-of-service link fails.
**Reasoning:** Pre-booking disclosure is the fairness contract. Every studio with a surprise-fee reputation can trace it back to hiding this.

### cancel_action_one_tap_from_schedule
**Condition:** From the user's schedule view (or the booked class card), canceling is reachable in a single tap that opens a confirmation dialog. Requiring navigation through Account → Bookings → Upcoming → detail → Cancel fails.
**Reasoning:** Fitness cancellations happen one-handed on the way out the door. Friction here produces no-shows, not retained bookings — a strictly worse outcome for the studio.

### sold_out_always_offers_path_forward
**Condition:** A 100%-full class always renders a next action: waitlist join, next-available class time for the same class type, or same-instructor-elsewhere. A terminal "FULL" label with no action fails.
**Reasoning:** Booking intent is expensive to acquire; wasting it on a dead-end is a pure loss.

### cancellation_fee_consistency
**Condition:** The fee amount and cancellation window shown pre-booking match the fee amount and window shown in the cancellation confirmation dialog and the eventual receipt. Any drift between surfaces fails.
**Reasoning:** Inconsistency between quoted and charged fee reads as bait-and-switch even when it's a bug. One inconsistency destroys trust across the whole booking flow.

### franchise_studio_policy_localized
**Condition:** When fees and windows vary by location (franchise model), the class card shows the specific studio's fee and window — not a brand-level average or a generic placeholder. Applies only to multi-location/franchise systems.
**Reasoning:** Orangetheory's per-studio variance is the archetypal trap: a user books expecting the 8-hour window and gets charged under a 12-hour one because their local studio is stricter. Location-localized disclosure is the only fix.

## Cross-pattern notes

- Interacts with `capacity-signal.md` — capacity-signal handles threshold language ("filling up", "1 spot left") for partially-full classes; waitlist-cancellation takes over at 100% capacity. The handoff happens exactly at sold-out.
- Interacts with `booking-flow.md` — the late-cancel-fee disclosure belongs on the booking confirmation step defined in booking-flow, and this file requires it there. If booking-flow's confirmation screen omits the fee, booking-flow is wrong.
- Interacts with `recurring-membership.md` — unlimited-membership members often face different late-cancel economics (flat fee vs. credit forfeiture). Disclosure on the class card should reflect the viewing user's membership type when known.
- **Precedence rule 4 from SKILL.md:** waitlist-cancellation beats capacity-signal for the sold-out state. A waitlist button with a count wins over a "FULL" dead-end label even when capacity-signal would otherwise govern the red/amber/green scarcity framing.
