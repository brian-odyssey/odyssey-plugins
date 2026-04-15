# Pricing tier presentation

## What it is

The layout, structure, and copy of the page where a fitness buyer sees what a membership costs. In boutique fitness, this is usually a single-tier (or dual-tier) autopay-anchored page with optional class-pack add-ons — one recurring commitment, one number, one button. In franchise fitness, it is usually a three-tier grid — typically named something like "Basic / Elite / Premier" or "4 / 8 / Unlimited" — with the middle tier marked as recommended and a monthly/annual toggle adjacent. The shape of the page is not cosmetic; it is a direct rendering of the studio's business model onto the shopper's screen. Get the shape wrong and every downstream conversion metric degrades.

This pattern governs: how many tiers appear; what they are named; whether per-class math is shown; where the intro offer sits relative to the tiers; how annual savings are surfaced; how commitment length and late-cancel policy appear alongside price; and how per-location price variance is disclosed when the studio is a franchise. It does NOT govern the intro-offer funnel itself (see `intro-offer-funnel.md`) — precedence rule 3 from `SKILL.md` says the intro offer wins the top of the page on first visit, and the full tier table either lives below the fold or on a dedicated `/memberships` page.

## Why it matters in fitness

Boutique and franchise studios are structurally different businesses, even when they look similar from the street. A boutique (one studio, one owner, one room, one class format) sells a relationship — the membership is the product, and the question is "do you want to be the kind of person who trains here." A franchise chain sells a frequency ladder — each tier is calibrated against an assumed visit count (1×/wk, 2×/wk, unlimited) and the tiers exist to price-anchor the middle option. Presenting a boutique like a franchise (three artificial tiers where two are duplicates with different names) reads as manipulative and erodes the relationship premise. Presenting a franchise like a boutique (one tier, take it or leave it) collapses the price-anchoring mechanism and sends low-frequency prospects to ClassPass instead of to the Basic tier they would have happily bought.

Per-class math is the other big fitness-specific concern. A $175/month tier for unlimited classes is $10.29 per class at 17 attendances, $14.58 at 12, $21.88 at 8. Fitness buyers are usually sophisticated enough to do this math themselves if the page helps — and the page that shows the math wins against the page that doesn't, because the shopper who does the math feels like they made the decision rather than being sold. Showing per-class cost turns a $175 price tag into a $10 decision, which is the frame the studio wants.

Commitment length is the third trust pressure. A 3-month minimum commitment is common, legitimate, and fine — disclosed inline on the tier card. Discovered only at checkout, it is bait-and-switch and produces chargebacks. The FTC's updated click-to-cancel rule (2026) and California's AB-390 auto-renewal rules both require clear-and-conspicuous commitment disclosure before the payment authorization; a pricing page that hides "3-month minimum" in a footer footnote is not only a UX failure but a regulatory exposure.

## Anti-patterns

### three-tier-for-single-tier-boutique
Boutique studio with a single meaningful membership model (unlimited autopay) presented as a 3-column grid — "Basic / Premier / Elite" or "Starter / Pro / Elite" — where two of the three columns are either duplicates of each other with different colors, or artificial downgrades nobody buys. User reads the page, tries to find the difference, fails, and concludes the studio is either confused or manipulative. The correct shape for a one-product business is one product presented cleanly with add-ons below, not three fake tiers manufactured to look like a franchise. Solidcore and Barry's both ship single-anchor pricing surfaces with add-on class packs rather than inventing tiers.

### pricing-without-per-class-math
Tier card shows "$175/mo" with no breakdown of what that costs per class at assumed attendance. Fitness buyers mentally divide price by expected visits; a page that makes them do that math in their head is a page that forgets its audience. The correct fix is an explicit line on each tier — "= $10.29/class at 17 classes/mo" — which reframes the decision from "is $175 a lot" to "is $10 per class a lot," which is the frame the studio wants.

### commitment-length-buried
"3-month minimum commitment" or "12-month contract" visible only in a footer disclaimer, a terms link, or the last step of checkout. Violates the fairness contract and most state auto-renewal statutes. Correct fix: the commitment language is a line inside the tier card, adjacent to the price, at the same visual weight as the price. If the commitment is too ugly to render at that weight, the commitment is the problem, not the design.

