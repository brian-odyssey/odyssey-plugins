# Package and credit purchase

## What it is

The non-membership purchase model in which a user buys a fixed quantity of class credits — "5 classes for $155," "10 classes for $199," "20 classes for $560" — and spends those credits one-per-class at the user's own pace. Credits typically expire on a defined window after purchase (the smaller the pack, the shorter the window: 30 days for a single, 45–90 days for a mid-pack, 6–12 months for a large pack). Packs are the boutique-fitness answer for customers who attend 2–6× per month — too frequent for drop-in economics, too infrequent for an unlimited membership to pencil. Packs coexist with memberships in the same catalog and the same user can hold both.

The pattern covers: the pack-purchase flow, credit-balance visibility, credit-expiry UX (the warning-before-expiry moment), stacking packs of different sizes (and understanding which credits burn first when two packs overlap), gifting packs to a friend, refund and pack-to-membership conversion paths, and — the quiet UX killer — disambiguating "I have 2 pack credits AND a month of membership, which one gets used when I book?" The dual-balance ambiguity is the single most common source of pack-related support tickets and review complaints across the category.

## Why it matters in fitness

Boutique studios lose real money when packs are hostile. Credits expire, the customer feels robbed, the chargeback lands, the negative review goes up, and the LTV evaporates — all over a product the studio literally already collected cash for. SoulCycle was sued over 30-day pack expiry (the 2016 class action led to a 2017 settlement) and still enforces 30-day expiry on Soul Renew packs; ClassPass has an active class-action challenge to its credit expiry policy. Pack UX is not cosmetic — it is the legal surface area where a studio's pricing page meets FTC unfair-practice and state-level gift-card-style consumer-protection statutes.

Packs also serve a fundamentally different customer than memberships. The pack-buyer is commitment-averse — the friend who travels for work two weeks a month, the new parent with irregular availability, the cautious shopper who completed the intro pack and is not yet ready for a $175/mo autopay. Designing the pack experience as a second-class citizen to membership (harder to find on the pricing page, balance harder to see in-app, expiry warnings absent) pushes these customers toward churn or toward ClassPass, where the studio captures a lower revenue share. The correct framing: pack buyers are a distinct, valuable segment, not membership-shoppers-who-didn't-convert.

