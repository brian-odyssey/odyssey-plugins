# Intro-offer funnel

## What it is

The pathway that moves a first-time visitor from "I might try this studio" to "I have a booked intro class on my calendar," and then from "I finished my intro pack" to "I'm a paying member." The funnel is anchored on a signature promise — "first class free," "$49 for 2 weeks unlimited," "$89 for your first month" — that is presented prominently enough to override the sticker-shock of full membership pricing. The intro offer lives on the homepage hero, on a dedicated `/join` (or `/free-class`, `/new-clients`) landing page, and — critically — as reinforcement on the schedule rows for the classes the offer is meant to be redeemed against (the intro / 101 / fundamentals / beginner class).

Intro offers are the single highest-leverage conversion lever in boutique fitness. A studio that hides its intro offer under a "Pricing" link loses first-visit conversions; a studio that decouples its intro banner from the intro class rows on the schedule produces confused visitors who claim an offer they can't figure out how to redeem. The funnel's job is to collapse that confusion into a single decision.

## Why it matters in fitness

First-class economics in boutique fitness are near-zero marginal cost — the reformer, the instructor, the heat, the towels are all paid whether the class runs with 10 bodies or 11. Giving away the 11th spot to an intro-offer taker at a near-zero incremental cost is rational because the lifetime value of a converted member ($150–$350/mo × 12+ months) dwarfs the forgone drop-in revenue. Every serious studio operates some version of this calculus, which is why "first class free" or "first week cheap" is near-universal.

The funnel has two conversion events, not one: (1) website-visit → intro-offer claim, and (2) intro-offer consumption → paid membership. Most studios optimize only the first and leave the second to chance — the intro user finishes their two-week pack, the site goes silent, and the user drifts to ClassPass or a competitor. The highest-performing studios treat the handoff from intro to paid as a designed moment, not an afterthought. The UX pattern must cover both halves.

Three fitness-specific forces shape the intro offer: (1) the intro offer is not the same product as membership — it's an on-ramp, and mixing the two in the same pricing table confuses both shoppers; (2) the intro class is usually a specific named class format (beginner, fundamentals, 101) where technique and safety can be introduced — booking any class as an intro is operationally wrong; (3) trust fragility is extreme at first visit — a "free" offer that demands a credit card up front, or a "$49 intro" that silently rolls to $175/mo, is a brand-damage event that kills not just the one conversion but the word-of-mouth tail.

## Anti-patterns

### offer-decoupled-from-booking
Intro-offer banner appears on the homepage ("Your first class is on us!") but when the user reaches the schedule page, the intro / 101 / fundamentals class rows carry no reinforcement — no badge, no pill, no copy indicating that THESE are the classes the offer is redeemed against. User either books a regular class by mistake (and gets charged full price or blocked at checkout), or bounces because they can't figure out the mechanic. Fails because the offer claim and the class booking are the same action in most studio models — separating them in the UI is a direct translation of the studio's internal silos onto the customer. A real reviewer spots this fast by scanning the homepage banner copy and then checking whether the class grid echoes it.

### pricing-above-fold
Full membership tiers ($175/mo unlimited, $129/mo 8-pack, $89/mo 4-pack) rendered prominently at the top of the homepage or `/memberships` page before the intro offer is visible. First-visit shoppers bounce on the $175 sticker before they ever see "your first class is free." Fails because first-visit psychology is dominated by price anchoring — whichever number the user sees first becomes the frame. If the first number is $175, intro-offer engagement drops; if the first number is $0 or $49, the user crosses the trial threshold and the $175 becomes legible later as the steady-state price for a habit they've already started. Precedence rule 3 from SKILL.md makes this explicit: intro-offer-funnel beats pricing-tier-presentation on first visit.

### fine-print-surprise
Intro headline reads "First month $89" but the credit-card-capture screen or the confirmation email reveals the offer auto-converts to $175/mo at day 31 — a disclosure that was absent from the claim CTA. Fails because surprise auto-renewal is the single most common trigger of chargeback, negative review, and complaint-to-attorney-general in the subscription-fitness category. FTC rules on negative-option marketing require the renewal terms to be "clear and conspicuous" before the consumer is charged; shipping an intro funnel where the renewal is disclosed only post-claim is a regulatory risk as well as a trust-destroying UX.