### no-annual-monthly-toggle
Franchise pricing shown monthly only, with the annual option ("save 2 months / 17% off") either absent or hidden behind a secondary page. Misses the highest-leverage upsell on the pricing page: the prospect already primed to say yes is also primed to optimize. Peloton, CorePower, and Equinox all offer annual variants; the pattern is a Tabs or segmented control above the tier grid with savings math baked into the annual column.

### pricing-above-fold-on-first-visit
New visitor landing on the pricing page sees $175/mo anchored at the top of the page before they see the intro offer. Precedence rule 3 in `SKILL.md` is explicit: intro-offer-funnel wins on first visit. A dedicated `/memberships` page is fine — it's what exists below the fold on the homepage, or a distinct route for returning/committed prospects — but the homepage and any `/join`/`/free-class` route must surface the intro first. See `intro-offer-funnel.md` for the intro UX; this reference governs everything that happens after the intro hurdle is crossed.

### per-location-price-surprise
Franchise pricing page shows a national average or a "starting at $X" number; the actual price at the nearest studio is higher, and the shopper only discovers the real number at checkout. Orangetheory and F45 both have real per-studio variance ($59–$179 for Basic at Orangetheory; $150–$300 for unlimited at F45) and hiding that variance until checkout is a trust event. Correct fix: require location selection at the top of the pricing page and render the tier table from per-studio data, or show the range openly ("$59–$179/mo depending on studio") with a location selector that narrows it.

### intro-baked-into-tier-column
A tier grid has four columns: "Intro Offer $0 / Basic $89 / Premier $129 / Elite $175." Treats the intro as a tier. Destroys the intro-offer-funnel pattern (the intro is supposed to feel like an on-ramp, not a permanent-but-worse plan) and destroys the tier-grid pattern (the intro column is the cheapest-looking option so the eye anchors there and the paid tiers become losers by comparison). Correct fix: intro offer lives outside the tier grid, in its own section, with its own visual treatment — see CorePower's physical separation of `/content/new-student-offers` from `/content/buy`.

## Real-world references

### Orangetheory Fitness (franchise, three-tier class-count)
- Pattern observed: Three named tiers — Basic (4 classes/mo, "avg. usage of 1x/week"), Elite (8 classes/mo, "avg. usage of 2x/week"), Premier (unlimited, "recommended for usage of 3x/week or more"). Each tier carries an explicit usage-frequency recommendation as the selection heuristic. Class packs (10/20/30) sit outside the membership grid as a separate non-recurring option. Premier carries a "30-Day Risk Free Guarantee" notation. Per-studio price variance is substantial — Basic ranges roughly $59–$179 depending on market.
- URLs:
  - https://www.orangetheory.com/en-us/memberships
  - https://www.otfinsider.com/guides/getting-started/pricing
- last_verified: 2026-04-15
- What to notice: the frequency-recommendation text ("avg. usage of 2x/week") is the per-class-math heuristic rendered as prose. Instead of computing "$10.29/class" explicitly, Orangetheory tells the buyer which tier matches their intended cadence. This is a softer form of the same reframe and works well for buyers who don't want to do arithmetic. Also: the tier count (three) is correct for the frequency-ladder business; Orangetheory would not work as a single-tier page.

### Pure Barre (franchise, three-tier + annual)
- Pattern observed: Public pricing varies sharply by studio, but the national pattern is a three-tier grid — 4 classes/mo, 8 classes/mo, and Monthly Unlimited — with the unlimited tier anchored near $199/mo. The new-client intro is explicitly priced ($100 first month vs $199 ongoing) and surfaced as its own offer rather than a column in the tier table. Class packs (5/10/15/20) exist as a non-recurring secondary surface.
- URLs:
  - https://www.purebarre.com/
  - https://thegymprices.com/pure-barre-pricing/