Three fitness-specific forces shape pack UX: (1) the pack is purchased once but consumed N times, so every booking screen needs to disclose which credit is being spent; (2) pack-and-membership coexistence creates consumption-order ambiguity — most MT/MindBody/ClubReady systems silently prefer the membership (because it's cheaper per-class to the business), which silently burns the user's month without touching the pack credits, so the pack sits and expires while the user is paying for both; (3) unused-credit refund policy is the single most common ambiguous fine-print surface — the reasonable default of "credits on cancellation are forfeit" reads as theft to the customer who just paid $305 for 10 classes and used 2 before a move.

## Anti-patterns

### credit-balance-invisible
Logged-in user cannot see their remaining credit balance at a glance. Balance is buried under Account → Billing → Purchase History, requiring 2–3 taps to find. Result: user forgets they have 3 unused credits, buys a new drop-in, and the original credits expire unused. Fails because the credit balance is the user's financial state in the app — hiding it is equivalent to a bank app that hides the account balance behind a menu. The correct placement is the nav/header on web and the account-tab badge on mobile, visible on every page where booking can happen.

### silent-credit-expiry
Credits expire without any warning communication. No email at 14 days out, no push at 7, no in-app banner. The user logs in the day after expiry, sees "0 credits," contacts support, and either accepts the loss angrily or charges back. Fails because every other category with expiring value (airline miles, hotel points, store credit) has built warning cadences that consumers expect — fitness is the outlier, and the absence reads as predatory. FTC unfair-practices doctrine specifically flags silent expiry of prepaid value as a risk area, and SoulCycle's 2016/2017 class-action settlement was anchored on precisely this.

### pack-vs-membership-ambiguity
User holds both a 10-pack and a month's membership. The booking flow does not disclose which balance gets consumed when the user confirms a class. The MT/MindBody backend silently picks one (usually membership, because per-class cost to the business is lower), the pack sits untouched for weeks, and the user learns about it only when the pack expires or when they discover their membership auto-renewed despite having 7 unused credits. Fails because the user is making a financial decision they don't realize they're making. Every pre-booking confirmation must explicitly name the credit source: "This class will use 1 Intro 4-Pack credit · 3 remaining" vs "This class is covered by your Unlimited membership."

### no-gift-flow
Pricing page offers only self-purchase. No "Buy as a gift" toggle, no separate `/gifts` or `/gift-cards` route. Boutique fitness gifting is an under-exploited revenue channel — birthdays, new-mother gifts, corporate wellness, holiday staff gifts — and studios that route gifting through a hack ("email us to gift a pack") capture a fraction of the dollars that studios with a first-class gift flow do. Barry's, SoulCycle, CorePower Yoga, and ClassPass all ship dedicated gift-card surfaces; a boutique without one is leaving money on the table and also signals "not a serious consumer product."

### hidden-fine-print
Pack terms — expiration window, refund policy, transferability, sharing between locations, per-class value on refund — live in a 4pt-gray footer, in the terms-and-conditions page, or only in the post-purchase receipt email. Buyer signs up for a "$305 10-pack" and discovers only at the chargeback-dispute stage that credits expired in 90 days, were non-refundable, and could not be used at the studio's new location. Fails because these are material terms that affect the purchase decision; burying them is the same FTC negative-option concern that applies to intro-offer auto-renewal. Pack terms belong above the BUY button in the purchase flow, not in the footer.

### refund-as-black-box
User cancels membership or moves away; unused pack credits enter limbo. No account-page action to request a refund, convert the credits to account credit, transfer to a friend, or donate back. User files a support ticket, gets a "packs are non-refundable per terms" form reply, and goes to chargeback. Fails because the honest-broker pattern here is a short list of real options surfaced in account settings: refund (with terms), convert to account credit (for merch or future use), transfer to a named friend (some states require this for gift-card-style balances), or donate/forfeit. Forcing the user through support is a de-facto denial — the design choice says "we hope you give up."

### consumption-order-hidden
Related to pack-vs-membership-ambiguity but narrower — the consumption-order rule exists, but is not disclosed anywhere in the UI. E.g., the system burns expiring-soonest credits first (a reasonable default), but the user never sees that rule, so they're confused when their 10-pack (90-day expiry, bought Jan) consumes before their 5-pack (45-day expiry, bought Feb) because the 5-pack has a later absolute expiry date. Fails because an undisclosed rule, even a reasonable one, is a trust event every time the user notices it. The rule belongs on the account-balance surface and in a tooltip on the pre-booking confirmation.

## Real-world references

### Barry's
- Pattern observed: Dedicated `/buy-classes` surface distinct from `/pricing` (memberships). Class packs expire one year from purchase date — generous by category standards — and are explicitly "non-refundable and not transferable." Packages are "only valid in regions of equal or lesser value" (cross-market pricing rule). Dedicated `/gift-cards` route for buying a pack or membership as a gift; Barry's class packages can also be "shared amongst clients, or used to make guest reservations, as long as they're used within the same market in which they were purchased" — an explicit transferability-within-market rule, disclosed in FAQ.
- URLs:
  - https://www.barrys.com/buy-classes
  - https://www.barrys.com/pricing
  - https://www.barrys.com/gift-cards
  - https://www.barrys.com/faq
- last_verified: 2026-04-15
- What to notice: three-surface structure — `/buy-classes` (packs), `/pricing` (memberships), `/gift-cards` (gifting). Separating the pack-purchase surface from the membership surface is the correct fix for pack-as-second-class-citizen. 12-month expiry on packs is aggressive relative to SoulCycle's 30-day; the category's high end demonstrates that short expiry is a choice, not a constraint. Explicit guest-reservation rule turns a pack into a social good and is the honest alternative to the black-box transferability non-answer.

### Solidcore
- Pattern observed: Per-pack expiry ladder: single credit 30 days, 5-pack 45 days, 10-pack 90 days, New Client 4-Pack 30 days. Larger packs have longer runways — expiry scales with commitment. A 20-class pack is positioned as non-expiring for "casual or traveling members." Pricing is in per-studio pages (e.g., Austin/Triangle) so pack prices and per-class economics render from location-specific data.
- URLs:
  - https://solidcore.co/faqs
  - https://solidcore.co/terms-and-conditions
  - https://solidcore.co/tx/austin/the-triangle/pricing/
  - https://solidcore.co/manage-membership
- last_verified: 2026-04-15
- What to notice: expiry-scales-with-commitment is the humane version of pack expiry — short windows force use of small packs, long windows reward big-pack buyers. The 20-pack-never-expires carve-out explicitly names the traveling/irregular segment that benefits most from packs, showing Solidcore has thought about pack-buyer personas as distinct from membership-buyer personas. Pricing per-studio is the correct fix for franchise / multi-market studios where pack prices legitimately vary.

### SoulCycle
- Pattern observed: Class packs sold in 4/8/12/16 class quantities at `/series/`. Class-pack expiry is 30 days for Soul Renew subscription packs with "unused classes will not rollover" and "SoulCycle cannot extend class pack series." First Time 2 Week Unlimited Pack expires 14 days from purchase, also non-rollover, non-extendable. A 2016 class-action lawsuit over pack expiry ("selling classes that expire in 30 days") led to a 2017 settlement; the 30-day policy remains in force post-settlement but with clearer disclosure.
- URLs:
  - https://www.soul-cycle.com/series/
  - https://www.soul-cycle.com/legal/unlimited-terms-and-conditions/
  - https://www.soul-cycle.com/soulconnected/soul-renew-faqs/
- last_verified: 2026-04-15
- What to notice: short expiry + explicit non-extendability is the legal-surviving version of aggressive pack UX. What the settlement changed was not the policy but the disclosure conspicuousness — the terms pages now spell out "will not rollover" and "cannot be extended" in plain language at point-of-sale, not buried. A studio adopting SoulCycle's expiry economics must adopt SoulCycle's disclosure hygiene, or it will land where SoulCycle did in 2016.

### Pure Barre
- Pattern observed: Dedicated help-center article "I Have Credits On My Account, But I'm Still Not Able To Book" — an explicit acknowledgment that credit-balance-visible-but-not-bookable is a common user failure mode (booking window not open, class requires membership, credit type mismatch). Pack terms vary by franchisee; local studios post "Pure 8" and "Pure 4" pack terms per-location. Class-packs policy is that credits "don't usually expire" at the brand level but franchisee-level expiry rules apply — a franchise-model complication that pack UX has to render from per-studio data.
- URLs:
  - https://help.purebarre.com/hc/en-us/articles/22083225704727-I-Have-Credits-On-My-Account-But-I-m-Still-Not-Able-To-Book
  - https://www.purebarre.com/terms
  - https://www.purebarre.com/classpoints
- last_verified: 2026-04-15
- What to notice: the help-center article is a diagnostic artifact — if a studio needs to publish an FAQ explaining why a visible credit is not bookable, the UI is failing at the booking moment. The correct fix is inline at booking ("Can't book? This class requires a membership credit; you have 3 pack credits"), not a help-center article. Franchise-per-studio pack terms is the same rendering challenge as Orangetheory's intro-offer variance.

### CorePower Yoga
- Pattern observed: `/content/studio-class-packs` is a dedicated pack surface, distinct from `/content/buy` (memberships) and `/content/membership-offers` (promos). Pack sizes 5/10/20 at $109/$199/$539 (approximate; varies). Eligible-groups pricing (students, teachers, military, first responders) applies to both memberships and packs at 20% off — an inclusion-of-packs-in-discount-programs choice that matters.
- URLs:
  - https://www.corepoweryoga.com/content/buy
  - https://www.corepoweryoga.com/content/studio-class-packs
  - https://www.corepoweryoga.com/content/membership-offers
- last_verified: 2026-04-15
- What to notice: the three-URL separation (`/buy` vs `/studio-class-packs` vs `/membership-offers`) is the strongest structural separation of the three product models in the category and is the correct anti-tier-table pattern. Bundling the 20%-off eligibility program across packs + memberships demonstrates that packs are a first-class product, not a consolation prize for membership-shy shoppers.

### Y7 Studio
- Pattern observed: Single drop-in $32, 5-pack $155, 3-class intro pack $59. Memberships: 4-class/mo at $119, unlimited at $209, both include digital access and studio amenities (sock/mat rental). Pack pricing sits alongside membership on the pricing surface with a clear price-per-class comparison ($32 drop-in vs $31/class 5-pack vs $19.67 intro). Annual unlimited at 45% off appears on `shop.y7-studio.com` as a separate product SKU.
- URLs:
  - https://www.y7-studio.com/classes
  - https://shop.y7-studio.com/products/y7-studio-annual-unlimited-all-access-membership
  - https://www.y7-studio.com/online
- last_verified: 2026-04-15
- What to notice: transparent per-class math on the pricing surface — the 5-pack is $31/class vs $32 drop-in, a thin saving that honestly positions the pack as "slight discount + commitment-free flexibility" rather than "huge savings." This honest-framing approach avoids the over-promise failure mode where "save 20%!" packs carry hidden expiry that erases the discount.

### Rumble Boxing
- Pattern observed: Per-studio pricing pages at `rumbleboxing.com/<city>-pricing` (Vancouver, Calgary, Richmond, West 85th). Class packs exist alongside memberships at per-studio prices. Franchise model means pack size, price, and expiry are per-studio — no brand-global pack spec.
- URLs:
  - https://rumbleboxing.com/vancouver-pricing
  - https://rumbleboxing.com/calgary-pricing
  - https://rumbleboxing.com/west85th-pricing
  - https://www.rumble-gym.com/join
- last_verified: 2026-04-15
- What to notice: per-studio-URL architecture means pack terms render from location-specific data, the correct pattern when franchise variance is real. A brand-global pack page would be wrong here; the `/vancouver-pricing` and `/calgary-pricing` routes acknowledge the truth that the business operates as 30+ separate pricing entities.

### 305 Fitness
- Pattern observed: `/buy-classes` pack surface, single class $34 in NYC, 10-class pack $305. Membership packs push credits into the user's MindBody account on a monthly cadence (8 or 12 credits/mo at $219 or $305). Late-cancel fee $15, no-show fee $30, "the original credit is returned to your account" on enforcement — a refund-to-credit pattern distinct from cash refund.
- URLs:
  - https://www.305fitness.com/buy-classes
  - https://305fitness.com/member-faqs-nyc
  - https://www.305fitness.com/new-to-305
- last_verified: 2026-04-15
- What to notice: the "credit returned on enforced cancel" pattern is the correct fairness move — the studio collects the fee for the business harm (missed spot) but does not double-dip by also consuming the credit. It's also a disclosure artifact that tells the user explicitly: "we know you care about your credits, and we're not going to burn one for a $15 enforcement event."

### ClassPass (aggregator, not a studio)
- Pattern observed: Cross-studio credit system with explicit rollover cap: "up to the number of credits included in your next cycle's plan" roll over, excess expires at 11:59 PM on the day before renewal. Trial credits never roll. An active class-action lawsuit (filed 2024, ongoing) challenges the legality of the expiry policy under state consumer-protection law — a data point any studio adopting short-expiry packs should weigh.
- URLs:
  - https://help.classpass.com/hc/en-us/articles/209367426-Do-my-credits-roll-over
  - https://help.classpass.com/hc/en-us/articles/360002359832-What-are-credits
  - https://classpass.com/terms/usa
- last_verified: 2026-04-15
- What to notice: the rollover-capped-at-next-cycle rule is a humane middle ground between "credits never expire" (studio absorbs inventory risk) and "unused credits evaporate monthly" (user absorbs all risk). Worth considering for studios that want to discourage hoarding without triggering chargeback season. The active litigation is a reminder that even clearly-disclosed aggressive expiry is not automatically safe harbor.

### Lagree (per-studio, franchise-ish)
- Pattern observed: Expiry varies wildly studio-to-studio within the Lagree ecosystem: Lagree YYC 12 months no extensions; Lagree Underground 6 months; Trim Fitness 6 months; Form by Two 30 days from first use; Lagreeology 45 days from purchase. No brand-global rule — each studio sets its own policy and publishes it on its own pricing page.
- URLs:
  - https://www.lagreeyyc.com/pricing/
  - https://lagreeunderground.com/pricing/
  - https://www.trimfitnessstudio.com/pricing
  - https://www.formbytwo.com/pricing
  - https://lagreeology.com/pricing/
- last_verified: 2026-04-15
- What to notice: the variance (30-day to 12-month expiry across ostensibly similar studios) confirms there is no industry-standard answer. What every Lagree studio does share is surfacing the expiry rule on the pricing page, above the BUY button, in plain text — the consistency is in disclosure hygiene, not in the policy itself. This is the correct baseline: pick your expiry, own it on the page where the sale happens.

### F45 Training (finding: packs are de-emphasized, not absent)
- Pattern observed: F45 is primarily a membership-and-trial business — the main funnel is the 7-Day Trial Pass ($15–$30) or the "3 for $30" trial, both with short expiry (e.g., 7 days consecutive from first visit). Per-studio franchisees do offer 5/10/20-class passes ($119/$200–$270/$400–$540) but these are not promoted on the brand-global site — they're a per-studio add-on. The brand is honest about this model: the FAQ and studio-level pricing sheets surface packs, the homepage does not.
- URLs:
  - https://f45training.com/faqs/
  - https://f45training.com/3for30/
  - https://member-help.f45.com/support/solutions/151000218374
- last_verified: 2026-04-15
- What to notice: this is a deliberate product-positioning choice, not a UX bug. F45's model is "5-week challenges + unlimited membership" — packs would cannibalize the challenge cadence. A studio whose business model is all-in-or-out may legitimately choose to not sell packs prominently; the honest UX then is to not pretend they exist on the homepage. Anti-pattern translation: if you don't sell packs, don't fake-offer them in a pricing table just to have a middle column.

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — adapted from shadcn primitives, typecheck-clean in isolation.
// Adapt to target brand. Not CI-validated against any specific project.
// Shows: (1) credit balance visible in header, (2) pre-booking confirmation that discloses
// which credit source will be consumed, (3) expiry warning banner, (4) pack-purchase card
// with terms disclosed above the BUY button.

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Clock, Gift } from "lucide-react"