### no-conversion-handoff
User completes the intro pack (two-week unlimited expired, or 4-class pack consumed). Site goes silent — no in-app prompt, no email, no banner at next login, no surfaced upgrade CTA. User drifts. Fails because the intro-to-paid handoff is the whole point of the funnel; letting it happen ambiently instead of actively designs away the exact moment the user is most primed to convert (they just built a two-week habit). The silent-handoff pattern is what separates a 20% intro-to-paid conversion rate from a 50%+ one.

### generic-intro-pack-naming
Intro class labeled generically — "Class 1," "Level 1," "Intro Class" — stripped of the brand's voice. Fails because the name is a positioning asset: "inTro to inTension 101" or "Foundations" or "Starter50" (Solidcore) or "Foundations Intro Class" (Pure Barre) reinforces that the class is both a real workout and a guided on-ramp. A generic label reads as a training-wheels experience the user will want to skip and costs the studio the chance to brand the introduction.

### credit-card-wall-for-free-first-class
Offer says "first class free" but the booking flow demands a credit-card-on-file before the intro class can be confirmed. Fails because "free" that requires a card is not free in the user's mental model — it's a trial with a trust demand attached, and it reads as bait-and-switch even when the studio's stated reason is legitimate (no-show fee enforcement). If the studio must protect against no-shows, the correct pattern is a late-cancel/no-show fee disclosed inline with the booking, with the card captured at the studio at check-in time, not as a wall in front of a "free" offer. Orangetheory's own free-trial requires card capture at reservation and the category understands this as a friction point; boutique studios have more flexibility here and should use it.

## Real-world references

### Barry's
- Pattern observed: Dedicated first-timer landing at `/exclusive-first-timer-offer` and a separate `/first-timers` "what to know before your first class" guide. The landing page is the claim surface; the guide is the confidence-builder for users on the fence. Barry's X digital membership separately offers a 30-day free trial that then bills at $39.99/mo, with the renewal terms disclosed in App Store subscription copy and in the FAQ/Terms.
- URLs:
  - https://www.barrys.com/exclusive-first-timer-offer
  - https://www.barrys.com/first-timers
  - https://www.barrys.com/faq
- last_verified: 2026-04-15
- What to notice: two-surface structure — the offer page is where the claim happens, the first-timers guide is where ambivalence is converted. Auto-renewal of the digital trial is disclosed in both the App Store listing and the terms, not only in the post-claim email. The trial period itself is an offer surface; Barry's uses a named duration (30 days) rather than "trial" without a number.

### Solidcore
- Pattern observed: Distinct URLs for distinct intro products — `/starter50` (intro class), `offers.solidcore.co/nc4p` (new client 4-pack), and a 2-week unlimited new-client promo at `offers.solidcore.co`. The `Starter50` class is a branded 50-minute intro format with machine demo and technique interspersed — it is explicitly labeled as the entry point on the schedule, not a generic "Level 1."
- URLs:
  - https://solidcore.co/starter50
  - https://offers.solidcore.co/nc4p
  - https://offers.solidcore.co/
  - https://solidcore.co/new-clients-overview
- last_verified: 2026-04-15
- What to notice: the intro class has a brand name (Starter50) that echoes the core product format (50-minute class) — this is the correct fix for `generic-intro-pack-naming`. Multiple intro offers coexist (single class, 4-pack, 2-week unlimited) at different price points so the funnel captures different commitment levels. The new-client overview page sits alongside the offer pages, which is the `first-timers` confidence-builder pattern.

