# Single-class booking flow

## What it is

The end-to-end flow a user moves through to go from "I want to work out at 6pm" to "I have a confirmed reservation for the 6pm class and it's on my calendar." In practice: tap a class card → see a time slot with instructor and capacity context → confirm the reservation in one tap (or one sheet) → land on a confirmation state with calendar-add and cancellation affordances. For logged-in, paying members the whole flow should feel like a single decisive commit, not a checkout.

## Why it matters in fitness

Fitness booking is not e-commerce checkout. There is no cart — a class is a time slot, not a SKU; stacking two of them in a cart makes no sense because they compete for the same body at the same hour. There is no shipping, no billing step (credits or membership are prepaid), and usually no upsell surface — the user has already bought the right to book. The purchase decision was made upstream, on the membership or intro-offer page. The booking flow's job is to collapse latency between intent and confirmation.

Three fitness-specific forces shape this: (1) time sensitivity — a 6am class on Saturday fills in minutes at popular studios, so every extra tap loses conversions; (2) calendar integration — the user needs this event on their phone calendar or they'll forget and incur a late-cancel fee; (3) repeat purchase — a committed member books 2–4 times per week, so the flow is traversed dozens of times per month per user. Friction compounds. A web checkout pattern imported from Shopify — product page → cart → shipping → payment → confirm — is catastrophic here and a reliable sign the team didn't understand the domain.

## Anti-patterns

### cart-pattern-for-bookings
Treating the booking flow as e-commerce checkout — adding classes to a "cart," showing a cart count badge in the header, requiring a "proceed to checkout" step before confirmation. Fails because a class is a time slot tied to a body and an hour; two classes at the same time are mutually exclusive, not a multi-item order. The cart metaphor adds an unnecessary state, invites "save for later" confusion, and buries the confirm action one tap deeper than it needs to be. Generic Shopify-style fitness plugins ship this by default.

### modal-trap-no-confirmation
Opening a booking modal that confirms the reservation silently when dismissed, or that confirms only if the user taps the exact right button among several ("Reserve," "Confirm," "Book," "Done"). The user walks away unsure whether they're booked. Fails because fitness bookings carry real consequences (late-cancel fees, no-show fees, lost credits) — ambiguity about reservation state is a trust-destroying failure mode. Especially bad on mobile, where dismissing a sheet by swiping down is ambiguous.

### calendar-afterthought
Ending the confirmed-booking state with only a text message ("You're booked!") and no explicit "Add to calendar" affordance, or hiding it behind a secondary menu, or emailing the calendar invite hours later. Fails because the user needs the event on their calendar at the moment of commitment — that's when motivation and attention are highest. If they have to hunt for it, they won't, and the 6am class becomes a no-show. Member apps that send calendar invites only by email miss the mobile-web user entirely.

### login-wall-mid-flow
Letting a logged-out user tap a class, pick a time, review it, and only at the final confirm step demanding login or signup. Fails because all the decision work the user just did (picking a time slot, picking an instructor) is invisible to the auth wall — after login they're dumped on a generic dashboard and have to find the same class again. If auth is required, gate it at the schedule page, not at the confirm step. Or better: allow session-persisted state across login.

### post-confirm-dead-end
Reaching the confirmation state with no visible next action — no "Add to calendar," no "Cancel reservation," no "Book another class," no "See you at [location]." Fails because this is the highest-trust moment of the session — the user just committed — and leaving them on a blank "You're booked!" card wastes the moment. In fitness the natural next actions are: add to calendar, share with a friend (bring-a-guest is common), book an adjacent class later in the week, or see prep instructions ("arrive 10 min early, grippy socks required").

## Real-world references

### Barry's
- Pattern observed: Web schedule page lists classes with instructor, time, and studio. A "Reserve" button on each row commits the booking directly; full classes show "Waitlist" inline in place of "Reserve." No cart.
- URL: https://www.barrys.com/schedule
- last_verified: 2026-04-15
- What to notice: The schedule row is the booking surface. There is no intermediate product-page step, no cart, no review screen before the action. One tap from "I see a class I want" to "it's committed." Waitlist replaces the reserve button in-place so the affordance stays consistent whether full or open.