type CreditSource =
  | { kind: "pack"; packName: string; remaining: number; expiresOnLabel: string }
  | { kind: "membership"; planName: string; renewsOnLabel: string }

type Pack = {
  id: string
  name: string              // e.g., "10-Class Pack"
  classes: number           // 10
  priceUsd: number          // 305
  expiryDays: number        // 90
  refundable: boolean
  transferable: boolean
  perClassUsd: number       // 30.50
}

export function CreditBalanceBadge({ sources }: { sources: CreditSource[] }) {
  const totalPackCredits = sources
    .filter((s): s is Extract<CreditSource, { kind: "pack" }> => s.kind === "pack")
    .reduce((sum, s) => sum + s.remaining, 0)
  const hasMembership = sources.some((s) => s.kind === "membership")

  if (totalPackCredits === 0 && !hasMembership) {
    return (
      <Badge variant="outline" className="gap-1">
        No credits
      </Badge>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {totalPackCredits > 0 ? (
        <Badge variant="secondary">
          {totalPackCredits} credit{totalPackCredits === 1 ? "" : "s"}
        </Badge>
      ) : null}
      {hasMembership ? <Badge className="bg-primary/15 text-primary">Member</Badge> : null}
    </div>
  )
}

export function ExpiryWarningBanner({
  packName,
  remaining,
  daysUntilExpiry,
}: {
  packName: string
  remaining: number
  daysUntilExpiry: number
}) {
  if (daysUntilExpiry > 14 || remaining === 0) return null
  const urgent = daysUntilExpiry <= 7

  return (
    <Alert variant={urgent ? "destructive" : "default"}>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>
        {remaining} credit{remaining === 1 ? "" : "s"} expiring in {daysUntilExpiry} day
        {daysUntilExpiry === 1 ? "" : "s"}
      </AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-3">
        <span>{packName} — use them or they're gone.</span>
        <Button size="sm" variant={urgent ? "secondary" : "outline"}>
          Book a class
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export function PreBookingCreditDisclosure({
  consuming,
  remainingAfter,
}: {
  consuming: CreditSource
  remainingAfter: string
}) {
  return (
    <div className="rounded-md border bg-muted/40 p-3 text-sm">
      <p className="font-medium">What gets used for this booking</p>
      {consuming.kind === "pack" ? (
        <p className="mt-1 text-muted-foreground">
          1 credit from <strong>{consuming.packName}</strong> — expires{" "}
          {consuming.expiresOnLabel}. {remainingAfter}
        </p>
      ) : (
        <p className="mt-1 text-muted-foreground">
          Covered by your <strong>{consuming.planName}</strong> — renews{" "}
          {consuming.renewsOnLabel}. Pack credits are preserved.
        </p>
      )}
    </div>
  )
}

export function PackPurchaseCard({ pack }: { pack: Pack }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between gap-2">
          <span>{pack.name}</span>
          <span className="text-2xl font-semibold">${pack.priceUsd}</span>
        </CardTitle>
        <CardDescription>
          {pack.classes} classes · ${pack.perClassUsd.toFixed(2)} per class
        </CardDescription>
      </CardHeader>

      {/* Terms block — ABOVE the BUY button, not in the footer */}
      <CardContent>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 shrink-0" />
            Expires {pack.expiryDays} days after purchase — no extensions
          </li>
          <li>{pack.refundable ? "Refundable within 7 days" : "Non-refundable"}</li>
          <li>{pack.transferable ? "Transferable — use with a friend" : "Non-transferable"}</li>
        </ul>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button size="lg" className="flex-1 font-semibold">
          Buy for myself
        </Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" variant="outline" className="gap-1">
              <Gift className="h-4 w-4" /> Gift it
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gift {pack.name}</DialogTitle>
              <DialogDescription>
                We'll email the recipient a redemption code. Same terms apply —
                expires {pack.expiryDays} days after they redeem.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Continue to gift checkout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
```

Four things to notice in the snippet: (1) `CreditBalanceBadge` is designed to sit in the header nav — always visible, not buried in a menu; (2) `PreBookingCreditDisclosure` explicitly names which balance is being consumed and what happens to the other balance, fixing `pack-vs-membership-ambiguity`; (3) `ExpiryWarningBanner` activates at T-14 days and escalates at T-7, fixing `silent-credit-expiry`; (4) the `PackPurchaseCard` terms block is a `CardContent` child that renders ABOVE the `CardFooter` buttons — the buyer reads expiry/refund/transferability before clicking BUY, fixing `hidden-fine-print`. The gift-flow is a peer action at the BUY button, not a separate page the user has to hunt for.

## Measurable checks

Prose heuristics a reviewer applies to the rendered pages. Pass/fail judgments.

### credit_balance_visible_in_header
**Condition:** A logged-in user with non-zero pack credits sees their remaining credit count in the global nav/header on web and on every primary surface of the mobile app (home, schedule, account). Not buried under Account → Billing → Purchase History. A credit badge in the header or a pinned balance card on the account tab both pass.
**Reasoning:** The credit balance is the user's financial state — hiding it is the category's most common UX failure. Users who can see their balance book classes they've paid for; users who can't re-buy drop-ins and let credits expire. The fix is trivial and the payoff (lower expiry-loss complaints, higher per-credit utilization) is immediate.

### expiry_countdown_visible_14_days_out
**Condition:** If any pack credit will expire within 14 days, the UI surfaces the expiring count, the pack name, and the expiry date on the account/home surface with a "use them" CTA. Escalate visually at T-7. At minimum also send an email at T-14 and T-3.
**Reasoning:** Silent expiry is both the legal risk surface (SoulCycle 2016/2017 class-action, ClassPass active litigation) and the trust-destruction surface. Warning at 14 days gives a weekly-cadence user two shots at attendance and a biweekly user one. T-7 escalation captures the final-push window. A studio without expiry warnings is choosing silent forfeiture as revenue — a choice that survives short-term and loses long-term.

### pack_vs_membership_precedence_disclosed
**Condition:** When a user holds both a pack and a membership, the pre-booking confirmation discloses which balance will be consumed and what happens to the other. Example pass: "This class will use 1 Intro 4-Pack credit · 3 remaining. Your Unlimited membership is not affected." Example fail: generic "Confirm booking" with no source named.
**Reasoning:** The dual-balance ambiguity is the single most confusing moment in the pack experience. Most backends (MT, MindBody, ClubReady) silently pick one — usually membership — without user consent. The user learns only in hindsight that their pack sat while their membership carried bookings. Disclosing the rule at the confirmation moment both informs the decision and builds trust that the system is honest about which dollars it's spending.

### gift_purchase_flow_exists
**Condition:** The pricing or pack-purchase surface offers a "Buy as a gift" action next to "Buy for myself," routing to a gift-checkout with recipient name/email capture and a redemption code or email. Alternatively, a dedicated `/gift-cards` or `/gifts` route linked from the pricing page. A "contact us to gift a pack" footnote does not pass.
**Reasoning:** Boutique fitness gifting is a significant and under-captured revenue channel — birthdays, new-mother, corporate wellness, holiday. Barry's, SoulCycle, CorePower, and ClassPass all ship first-class gift flows because the economics reward it. A studio without a gift flow signals "small shop" to the kind of customer who would be buying a gift for a friend there, and pushes that transaction to ClassPass instead.

### pack_terms_above_buy_button
**Condition:** Expiration window, refund policy, and transferability are disclosed in plain language directly adjacent to the BUY button for each pack — in the card body, not in the page footer, not only in terms-and-conditions, not only in the post-purchase email. A user skim-reading the pack card sees the expiry number before clicking BUY.
**Reasoning:** These are material terms that affect the purchase decision. Hiding them is the same FTC concern that applies to intro-offer auto-renewal — clear-and-conspicuous disclosure is legal-survivability table stakes. SoulCycle's 2017 post-settlement disclosure hygiene raised the category baseline; Lagree studios across all expiry-window bands share the practice of surfacing the rule on the pricing page.

### refund_path_for_unused_credits
**Condition:** Account settings contains a clear, user-initiated action for unused credits — "request refund," "convert to account credit," "transfer to a friend," or "donate/forfeit." A form that routes to support or an email address does not pass; a button that returns an instant outcome or a routed ticket with SLA disclosure does.
**Reasoning:** The black-box refund is a chargeback factory. Making the options visible and self-serve (even if "refund" has terms limits) turns a support escalation into a product interaction. Some states treat pack credits like gift-card balances with statutory refund rights — for multi-state studios the self-serve path is partial legal protection, not just UX polish.

### consumption_order_disclosed
**Condition:** If the user holds multiple packs (e.g., a leftover 5-pack and a new 10-pack) or a pack plus a membership, the consumption-order rule is named in the UI — on the account balance surface, in a tooltip on the pre-booking confirmation, or in an FAQ linked from both. "Expiring-soonest credits are used first" or "pack credits are used before membership" are both acceptable rules; what's not acceptable is no disclosed rule.
**Reasoning:** An undisclosed rule, even a reasonable one, is a trust event every time the user notices it. Users who understand the rule plan around it ("I'll burn the 5-pack first, then the 10-pack"); users who don't feel the system is making hidden decisions with their money. The fix is copy, not code — the rule already exists in the backend.

### packs_are_a_distinct_product_surface
**Condition:** Packs are a recognized product on the pricing surface with their own section, their own card, and their own expiry/terms. Conflating packs into a $X/mo-style tier column (so the user sees $0 / $89 / $129 / $175 and has to ask "which one is a pack?") fails. Separation by section, by color, or by dedicated URL (CorePower `/studio-class-packs`, Barry's `/buy-classes`) all pass.
**Reasoning:** Pack-buyers are a distinct persona from membership-buyers — commitment-averse, often irregular schedule, often higher per-class willingness to pay. Designing packs as a second-class membership variant buries the product from its actual audience and pushes those buyers to ClassPass instead. The surface separation is the correct way to show packs are a real product, not a fallback.

## Cross-pattern notes

- **`pricing-tier-presentation.md`** governs the membership tier table. This pattern governs the pack surface. They are siblings, not overlapping — the precedence rule is: pack and membership are distinct product types and get distinct surfaces (section, page, or URL). Do NOT render a pack as a column in a membership tier table.
- **`intro-offer-funnel.md`** — the intro-4-pack or intro-2-week-unlimited are hybrid: they are packs for mechanics (they have an expiry, they use credits) and intro-offers for marketing. The intro-offer-funnel rules govern how they're marketed and claimed; this pattern's rules govern how the credits inside them behave post-claim (balance visibility, expiry warnings, consumption order if stacked with a later full-price pack).
- **`booking-flow.md`** owns the confirm-booking surface. This pattern adds a disclosure requirement: the confirmation must name the credit source consumed. If the booking-flow component has no slot for this disclosure, it needs to be extended — do not ship the booking flow without it and promise to add it later; the ambiguity is the whole point of the check.
- **`recurring-membership.md`** owns the autopay/pause/cancel semantics. This pattern interacts at the dual-balance edge — a user cancelling a membership while holding pack credits triggers `refund_path_for_unused_credits`. The cancel flow in recurring-membership must surface the pack balance and offer the credit-preservation options; pushing the cancelling user through a no-state-about-credits cancel path is a cross-pattern failure.
- **`waitlist-cancellation.md`** — late-cancel and no-show fees interact with credit consumption. 305 Fitness's "credit returned on enforced cancel fee" pattern is the honest-broker default; a studio that both charges the fee AND burns the credit is double-dipping and should surface that as a decision, not a silent behavior.
- **`mobile-first-defaults.md`** applies globally. The header credit badge, expiry warning banner, and pre-booking disclosure must all be legible at 375px — no credit-balance-only-on-desktop-header designs, no expiry warnings hidden behind a mobile "learn more" accordion. The PackPurchaseCard in the reference snippet uses `flex-wrap` so the BUY and GIFT buttons stack on narrow viewports without the terms block being clipped.
- **`multi-location-selection.md`** — franchise/per-studio pack variance (Pure Barre franchisees, Lagree studios, Rumble per-city pricing) means pack cards must render from per-studio data, not brand-global templates. Any cross-market rule (Barry's "regions of equal or lesser value") belongs on the pack card in plain language, not only in the terms page.
- **`kiosk-checkin.md`** is out of scope. Pack purchase and credit management are web/mobile-app surfaces; the in-studio kiosk displays a credit balance for confirmation but never transacts pack purchases. A kiosk that attempts pack purchase is an anti-pattern in itself — that surface is for check-in, not commerce.
