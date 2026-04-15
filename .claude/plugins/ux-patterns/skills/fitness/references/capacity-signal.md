# Capacity and availability signal

## What it is

A visual and verbal indicator of how full a class is. Capacity signal spans the full range from "wide open" through "filling up" and "almost full" to "sold out / waitlist." It shows up as color (neutral / amber / red), as copy ("8 spots", "Almost full", "1 spot left", "Waitlist"), as CTA state (book / waitlist), and as relative emphasis on a row or card. The job of the signal is to convert hesitation into booking at the moment of peak loss-aversion, without tripping the panic response that makes people close the tab.

## Why it matters in fitness

Fitness buyers are loss-averse in a specific way: they want the class that fills up, because the filled class is socially validated — good instructor, good time slot, good studio. A class that's always empty looks like a class nobody wants. So "Almost full" is not a warning, it is a positive signal that pushes the undecided user into booking. This is the opposite of how capacity reads in airline seats or concert tickets, where full means you've missed out and expensive.

The risk is that panic thresholds are close to urgency thresholds. Red at 80% capacity reads as "too late, move on" — the same brain pattern that makes users abandon sold-out checkout carts. Red at 95% with a waitlist option reads as "hurry, and here is your fallback." The difference between a studio that converts at 80% capacity and one that abandons is literally a color threshold and a word choice. Boutique studios (Barry's, SoulCycle, Solidcore) have converged on qualitative "Almost full" + waitlist as social proof; franchises (Orangetheory) lean more on waitlist position numbers; the common thread is that sold out is never a dead end.

## Anti-patterns

### red-at-80%
Red color (`bg-red-500`, `text-red-600`, red dots, red borders) applied to classes at 80% capacity or below. Fails because red in Western UX reads as danger, error, or denial — not urgency. At 80% the class is popular and the user still has agency; flagging it with the same color palette used for failed payments and 404s tells the user to give up rather than hurry. The correct response at 80% is amber: warm, warning, still actionable. Red belongs only at 95%+ when paired with a waitlist CTA. A studio that uses red at 80% is measurably leaving conversions on the floor — the user reads "too late" and closes the tab instead of booking.

### silent-until-full
Classes display no capacity signal at any fill level, then suddenly flip to "FULL" at 100%. Fails because it eliminates the urgency window entirely. The entire value of capacity signaling in fitness is the "act now" moment between 70% and 99% full — that is where loss-aversion does its work. A page that hides capacity until the class is gone is a page that optimizes for "clean design" at the cost of conversion. Users who would have booked at 85% had they known it was filling instead see empty-looking rows, delay, and then see FULL and are annoyed.

### exact-number-forever
Every class in every state shows the exact numeric form "12/14 spots" or "2 spots available." Fails because numeric precision is emotionally flat — it treats a workout reservation like an inventory line. Qualitative language ("Almost full", "1 spot left", "Filling up") carries urgency that numbers do not. At 50% capacity, numeric is fine and even reassuring. At 85% capacity, numeric is a missed opportunity — the UI is saying "2 of 14" when a human would say "grab it now." Keeping numbers at the top of the funnel misses the conversion moment; swapping in qualitative copy above 70% captures it.

### cart-abandonment-scarcity
Importing e-commerce scarcity tactics ("Only 1 left!!", countdown timers on the row, pulsing red badges, "847 people viewing this class") into fitness booking. Fails because fitness has a different trust dynamic than retail — the user is a member or subscriber, not a one-shot shopper, and aggressive scarcity reads as sleazy and erodes brand trust over repeat visits. The tactics that drive a sock purchase on a cold-traffic Shopify store actively damage a reformer studio's relationship with its regulars. Use the fitness-native vocabulary (amber pill, "Almost full", waitlist count as social proof) not the retail vocabulary.

### dead-end-full-label
Classes at 100% capacity render a static "FULL" label or disabled button with no waitlist path. Fails because it converts an interested user into a lost session — they see FULL, they leave. A waitlist CTA at the same moment converts the same user into a probable booking (waitlists run 40-60% absorption at most boutique studios due to the 12-hour cancellation window). Even when waitlist is not technically available, "Join waitlist (full)" with a count beats a mute FULL label because the count is social proof for the rest of the schedule ("this instructor is in demand — let me check her other times").

## Real-world references

### Barry's
- Pattern observed: Schedule page distinguishes bookable classes from full classes with a "WAITLIST" CTA, not a dead-end FULL label. Their FAQ describes the 12-hour cancellation window and the 6-hour waitlist promotion window, which is what makes the waitlist CTA a real conversion path and not a placebo.
- URL: https://www.barrys.com/schedule
- last_verified: 2026-04-15
- What to notice: Sold-out state is a CTA, not a label. The waitlist is presented as "your backup plan," not "sorry, you're out of luck." Copy on the FAQ is explicit that arriving 5 minutes early gets you added from waitlist — the brand makes the waitlist feel real.

### SoulCycle
- Pattern observed: Studio schedule pages show "Reserve" for open classes and "Waitlist" for full classes, rendered as equal-weight CTAs side by side across the grid. Full classes are not visually suppressed — they render at the same prominence as bookable ones, so waitlist demand functions as social proof for the instructor and time slot.
- URL: https://www.soul-cycle.com/find-a-class/studio/16/
- last_verified: 2026-04-15
- What to notice: The waitlist button looks like the reserve button — same shape, same weight. Red is absent from the capacity treatment entirely; the differentiation is copy ("Waitlist" vs "Reserve"), not color panic.

### Equinox
- Pattern observed: Waitlist position shown as an explicit number when the user is in the top 10 ("you are #3"), and as "10+ members ahead" beyond that. Booking and waitlist both close 5 minutes before class — the signal degrades gracefully into a closed state rather than flipping binary.
- URL: https://www.equinox.com/bookingrules
- last_verified: 2026-04-15
- What to notice: Waitlist position is a first-class signal, not a hidden internal. The user knows exactly where they stand, which converts waitlist joining into an informed decision rather than a hopeful gesture. The 10+ cap prevents the panic of seeing "position 47."

### Orangetheory
- Pattern observed: Once a user joins the waitlist, the booking icon changes to a blue circle showing the user's exact waitlist position. Full classes remain visible on the schedule with an active waitlist CTA — they are not hidden or grayed into uselessness.
- URL: https://membersupport.orangetheoryfitness.com/hc/en-us/sections/360005256914-Waitlist
- last_verified: 2026-04-15
- What to notice: Blue (not red) for the waitlist state. Blue reads as "informational / in progress" not "denied." The position number is visible in the booking row itself, so the user does not have to navigate to a separate page to see where they stand.

### Solidcore
- Pattern observed: App swaps the "Book" CTA for a "Waitlist" CTA when the class fills; waitlist users get an SMS when a spot opens in the last 10 hours, and auto-enrollment beyond that window. Waitlist mechanics are explicit in-product and in the FAQ rather than hidden behind a "Full" label.
- URL: https://solidcore.co/faqs
- last_verified: 2026-04-15
- What to notice: The capacity signal bridges into a fulfillment mechanic (SMS + auto-enroll) — the signal does not end at "Waitlist," it continues through the notification. This is the pattern a booking UI needs to support end-to-end, not just paint at the schedule row.

## Reference implementation (shadcn + Tailwind)

```tsx
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type CapacityProps = {
  booked: number
  total: number
  waitlistCount?: number
  onBook: () => void
  onJoinWaitlist: () => void
}

// Thresholds: warning ≥70%, danger ≥95%, never red below 90%.
// Qualitative copy kicks in at ≥70%.
function capacityState(booked: number, total: number) {
  const ratio = booked / total
  const remaining = total - booked
  if (ratio >= 1) return { tone: "full" as const, label: "Waitlist", remaining: 0 }
  if (ratio >= 0.95 || remaining === 1) {
    return { tone: "danger" as const, label: remaining === 1 ? "1 spot left" : "Almost full", remaining }
  }
  if (ratio >= 0.7) {
    return { tone: "warning" as const, label: "Filling up", remaining }
  }
  return { tone: "calm" as const, label: `${remaining} spots`, remaining }
}

export function CapacityRow(props: CapacityProps) {
  const state = capacityState(props.booked, props.total)

  const badgeClass = {
    calm: "bg-muted text-muted-foreground",
    warning: "bg-amber-100 text-amber-900 border-amber-200",
    danger: "bg-red-100 text-red-900 border-red-300",
    full: "bg-purple-100 text-purple-900 border-purple-300",
  }[state.tone]

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <Badge variant="outline" className={badgeClass}>
          {state.label}
        </Badge>
        {state.tone === "full" ? (
          <Button variant="secondary" onClick={props.onJoinWaitlist}>
            Join waitlist
            {props.waitlistCount ? ` (${props.waitlistCount})` : ""}
          </Button>
        ) : (
          <Button
            variant={state.tone === "danger" ? "default" : "outline"}
            onClick={props.onBook}
            className={state.tone === "danger" ? "font-semibold" : ""}
          >
            Book
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

## Measurable checks

### capacity_color_threshold
**Condition:** Warning color (amber/yellow family) applies at ≥70% capacity. Danger color (red family) applies only at ≥95% capacity or when exactly 1 spot remains. No red token anywhere below 90%.
**Reasoning:** Red below 90% triggers the panic-abandon response; amber at 70-94% triggers urgency without shutting down booking intent. The threshold difference between amber and red is where conversion happens.

### capacity_language
**Condition:** Qualitative copy ("Almost full", "Filling up", "1 spot left", "Waitlist") appears at ≥70% capacity. Numeric copy ("8 spots") acceptable only below 70%. "1 spot left" is preferred over "1/14 spots" even when the rest of the schedule uses numerics.
**Reasoning:** Numeric copy is emotionally flat and wastes the urgency signal at high capacity. Qualitative copy drives action at the moment it matters; numerics are fine when capacity is comfortable and the user is browsing.

### sold_out_state
**Condition:** 100%-full classes render a waitlist CTA (button, not a label). If the platform exposes waitlist count or user position, it is shown. Never a static "FULL" badge with no action path.
**Reasoning:** Static FULL is a dead end that converts interest into abandonment. Waitlist CTA is a conversion path and the count is social proof. This check fails fast — if you see a disabled FULL button, it's a finding.

### urgency_consistency
**Condition:** A "1 spot left" or "Almost full" row has visually differentiated CTA treatment (bolder button variant, stronger color, heavier font weight) relative to a "8 spots" row on the same page. Uniform CTAs across capacity levels count as a miss.
**Reasoning:** The capacity signal is only useful if the CTA reinforces it. A uniform "Book" button at all capacity levels means the signal never crosses from the badge into the action, and most users scan the CTA not the badge.

### waitlist_social_proof
**Condition:** When a class has an active waitlist, the count or user's position is surfaced somewhere in the booking flow — at minimum on the class detail view, ideally on the schedule row itself. Waitlist-with-no-count is acceptable for small studios but weakens the signal.
**Reasoning:** Waitlist demand is the strongest social-proof signal available on a schedule page. Hiding the count behind a generic "Waitlist" label discards it. Equinox + Orangetheory both surface position directly; that's the target pattern.

### no_ecommerce_scarcity_tactics
**Condition:** No countdown timers on class rows. No "N people viewing this class." No pulsing animations on capacity badges. No "only 1 left!!" double-punctuation copy.
**Reasoning:** E-commerce scarcity tactics damage trust in a repeat-booking context. Fitness users see the same schedule weekly; gimmicks read as sleazy after the second visit. Use restrained, brand-appropriate urgency (color + copy + CTA weight) only.

## Cross-pattern notes

- Interacts with `waitlist-cancellation.md` for the sold-out → waitlist transition and the mechanics that make the waitlist CTA a real conversion path (12-hour cancel windows, SMS promotion, auto-enroll). Capacity signal without real waitlist mechanics is theater.
- Interacts with `schedule-grid.md` for how the capacity badge is rendered per cell — density matters. A weekly grid has less room for qualitative copy than a daily list, and the signal must degrade gracefully.
- Interacts with `booking-flow.md` — the capacity signal on the schedule must match the state of the booking step. A "1 spot left" row that loads a calm "Book your class" screen is a broken promise.
- Precedence rule 2 from SKILL.md: `instructor-affinity` beats `capacity-signal` on featured rows. A beloved founder teaching a 1-spot-left class should lead with the instructor badge; the capacity signal is still present but not the primary visual weight.
- Precedence rule 4 from SKILL.md: `waitlist-cancellation` beats `capacity-signal` for sold-out state — the sold-out treatment is owned by waitlist-cancellation.md's waitlist-CTA pattern, not by a capacity-signal "FULL" label.