### SoulCycle
- Pattern observed: `/new-to-soul/` is the first-time-rider landing, with "The Starter Pack — three classes at a special price, just for you" surfaced after the first ride rather than as the initial offer. A separate partner-offer pattern (SoulCycle × Sweetgreen first-time-rider offer) shows how the intro can be co-branded for acquisition.
- URLs:
  - https://www.soul-cycle.com/new-to-soul/
  - https://www.soul-cycle.com/series/
  - https://www.soul-cycle.com/soulconnected/soulcycle-x-sweetgreen-first-time-rider-offer/
- last_verified: 2026-04-15
- What to notice: two-step funnel — the first ride is the entry, the Starter Pack (3 classes) is the planned upgrade after the first ride. This is the `post_intro_upgrade_path_visible` check realized as a named product. The intro is not sold as a raw discount; it's framed as "just for you" post-ride, which is the correct emotional register for the handoff moment.

### Orangetheory
- Pattern observed: `/free-gym-trial` is the explicit first-class-free surface. Eligibility is verified (never taken a class, residence or workplace within 5 miles of the studio). Card capture is required at reservation time even though the class is free — stated rationale is no-show protection. Arrive-30-min-early onboarding is part of the intro script. Individual franchise owners set their own intro promotions within brand guidelines, so per-studio variance exists.
- URLs:
  - https://www.orangetheory.com/en-us/free-gym-trial
  - https://www.orangetheory.com/en-us/faq
  - https://www.orangetheory.com/en-us/promotion-terms
- last_verified: 2026-04-15
- What to notice: this is an explicit violation of `credit-card-wall-for-free-first-class`, published by a franchise that relies on it. Copy to learn from, not to copy: a studio without franchise no-show economics should avoid the card wall; a franchise with systemic no-show losses may accept the trust cost. Also: per-studio variance means the intro terms have to render from per-studio data, not a brand-global template.

### Pure Barre
- Pattern observed: `/free-class` is the first-class-free landing, `lp.purebarre.com/free-barre-class` is the paid-media variant, and `/new-to-barre` is the first-timers confidence-builder. The intro is explicitly named "Free Foundations Intro Class" — a brand-voiced intro class label, not "Level 1." Studio-level pages (`members.purebarre.com/offers/...`) expose a $150 first-10-class intro pack as the next-step offer after the free foundations class.
- URLs:
  - https://www.purebarre.com/free-class
  - https://lp.purebarre.com/free-barre-class
  - https://www.purebarre.com/new-to-barre
  - https://help.purebarre.com/hc/en-us/articles/18412063928215-How-Do-I-Redeem-My-First-Free-Class
- last_verified: 2026-04-15
- What to notice: named intro class ("Foundations") — correct `intro_pack_naming`. Multi-step funnel: free first class → $150 first-10-pack → membership. The help-center article dedicated to "How Do I Redeem My First Free Class" is itself an anti-friction artifact — if a redemption question is common enough to warrant a help article, the on-site UX is doing too much explaining and not enough showing.

### CorePower Yoga
- Pattern observed: `/content/new-student-offers` surfaces a "Free Week of Yoga Classes for New Students" — unlimited classes for 7 days. Secondary surfaces (`/content/buy`, `/content/all-access-membership`, `/content/membership-offers`) are the full-pricing surfaces and are separate pages, so the new-student landing is not diluted by tier tables.
- URLs:
  - https://www.corepoweryoga.com/content/new-student-offers
  - https://www.corepoweryoga.com/content/buy
  - https://www.corepoweryoga.com/content/all-access-membership
- last_verified: 2026-04-15
- What to notice: separation between new-student offers and full pricing tiers is physical — two different pages. This is the correct fix for `pricing-above-fold`. The offer is a full week of unlimited, which is a stronger commitment test than a single free class (a week of unlimited lets the user build the habit loop the membership depends on).

### F45 Training
- Pattern observed: `/f45trials/` is the intro-trial surface — a trial week for new members that "commences on the first visit, runs consecutively, and can not be split." `/welcomeweek30/` is a 30-day welcome week variant. "F45 Trials" is also a separate performance-challenge product (confusingly sharing the name), showing how important it is that intro terms be spelled out on the page rather than assumed from the word "trial."
- URLs:
  - https://f45training.com/f45trials/
  - https://f45training.com/welcomeweek30/
  - https://f45training.com/faqs/