### ClassPass
- Pattern observed: Search or browse → tap a class time → tap blue "Reserve" → review checkout sheet with credit cost and details → tap blue "Confirm reservation." A deliberate double-confirm pattern because credits are being spent, not because a cart is being assembled.
- URL: https://help.classpass.com/hc/en-us/articles/204335689-How-do-I-make-a-reservation
- last_verified: 2026-04-15
- What to notice: Two-tap confirm is a conscious choice around credit-spend reversibility, not an e-commerce cart. The review step shows credit cost and class details only; no shipping, no upsell, no "other classes you might like." It's a commit dialog, not a checkout.

### Solidcore
- Pattern observed: App shows "Book" button on open classes; when full, the same button position shows "Waitlist" instead. Reservation and waitlist are co-equal primary affordances, not a fallback state buried after a failed booking attempt.
- URL: https://solidcore.co/blog/solidcore-waitlist-tips
- last_verified: 2026-04-15
- What to notice: Waitlist is treated as a first-class booking outcome, not as an error state. The user is never told "sorry, this class is full, go find another" — they're offered a real action on the same class.

### Equinox+
- Pattern observed: Class detail page has a primary "Add to Schedule" button; after booking, classes surface on a Calendar tab in the app and can be synced to the phone's native calendar. Cancellation from the same calendar view, one tap.
- URL: https://eqx.my.site.com/memberexperience/s/article/How-Can-I-Add-A-Live-Class-To-My-Schedule-From-The-App
- last_verified: 2026-04-15
- What to notice: Calendar is not an afterthought feature — it is the post-booking home for the reservation. Schedule, cancel, and sync-to-device calendar all live on the same surface, which is the natural mental model of "my upcoming classes."

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — adapted from shadcn primitives, typecheck-clean in isolation.
// Adapt to target brand. Not CI-validated against any specific project.
// Happy path: logged-in member taps a class row, confirms in a Dialog, lands on a confirmed state with calendar + cancel.

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CalendarPlus, X, Check } from "lucide-react"

type ClassSlot = {
  id: string
  startsAt: Date
  durationMin: number
  instructor: string
  location: string
  spotsRemaining: number
  capacity: number
}

type Props = { slot: ClassSlot; onReserve: (id: string) => Promise<void>; onCancel: (id: string) => Promise<void> }