- last_verified: 2026-04-15
- What to notice: intro is price-differentiated from the unlimited tier ($100 vs $199) and lives outside the tier column — correct fix for `intro-baked-into-tier-column`. Per-studio variance is disclosed through studio-specific pricing pages rather than a national average, which is the franchise-correct answer to `per-location-price-surprise`.

### Barry's (boutique, credit-pack anchor)
- Pattern observed: Two parallel products at different commitment levels — pay-per-class credits (bundles purchased up-front, per-class cost decreases with bundle size) and Barry's X digital membership (30-day free trial, then $39.99/mo). Physical-studio pricing is explicitly per-city (`/pricing/charlotte/` etc.), not a national grid. The FAQ documents late-cancel and package terms separately from the buy surface.
- URLs:
  - https://www.barrys.com/buy-classes
  - https://www.barrys.com/pricing
  - https://memberships.barrysx.com/
  - https://www.barrys.com/faq
- last_verified: 2026-04-15
- What to notice: Barry's does not ship a three-tier grid. The anchor product is the credit bundle (you decide how often you'll come by how big a bundle you buy); the recurring product is the digital-only Barry's X. This is a boutique shape — one recurring commitment with credit-pack add-ons — and it would be wrong to overlay "Basic/Elite/Premier" on top of it.

### Solidcore (boutique, unlimited anchor with autopay)
- Pattern observed: Single unlimited-autopay membership is the primary recurring commitment, supplemented by class packs (non-recurring) for lower-frequency members. Unlimited perks are productized as benefits inside the membership — early class-plan access (24h ahead, on the 24th of each month), one free late cancel per rolling 30 days, one bring-a-friend per 30 days, two cross-studio bookings per 30 days. Unlimited monthly price ranges roughly $138–$311 by location; major cities run 10–15% higher.
- URLs:
  - https://solidcore.co/membership-perks
  - https://solidcore.co/faqs
  - https://solidcore.co/
- last_verified: 2026-04-15
- What to notice: the single-anchor membership is dressed with perks (early booking, late-cancel forgiveness) rather than split into fake tiers. Correct shape for a boutique. Price variance is disclosed with per-studio pricing pages.

### SoulCycle (boutique, class-pack hybrid with tiered memberships)
- Pattern observed: Class packs (5/10/20) are the first-purchase anchor, priced to reward commitment (the 20-pack breaks to $25–$30/class vs $30–$40 drop-in). Memberships exist in multiple tiers (4/8/12/16 classes per month plus a Soul Renew unlimited tier) — which makes SoulCycle an unusual hybrid: boutique brand, franchise-shaped tier grid. "The Starter Pack — three classes at a special price, just for you" is surfaced AFTER the first ride rather than as the initial offer.
- URLs:
  - https://www.soul-cycle.com/series/
  - https://membershipdetail.com/soulcycle-membership-cost/
- last_verified: 2026-04-15
- What to notice: the class-count-ladder tier structure inside a boutique brand is rare and instructive. SoulCycle got large enough to justify a frequency ladder because demand splits across casual weekly riders and daily devotees. A small-to-mid boutique should not copy this without the demand data to support it — the default boutique shape is single-anchor, not multi-tier.

### CorePower Yoga (boutique-scale multi-location, single-tier + annual)
- Pattern observed: Primary product is the All Access membership — one tier (full unlimited at all studios) — available month-to-month (~$178–$189/mo depending on market) or annual ($1,500–$2,000 prepaid). Studio-specific single-location tier exists as a cheaper alternative. New-student offers (first free week) live on a separate route (`/content/new-student-offers`) entirely distinct from the pricing surface (`/content/buy`, `/content/all-access-membership`).
- URLs:
  - https://www.corepoweryoga.com/content/all-access-membership
  - https://www.corepoweryoga.com/content/buy
  - https://www.corepoweryoga.com/content/membership-offers
- last_verified: 2026-04-15
- What to notice: physical separation between new-student offers and full pricing is structural — two routes, not two sections of one page. This is the canonical fix for `pricing-above-fold-on-first-visit`. Annual-vs-monthly is offered but as distinct SKUs rather than a toggle; a toggle with savings math would be a better surface and is the recommended pattern.