- last_verified: 2026-04-15
- What to notice: explicit consecutive-days policy ("commences on the first visit, runs consecutively, cannot be split") is the kind of rule fine print that matters operationally and that a good intro page surfaces above the fold, not only in the terms. The name collision with the "F45 Trials" performance event is a cautionary tale: naming hygiene matters.

### Lagree (Platform Lagree / SLT)
- Pattern observed: Platform Lagree exposes two simultaneous new-client specials — "2 classes for $39" and "month of unlimited for $149" — at different commitment levels. SLT offers an "intro 2-pack" framed as two classes for the price of one. Grip-socks requirement and 5–10 minute early arrival are surfaced as part of the intro onboarding, not only discovered in-studio.
- URLs:
  - https://platformlagree.com/start
  - https://lagreemt.com/pricing
- last_verified: 2026-04-15
- What to notice: price-differentiated intro ladder (low-stakes 2-class offer, higher-stakes month unlimited) captures both cautious and committed prospects instead of forcing a single commitment level. The inclusion of operational prep (grip socks, arrival time) on the intro surface is a trust-building move that matches SoulCycle's `/new-to-soul/` pattern.

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — adapted from shadcn primitives, typecheck-clean in isolation.
// Adapt to target brand. Not CI-validated against any specific project.
// Shows: (1) intro-offer hero on homepage, (2) intro-offer badge on schedule row for intro class,
// (3) claim dialog with full renewal terms disclosed BEFORE the claim CTA.

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
import { Sparkles } from "lucide-react"

type IntroOffer = {
  id: string
  headline: string          // "Your first class is on us."
  subhead: string           // "Book an intro class — no card required."
  ctaLabel: string          // "Claim my free class"
  priceNote?: string        // "$0 today · no auto-renew"
  converts: {
    toPlanLabel: string     // "Unlimited membership"
    atPriceUsd: number      // 175
    onDate: string          // "Apr 29, 2026"
  } | null                  // null = one-shot, no conversion
  cardRequired: boolean
}

type ClassRow = {
  id: string
  startsAtLabel: string
  classType: string         // e.g., "Foundations 101"
  instructor: string
  isIntroClass: boolean     // true => show intro-offer badge
}

export function IntroOfferHero({ offer }: { offer: IntroOffer }) {
  return (
    <Card className="border-primary/40 bg-gradient-to-br from-primary/10 to-transparent">
      <CardHeader>
        <Badge variant="outline" className="w-fit gap-1 border-primary/60 text-primary">
          <Sparkles className="h-3 w-3" /> New here
        </Badge>
        <CardTitle className="text-3xl font-semibold tracking-tight">
          {offer.headline}
        </CardTitle>
        <CardDescription className="text-base">{offer.subhead}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-wrap items-center gap-3">
        <ClaimOfferDialog offer={offer} />
        {offer.priceNote ? (
          <span className="text-sm text-muted-foreground">{offer.priceNote}</span>
        ) : null}
      </CardFooter>
    </Card>
  )
}

export function ScheduleRowWithIntroBadge({
  row,
  offerHeadline,
}: {
  row: ClassRow
  offerHeadline: string
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="text-sm text-muted-foreground">{row.startsAtLabel}</div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold">{row.classType}</span>
            {row.isIntroClass ? (
              <Badge className="bg-primary/15 text-primary border-primary/30">
                {offerHeadline}
              </Badge>
            ) : null}
          </div>
          <div className="text-sm text-muted-foreground">{row.instructor}</div>
        </div>
        <Button size="lg" className="shrink-0">
          {row.isIntroClass ? "Claim & book" : "Book"}
        </Button>
      </CardContent>
    </Card>
  )
}