export function BookingRow({ slot, onReserve, onCancel }: Props) {
  const [state, setState] = useState<"idle" | "confirming" | "booked">("idle")
  const [open, setOpen] = useState(false)

  const isFull = slot.spotsRemaining === 0
  const isAlmostFull = slot.spotsRemaining > 0 && slot.spotsRemaining <= 2

  async function handleConfirm() {
    setState("confirming")
    await onReserve(slot.id)
    setState("booked")
    setOpen(false)
  }

  if (state === "booked") {
    return (
      <Card className="border-emerald-500/40 bg-emerald-500/5">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Check className="h-4 w-4 text-emerald-500" />
              You're booked
            </CardTitle>
            <CardDescription>
              {slot.instructor} · {slot.location} · {formatTime(slot.startsAt)}
            </CardDescription>
          </div>
          <Badge variant="secondary">Confirmed</Badge>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" asChild>
            <a href={calendarDownloadHref(slot)} download={`${slot.id}.ics`}>
              <CalendarPlus className="mr-1 h-4 w-4" /> Add to calendar
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onCancel(slot.id)}>
            <X className="mr-1 h-4 w-4" /> Cancel reservation
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle className="text-base">{formatTime(slot.startsAt)}</CardTitle>
          <CardDescription>
            {slot.instructor} · {slot.durationMin} min · {slot.location}
          </CardDescription>
        </div>
        {isAlmostFull && !isFull ? (
          <Badge className="bg-amber-500/15 text-amber-600">Almost full</Badge>
        ) : null}
      </CardHeader>
      <CardFooter>
        {isFull ? (
          <Button variant="secondary" className="w-full" onClick={() => onReserve(slot.id)}>
            Join waitlist
          </Button>
        ) : (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Reserve</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm reservation</DialogTitle>
                <DialogDescription>
                  {slot.instructor} · {formatTime(slot.startsAt)} · {slot.location}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Back
                </Button>
                <Button onClick={handleConfirm} disabled={state === "confirming"}>
                  {state === "confirming" ? "Reserving…" : "Confirm"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  )
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}

function calendarDownloadHref(slot: ClassSlot) {
  // Return a data URL for an .ics file the browser downloads on click.
  const end = new Date(slot.startsAt.getTime() + slot.durationMin * 60_000)
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `UID:${slot.id}`,
    `DTSTART:${toIcs(slot.startsAt)}`,
    `DTEND:${toIcs(end)}`,
    `SUMMARY:${slot.instructor} at ${slot.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`
}

function toIcs(d: Date) {
  return d.toISOString().replace(/[-:]|\.\d{3}/g, "")
}
```

## Measurable checks

Prose heuristics a reviewer applies to the rendered page. Pass/fail judgments.

### taps_to_confirm
**Condition:** A logged-in member can go from the schedule page to a confirmed reservation in at most two deliberate taps (tap the class → tap confirm). The confirm step may be a modal, sheet, or inline — but no more than one intermediate screen.
**Reasoning:** Fitness users book repeatedly, often from a phone in transit. Every extra tap between intent and commit compounds across hundreds of bookings per member per year. Industry leaders (Barry's, ClassPass) hold this line; a three-or-more-tap flow is a regression to e-commerce checkout thinking.

### no_cart_semantics
**Condition:** The flow exposes no "cart," "bag," "basket," "items," or header cart-count badge. The schedule row or class detail page is the final staging ground before confirm.
**Reasoning:** A class is a time slot, not a SKU. Cart semantics invite stacking conflicts (two classes at the same time), "save for later" confusion, and a pattern mismatch that generic checkout-style CRO instincts will try to optimize in the wrong direction.

### unambiguous_confirmation_state
**Condition:** After a successful booking, the UI presents a visually distinct confirmed state — not a toast that disappears, not a silent modal dismissal. The state names the class (time, instructor, location) and remains on screen until the user acts.
**Reasoning:** Fitness bookings carry real money consequences (late-cancel, no-show fees). A user who isn't sure whether they're booked will either double-book or skip the class. The confirmation state is the single-source-of-truth moment for the user's commitment.

### calendar_add_on_confirmation
**Condition:** The confirmed state includes a visible, primary-weight "Add to calendar" affordance that generates a native calendar event (.ics download, `webcal://` link, or platform calendar API). Not buried in a secondary menu. Not email-only.
**Reasoning:** The moment of confirmation is the peak-motivation moment for calendar capture. If the user has to hunt for it or wait for an email, most won't, and the class becomes a no-show. Equinox surfaces this on the class detail; the rest of the industry treats it as an afterthought and pays in no-shows.

### cancel_reachable_from_confirmation
**Condition:** The confirmed state and the user's upcoming-classes view both expose a direct "Cancel reservation" affordance (one tap to open a confirm-cancel dialog). Not buried in account settings.
**Reasoning:** The cancellation policy is a contract (late-cancel fees enforce it). Hiding the cancel path creates the worst outcome for both user and studio: the user no-shows because they couldn't cancel in time, eats the fee, and blames the studio. Surfacing cancel where the booking lives is trust-positive, not conversion-negative.

### no_mid_flow_auth_gate
**Condition:** If the site supports browsing the schedule logged out, auth is demanded at the schedule page (or earlier), not at the confirm step. State (selected class, selected time) survives the auth round-trip so the user lands back on the same reservation they were about to confirm.
**Reasoning:** Surfacing auth at the last step throws away all the decision work the user just did. Users who log in from a generic redirect target often can't find the class they'd picked and abandon. Gate early, persist state, or skip the logged-out schedule entirely.

## Cross-pattern notes

- **`capacity-signal.md`** governs how scarcity is shown on a class row (qualitative vs numeric, color thresholds). This pattern consumes that signal but doesn't define it.
- **`waitlist-cancellation.md`** governs sold-out state. Precedence rule 4 from SKILL.md applies: the "Join waitlist" button in the reference implementation is the correct treatment; a dead-end "FULL" label violates that pattern, not this one.
- **`intro-offer-funnel.md`** owns the first-visit journey. For a new visitor hitting a booking surface, intro-offer messaging takes precedence over this pattern's happy-path assumption of a paid member. The member booking flow is the steady-state; the intro-offer flow is the on-ramp.
- **`mobile-first-defaults.md`** applies globally — precedence rule 1. The reference implementation above is mobile-sized (`w-full` buttons, Dialog not a sidebar) by default.
- **`kiosk-checkin.md`** is explicitly out of scope. Web booking and in-studio kiosk check-in are different surfaces with different affordance sizes and auth models. Never mix.