### Peloton (subscription-only, three-tier app with toggle)
- Pattern observed: Three-tier app grid — App One ($0/mo free tier, capped at 3 equipment-cardio classes/mo), App+ ($9.99/mo unlimited cross-modal), Strength+ ($9.99/mo strength-only no-equipment). All-Access ($49.99/mo) is the hardware-member tier on a separate row. Tiers are differentiated by programming scope and equipment requirement, not by class count.
- URLs:
  - https://www.onepeloton.com/membership
  - https://www.onepeloton.com/app-membership
  - https://support.onepeloton.com/s/article/Peloton-Membership-Peloton-App-Memberships-vs-Peloton-All-Access-Membership
- last_verified: 2026-04-15
- What to notice: not a studio, but instructive because the 3-tier app grid uses scope (modalities, equipment) as the axis instead of frequency. A boutique studio with multiple formats (Pilates + barre + strength) could legitimately use scope-based tiers the way Peloton does — this is the rare case where three tiers is correct for a non-franchise. The free tier at $0 is a permanent acquisition funnel, not an intro offer; it does not conflict with `intro-offer-funnel.md`.

### Equinox (high-end multi-location, tiered by access footprint)
- Pattern observed: Four tiers differentiated by geographic access footprint — Single Club ($230–$320/mo), All-Access ($260–$285/mo regional), Destination Standard ($355/mo), Destination Premium ($395–$415/mo), E Club ($500+/mo). One-time initiation fee ($100–$500) disclosed separately. Price varies by market and is disclosed through club-specific pricing conversations, not a public national grid.
- URLs:
  - https://www.equinox.com/memberships
  - https://www.nerdwallet.com/finance/learn/how-much-does-an-equinox-membership-cost
  - https://equinoxmembership.com/destination/
- last_verified: 2026-04-15
- What to notice: tier axis is geographic reach, not class count. Appropriate for a membership-gym model where the product is facility access. A pilates studio could not copy this structure because the access footprint axis doesn't apply — 2 locations is not enough to justify "Single Club / All-Access" differentiation. Matching the tier axis to the underlying business model is the pattern to extract, not the specific names.

### F45 Training (franchise, unlimited with contract-length discounting)
- Pattern observed: Single primary product (unlimited group training) with three commitment-length price points — month-to-month (~$170/mo), 6-month (~$165/mo), 12-month (~$155/mo, annual maintenance fee waived). Class-pack drop-in option (~$20–$30/class) exists as a non-recurring alternative. Per-studio variance is real ($150–$300 range nationally).
- URLs:
  - https://f45training.com/faqs/
  - https://member-help.f45.com/support/solutions/articles/151000175895-how-much-does-an-f45-membership-cost-
- last_verified: 2026-04-15
- What to notice: tiers are commitment-length, not class-count. This is the third valid multi-tier axis (after frequency and scope). The shopper picks how confident they are in their habit and the studio discounts accordingly. Commitment length is the tier — which means commitment length MUST be adjacent to price on the card; it is the price differentiator and hiding it in small print destroys the entire structure.

### Lagree / SLT / Platform Lagree (boutique, mixed per-studio)
- Pattern observed: Per-studio independent pricing. Typical structure: class packs ($37 single, $169–$499 for 5–15-class bundles), 30-class monthly pass ($159), monthly unlimited with 3-month commitment ($269), annual unlimited ($2,899). Perks bundled into unlimited (60-day booking window, guest passes, late-cancel forgiveness) match the Solidcore boutique-perks pattern.
- URLs:
  - https://platformlagree.com/pricing
  - https://lagreemt.com/pricing
- last_verified: 2026-04-15
- What to notice: single-anchor boutique shape with perk-dressed unlimited + class-pack ladder. 3-month minimum commitment is explicit and adjacent to price — correct fix for `commitment-length-buried`. Annual-vs-monthly is offered but as separate SKUs rather than a toggle.

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — typecheck-clean in isolation against shadcn primitives.
// Shows BOTH shapes: (1) boutique single-anchor with add-ons, (2) franchise 3-tier with
// monthly/annual toggle and "most popular" highlight. The generator picks ONE shape
// based on the studio's business model — shipping both is an anti-pattern.

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"