function ClaimOfferDialog({ offer }: { offer: IntroOffer }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-semibold">
          {offer.ctaLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{offer.headline}</DialogTitle>
          <DialogDescription>{offer.subhead}</DialogDescription>
        </DialogHeader>

        {/* Disclosure block — ALWAYS visible before the claim CTA, never only in email */}
        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-medium">What happens next</p>
          <ul className="mt-1 list-disc pl-5 text-muted-foreground">
            <li>
              {offer.cardRequired
                ? "We'll collect a card on file to hold your spot."
                : "No credit card required."}
            </li>
            {offer.converts ? (
              <li>
                Converts to <strong>{offer.converts.toPlanLabel}</strong> at $
                {offer.converts.atPriceUsd}/mo on{" "}
                <strong>{offer.converts.onDate}</strong> unless you cancel first.
              </li>
            ) : (
              <li>Single-class offer — no recurring charge.</li>
            )}
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Back
          </Button>
          <Button onClick={() => setOpen(false)}>Confirm & pick a class</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

Three things to notice in the snippet: (1) the same offer headline string is fed both to the homepage hero AND to the schedule-row badge — they cannot drift apart; (2) the claim dialog discloses auto-renewal price AND date BEFORE the confirm button, not in a post-claim email; (3) the schedule row's CTA swaps to "Claim & book" when `isIntroClass` is true, so the offer claim and the class booking are one action, not two.

## Measurable checks

Prose heuristics a reviewer applies to the rendered pages. Pass/fail judgments.

### intro_offer_above_fold
**Condition:** On the homepage (and on any dedicated `/join`, `/free-class`, `/new-clients` landing) the intro-offer CTA is visible in the first viewport (≤720px scroll on desktop, ≤800px on mobile). No need to scroll to find it.
**Reasoning:** First-visit attention is short. An offer buried below the fold is an offer the first-time visitor never sees. CorePower, Barry's, Pure Barre all ship a first-timer surface where the offer is the visual anchor.

### intro_offer_on_intro_class_cards
**Condition:** Schedule rows for intro / 101 / fundamentals / beginner classes display an intro-offer badge, pill, or copy tag ("First class free," "$0 with intro pack," "Claim your free class") — not just the class name. The badge connects the class to the offer the user saw on the homepage.
**Reasoning:** Decoupling the banner from the booking row is the `offer-decoupled-from-booking` anti-pattern and is the #1 reason intro-offer claim rates lag below 50% on studios that otherwise have the offer. Solidcore's Starter50 and Pure Barre's Foundations are both named and surfaced — a generic row is a missed conversion.

### auto_renew_disclosed_preclicking_claim
**Condition:** If the intro offer converts to a recurring charge (auto-renew into monthly membership), the renewal price AND the renewal date are visible BEFORE the claim-offer CTA is clicked — on the landing page or in the claim dialog, not only in the confirmation email.
**Reasoning:** Pre-claim disclosure is the fairness contract; post-claim disclosure is the chargeback trigger. FTC negative-option rules require clear-and-conspicuous disclosure of renewal terms. Barry's X discloses 30 days → $39.99/mo on the App Store listing and in terms; a studio that hides the renewal number until the confirmation email fails this check.

### no_credit_card_wall_for_free_first_class
**Condition:** If the intro is "first class free" (vs. a paid intro pack), booking the intro class does not require credit-card-on-file as a hard gate. Card capture at in-studio check-in is acceptable; card capture in the web booking flow is a wall.
**Reasoning:** "Free" that requires a card reads as bait. Orangetheory's franchise model requires the card at reservation and the category accepts this for that model; boutique studios have the operational flexibility to decouple and should use it. If no-show losses are a real concern, disclose a late-cancel fee inline and collect card at check-in.

### post_intro_upgrade_path_visible
**Condition:** After intro-pack completion (or within 48 hours of expiry date), the UI surfaces a clear upgrade offer — in-app banner, email, account page CTA — that names the next-step plan, its price, and the benefit of upgrading now. Silent expiry fails.
**Reasoning:** The intro-to-paid handoff is the whole point of the funnel. SoulCycle's "Starter Pack — three classes at a special price, just for you" post-first-ride is the archetype. The high-performing funnel designs this moment explicitly; the low-performing one lets it happen ambiently and leaves 20–30 points of conversion on the table.

### intro_pricing_differentiated_from_membership_pricing
**Condition:** The intro offer uses visually distinct treatment from full membership tiers — different color, different section, different page, or a pinned badge — so a first-visit shopper does not have to parse a three-column pricing table to find the "first class free" option. Conflating intro into a tier column ($0 / $89 / $129 / $175) fails.
**Reasoning:** Price anchoring dominates first-visit psychology. Pricing-above-fold drives $175 into the shopper's frame before $0 has a chance. CorePower physically separates `/content/new-student-offers` from `/content/buy`; Solidcore uses `offers.solidcore.co` subdomain for intro offers distinct from the main site's pricing. Physical or visual separation is the correct fix.

### intro_class_is_named
**Condition:** The intro / fundamentals / 101 class appears on the schedule with a brand-voiced name ("Foundations," "Starter50," "inTro to inTension 101") — not a generic "Level 1," "Class 1," or "Intro Class." The name is consistent across the schedule, the homepage banner, and the claim dialog.
**Reasoning:** Naming is positioning. Solidcore's Starter50 makes the intro a proper noun that echoes the product (50-minute class format); Pure Barre's Foundations telegraphs that the class is a real starting point, not a diminished version. Generic labels cost the studio the chance to brand the introduction and read as training-wheels the user wants to skip.

### intro_offer_headline_consistent_across_surfaces
**Condition:** The headline of the intro offer ("Your first class is on us," "$49 for 2 weeks," "Starter50 · 40 min intro") is byte-identical across the homepage hero, the `/join` landing, the schedule-row badge, and the claim dialog. No paraphrasing across surfaces.
**Reasoning:** Drift between surfaces is the most common failure mode of the coupled-funnel fix: the marketer updates the homepage banner but the dev forgets to update the schedule badge. The surfaces go out of sync, the user sees two slightly different offers, and trust erodes. The headline should be a single string fed to every surface, not re-typed per surface.

## Cross-pattern notes

- **`pricing-tier-presentation.md`** governs the full membership tier table. Precedence rule 3 from SKILL.md: intro-offer-funnel beats pricing-tier-presentation on first visit. On the homepage and `/join`, the intro offer wins top-of-page; full tiers move below the fold or onto `/memberships`. Do not render the intro as a $0 column in a tier table — that's the `pricing-above-fold` violation.
- **`booking-flow.md`** owns the flow from class tap → confirmed reservation. The intro-offer funnel hooks into it at the schedule-row level: when `isIntroClass` is true, the booking flow's CTA must reflect the offer ("Claim & book" not "Book") and the confirm dialog must carry the offer terms. Booking-flow does not own the offer messaging; intro-offer-funnel does.
- **`recurring-membership.md`** governs the auto-renew, pause, and cancel semantics of the post-intro paid state. `auto_renew_disclosed_preclicking_claim` is the handshake: the disclosure happens inside the intro funnel; the actual renewal mechanics live in recurring-membership.
- **`schedule-grid.md`** owns how the schedule is structured. This pattern adds the intro-class-badge requirement on top — the grid must support a badge affordance on rows flagged as intro classes. If the grid has no badge slot, intro-offer-funnel cannot be satisfied; the schedule-grid component needs to be extended.
- **`multi-location-selection.md`** matters when intro offers vary by location (Orangetheory's per-studio variance is the archetype). The intro-offer copy and terms must render from per-studio data, not a brand-global template, when variance exists. A studio with uniform pricing can safely hardcode.
- **`mobile-first-defaults.md`** applies globally — precedence rule 1. The reference implementation above is mobile-sized (`w-full` buttons, Dialog not sidebar). The claim dialog must be legible at 375px width with the disclosure block intact — no disclosure hidden behind a "learn more" accordion on mobile.
- **`kiosk-checkin.md`** is out of scope. Intro-offer claim is a web/landing-page surface, never an in-studio kiosk surface. If a first-time visitor is standing at the front desk, they are past the funnel and into onboarding — a different pattern.