type MoneyCents = number // store in cents to avoid rounding drift

type BoutiqueMembership = {
  name: string            // "Unlimited"
  priceMonthlyCents: MoneyCents
  commitmentMonths: number // e.g. 3
  perks: string[]         // "Early booking · 24h ahead" etc.
  assumedVisitsPerMonth: number // for per-class math
}

type BoutiqueAddOn = {
  name: string            // "10-class pack"
  priceCents: MoneyCents
  classes: number
}

function formatUsd(cents: MoneyCents) {
  return `$${(cents / 100).toFixed(0)}`
}

function perClassLine(priceCents: MoneyCents, classes: number) {
  const per = priceCents / classes / 100
  return `= $${per.toFixed(2)}/class at ${classes} classes`
}

export function BoutiquePricing({
  membership,
  addOns,
  locationName,
}: {
  membership: BoutiqueMembership
  addOns: BoutiqueAddOn[]
  locationName: string
}) {
  return (
    <section className="mx-auto max-w-3xl space-y-6 py-10">
      <header className="space-y-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Membership · {locationName}
        </h2>
        <p className="text-muted-foreground">
          One commitment. No confusing tiers.
        </p>
      </header>

      <Card className="border-primary/40">
        <CardHeader>
          <CardTitle className="flex items-baseline justify-between">
            <span>{membership.name}</span>
            <span className="text-3xl font-semibold">
              {formatUsd(membership.priceMonthlyCents)}
              <span className="text-base font-normal text-muted-foreground">
                /mo
              </span>
            </span>
          </CardTitle>
          <CardDescription>
            {perClassLine(
              membership.priceMonthlyCents,
              membership.assumedVisitsPerMonth,
            )}{" "}
            · {membership.commitmentMonths}-month minimum, then month-to-month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {membership.perks.map((p) => (
              <li key={p} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-primary" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button size="lg" className="w-full">
            Start membership
          </Button>
        </CardFooter>
      </Card>

      {addOns.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Prefer to pay as you go?
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {addOns.map((a) => (
              <Card key={a.name}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{a.name}</CardTitle>
                  <CardDescription>
                    {perClassLine(a.priceCents, a.classes)}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0">
                  <span className="text-xl font-semibold">
                    {formatUsd(a.priceCents)}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  )
}

type FranchiseTier = {
  id: string
  name: string            // "Basic" | "Elite" | "Premier"
  classesPerMonth: number | "unlimited"
  usageGuidance: string   // "avg. 1x/week"
  priceMonthlyCents: MoneyCents
  priceAnnualCents: MoneyCents // 12-month prepay
  isRecommended?: boolean
}

export function FranchisePricing({
  tiers,
  studioName,
  priceRangeNote,
}: {
  tiers: FranchiseTier[]
  studioName: string
  priceRangeNote?: string // "Pricing varies by studio — $59–$179/mo nationally"
}) {
  const [cadence, setCadence] = useState<"monthly" | "annual">("monthly")

  return (
    <section className="mx-auto max-w-5xl space-y-6 py-10">
      <header className="space-y-2 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">
          Memberships · {studioName}
        </h2>
        {priceRangeNote ? (
          <p className="text-sm text-muted-foreground">{priceRangeNote}</p>
        ) : null}
      </header>

      <div className="flex justify-center">
        <Tabs
          value={cadence}
          onValueChange={(v) => setCadence(v as "monthly" | "annual")}
        >
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="annual">Annual · save ~17%</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((t) => {
          const priceCents =
            cadence === "monthly" ? t.priceMonthlyCents : t.priceAnnualCents / 12
          const classes =
            t.classesPerMonth === "unlimited" ? 17 : t.classesPerMonth
          return (
            <Card
              key={t.id}
              className={
                t.isRecommended
                  ? "border-primary shadow-md ring-1 ring-primary/40"
                  : undefined
              }
            >
              <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle>{t.name}</CardTitle>
                  {t.isRecommended ? (
                    <Badge className="bg-primary text-primary-foreground">
                      Most popular
                    </Badge>
                  ) : null}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-semibold">
                    {formatUsd(priceCents)}
                  </span>
                  <span className="text-sm text-muted-foreground">/mo</span>
                </div>
                <CardDescription>
                  {t.classesPerMonth === "unlimited"
                    ? "Unlimited classes · "
                    : `${t.classesPerMonth} classes/mo · `}
                  {t.usageGuidance}
                </CardDescription>
                <p className="text-xs text-muted-foreground">
                  {perClassLine(priceCents, classes)}
                </p>
              </CardHeader>
              <CardFooter>
                <Button
                  size="lg"
                  className="w-full"
                  variant={t.isRecommended ? "default" : "outline"}
                >
                  Choose {t.name}
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
```

Three things to notice: (1) the two exports render fundamentally different shapes — a studio ships ONE of them based on business model, never both; (2) per-class math (`perClassLine`) appears on every card in both shapes, computed from price and assumed attendance, so the shopper never has to do arithmetic; (3) commitment length is rendered inline in `CardDescription`, at the same weight as the price — never in a footnote.

## Measurable checks

Prose heuristics applied to rendered pricing pages. Pass/fail judgments.

### tier_count_matches_business_model
**Condition:** A boutique studio (one location or a small multi-location chain with a single class format) presents one membership tier (possibly with add-on class packs), not a 3-column grid with invented "Basic / Premier / Elite" distinctions. A franchise chain with a class-count-ladder business model (Orangetheory, Pure Barre) presents three tiers. A multi-format boutique (Peloton-style, multiple modalities) may use scope tiers; a multi-location high-end chain (Equinox) may use footprint tiers.
**Reasoning:** The tier shape is a rendering of the business. A boutique with three invented tiers reads as manipulative (two columns are duplicates in disguise); a franchise with one tier collapses its own price-anchoring mechanism. Match the shape to the model.

### per_class_value_math_shown
**Condition:** Each tier card shows both the monthly total AND the per-class cost at assumed attendance — either as explicit math ("$175 = $10.29/class at 17 classes") or as usage guidance ("recommended for 3×/week or more"). Not just the headline price.
**Reasoning:** Fitness buyers mentally divide price by frequency. A page that does the division for them converts better than one that leaves it as homework. Orangetheory uses usage guidance; Solidcore implies it through unlimited framing; the best pattern is both.

### commitment_length_adjacent_to_price
**Condition:** Any minimum commitment (3-month, 12-month, no-contract) is rendered in the same card/row as the price, at comparable visual weight. Never only in a footer footnote, never only in the terms link, never only at checkout.
**Reasoning:** FTC click-to-cancel and most state auto-renewal statutes require clear-and-conspicuous pre-authorization disclosure of commitment terms. UX-wise, surprise commitment is the #1 trigger for chargebacks. If the commitment is ugly, the commitment is the problem — design the commitment, don't hide it.

### intro_offer_dominates_first_visit
**Condition:** On any page that a first-time visitor might land on (homepage, `/join`, `/free-class`, `/new-clients`), the intro-offer CTA is more prominent than the full tier grid. The `/memberships` or `/pricing` route itself may lead with tiers, but the first-visit surface must not. Delegates to `intro-offer-funnel.md` for the intro UX details.
**Reasoning:** Precedence rule 3 in `SKILL.md`. Price anchoring dominates first-visit psychology — whichever number the user sees first becomes the frame. If the first number is $175, intro engagement drops; if the first number is $0, the intro claim converts and the $175 becomes legible later.

### annual_monthly_toggle_present
**Condition:** If annual pricing exists (it usually does, at ~10–17% savings), the pricing page exposes a monthly/annual toggle (Tabs, segmented control, or similar) with the savings math visible in the annual option's label or price.
**Reasoning:** The prospect ready to buy monthly is also ready to be shown the annual upsell; a studio that hides annual behind a secondary page leaves the upsell on the floor. Peloton, Equinox, CorePower all offer annuals; toggle presentation is best practice. If the studio has no annual, this check is N/A, not a fail.

### location_pricing_disclosed_early
**Condition:** If the studio is a franchise or chain with real per-location price variance (Orangetheory, F45, Pure Barre), the pricing page either requires location selection before rendering tier prices, or openly discloses the range ("$59–$179/mo depending on studio") with a location selector that narrows the range in place.
**Reasoning:** The national-average shown on the page and the local-actual shown at checkout is the `per-location-price-surprise` anti-pattern — a category-leading chargeback trigger. Full per-studio render or explicit range disclosure are the two acceptable resolutions.

### most_popular_or_recommended_tier_marked
**Condition:** When showing multiple tiers (3+), one is marked as recommended — via a "Most popular" badge, a primary-colored border, an elevated card, or explicit copy ("Our most common choice"). Reduces decision friction on a grid where the shopper lacks a selection heuristic.
**Reasoning:** Three equivalent-looking columns is a decision-paralysis trap. Orangetheory uses frequency guidance as the heuristic; Peloton uses "Most popular" badges; the pattern doesn't matter, the marking does. A single tier (boutique shape) does not need this; the check applies only when tier count ≥ 2.

### intro_not_a_tier_column
**Condition:** The intro offer (first class free, $49 for 2 weeks, starter pack) is NOT rendered as a column in the tier grid alongside Basic/Elite/Premier. It lives in its own section, its own card, its own route — visually and structurally separated from the paid tier table.
**Reasoning:** Conflating intro and tiers destroys both patterns. The intro is an on-ramp, not a permanent-but-worse plan; the tier grid is calibrated to price-anchor the middle option, which breaks when a $0 column is the cheapest. CorePower's two-route separation (`/content/new-student-offers` vs `/content/buy`) is the canonical fix. Delegates messaging to `intro-offer-funnel.md`.

### per_tier_cancellation_terms_visible
**Condition:** Cancellation terms (pause available? cancel fee? notice period?) are surfaced on the pricing page itself — ideally as a line on each tier card or a single row below the grid — not only in a linked "Terms" document. If cancellation policy differs by tier (some franchises lock unlimited into longer contracts), the difference is shown per tier.
**Reasoning:** Auto-renewal and cancellation are part of the price — a $175/mo tier with a 12-month no-cancel clause is a different product from a $175/mo month-to-month tier, and they should not look the same on the page. See `recurring-membership.md` for the cancellation UX mechanics; this check is about surfacing the terms on the pricing page where the decision is made.

## Cross-pattern notes

- **`intro-offer-funnel.md`** — Precedence rule 3 in `SKILL.md`: intro-offer-funnel beats pricing-tier-presentation on first visit. This file governs the full tier table; that file governs the intro surface. The two must not collide: no intro column in the tier grid, no tier grid above the fold on `/join`.
- **`recurring-membership.md`** — Pause/cancel/autopay semantics live there. This file's `per_tier_cancellation_terms_visible` check requires the terms to surface on the pricing page; the recurring-membership reference owns what those terms actually are and how they are executed post-signup.
- **`package-credits.md`** — Class packs (10-pack, 20-pack) are the non-recurring alternative to autopay membership and often appear on the pricing page as secondary surface. This reference governs the recurring-tier presentation; `package-credits.md` governs the credit-purchase UX and expiry. A well-structured boutique pricing page surfaces both (see Barry's, Solidcore).
- **`multi-location-selection.md`** — `location_pricing_disclosed_early` delegates to that reference for how location selection is presented. Franchise pricing pages that do not integrate a location selector cannot satisfy both patterns simultaneously.
- **`mobile-first-defaults.md`** — Three-column tier grids must collapse to a vertical stack at mobile breakpoints, with the recommended tier floated to the top. A 3-column grid at 375px is unreadable; a horizontal scroll carousel is an anti-pattern for decision-pressure screens. Precedence rule 1 applies.
- **`booking-flow.md`** — The CTA on each tier card ("Choose Premier," "Start membership") hands off to the booking/signup flow. The pricing page owns the decision; the booking flow owns the conversion. The handoff must preserve the tier selection (URL param, state) so the shopper does not re-pick the tier on the next screen.
