# Recurring membership signup, pause, and cancel

## What it is

The lifecycle UX for an autopay (recurring) fitness membership: the signup flow that captures a card on file and discloses the commitment terms, the pause flow that lets a customer hold their spot without losing their rate, the cancel flow that must be findable and usable without a phone call, the upgrade/downgrade path between tiers, and the account-state UI that makes "active," "paused," "pending cancellation," and "expired" unambiguous to the member.

This pattern is distinct from `package-credits.md` (non-recurring class packs, credit expiry, stacking) and from `intro-offer-funnel.md` (first-class-free, $49-intro, trial-to-paid handoff). Recurring membership is the steady-state revenue product after the intro has converted. Most boutique and franchise fitness businesses run on this number — monthly autopay members are the difference between a studio that survives a slow February and one that doesn't.

The pause-vs-cancel distinction is structurally central and must be surfaced explicitly in the UX. Pausing holds the member on the books at reduced or zero cost with a defined resume date; cancellation ends the relationship. These are different business actions with different financial impact to the studio, and merging them — whether by accident (same button) or by design (forcing cancel-seekers through a pause funnel) — is both a retention failure and, increasingly, a legal one.

## Why it matters in fitness

Three forces shape recurring membership in fitness specifically, and they all push on the UX:

First, temporary life events — injury, travel, pregnancy, a 4-week work trip, postpartum recovery — are the norm, not the edge. A member who cancels because they broke a foot is a member lost for a year or more; the same member given a 60-day pause resumes autopay the day the cast comes off. A studio without a visible pause option leaks retention to events it could have held. Barry's explicitly supports pregnancy freezes for the full duration plus postpartum ramp; Orangetheory allows 60 days up to 2x/year. These are not indulgences — they are revenue protection.

Second, cancellation friction has tipped from a dark-pattern growth lever into a regulatory liability. In June 2025 the New York Attorney General secured a $600,000 settlement against Equinox Group (covering Equinox clubs, SoulCycle, and Equinox+) specifically for making memberships hard to cancel — failure to disclose subscription terms, no cost-effective online cancellation mechanism, no compliant acknowledgment. Eligible subscribers received restitution up to $250. The FTC's Click-to-Cancel rule (the 2024 amendment to the Negative Option Rule) was vacated on procedural grounds by the Eighth Circuit in July 2025, but the FTC has signaled it is re-running the rulemaking and California's AB 2863 (effective July 1, 2025) independently requires that cancellation be available "in the same medium" as signup, with annual renewal reminders and promptly-answered phone lines. A studio that requires an in-person visit or certified letter to cancel — Planet Fitness's historical stance — is now operating in a shrinking legal envelope.

Third, commitment terms are a trust artifact. A 12-month locked contract with an early termination fee is a defensible product when the terms are disclosed on the signup card itself (F45 discloses 6- and 12-month terms per studio). The same product becomes a complaint engine when the word "commitment" appears only on page 4 of the membership agreement PDF and the signup button says "month-to-month." Pure Barre's individual-studio variance and Orangetheory's franchise variance mean the per-studio contract length must render from per-studio data on the signup card, not be assumed from a brand-wide template.

## Anti-patterns

### pause-and-cancel-conflated
One button or flow does both pause and cancel, or "Cancel membership" routes the user into a pause-retention flow that a cancel-intending member has to fight past to actually cancel. The UX treats pause as the "soft" version of cancel, as if they were two intensities of the same action. They are not: pausing holds the customer, cancellation loses them. They are structurally different actions with different billing consequences, different account states, and different resumption semantics. Fails because it serves the studio's retention dashboard at the cost of the member's understanding — a member who wanted a cancel and got a pause keeps getting charged a reduced fee they didn't expect; a member who wanted a pause and got a cancel loses their rate and has to re-enroll at the new price. In either direction, trust breaks. Pause and cancel must be two clearly-labeled, independently-reachable actions.

### cancel-via-phone-only
Signup happens online (credit card captured in-browser, autopay enrolled, instant confirmation), but cancellation requires calling a phone number during business hours, with the number often buried in terms. Planet Fitness's historical pattern (in-person at home club or certified-mail letter, no online cancel, no phone cancel, no email cancel) is the extreme example. Fails because it violates the "same medium as signup" standard that California's CARL amendments (AB 2863, effective July 1, 2025) now require explicitly, that the FTC is re-drafting toward post-vacatur, and that multiple state AGs enforce under existing negative-option and UDAP law. It is also the exact failure mode New York AG James's $600,000 Equinox/SoulCycle settlement punished in 2025. Beyond legality: it is the single most complained-about pattern in the subscription-fitness category and it damages word-of-mouth well beyond the cancelling member.

### cancel-buried-in-nested-menus
Cancel is technically available online but requires navigating Account → Billing → Membership → Manage Plan → (scroll past three retention offers) → Cancel Membership → confirmation modal → survey → final confirmation. The path to cancel is materially longer and deeper than the path to sign up. Fails because the fairness contract in CARL and in the FTC's re-drafted rule is "as easy to cancel as to subscribe." A signup that is two taps cannot be paired with a cancel that is fourteen. ClassPass's documented iOS cancel flow is closer to acceptable (profile → Membership → scroll to bottom → Cancel Membership → decline retention → survey → confirm), but even that routinely prompts complaints about retention-offer layering.

### no-pause-option
Studio offers cancel but no pause. Member with a temporary life event — broken foot, 6-week work trip, pregnancy, surgery — must fully cancel, losing their rate, their autopay lock-in, and their commitment-period progress. When they come back, they re-enroll at whatever the current price is. Fails because it converts a temporary retention opportunity into a permanent loss. Every major category operator — Equinox (medical and personal freeze), Barry's (30-day pause plus up-to-6-month injury freeze plus pregnancy freeze), Orangetheory (30–60 days, 2x/year), Solidcore (14-day free freeze plus extended freeze for medical/holiday), ClassPass (pause flow with credits frozen), CorePower Yoga (up to 3-month pause) — offers a pause product. A studio without one is leaving retention on the table and signaling to prospects that it does not accommodate real life.

### silent-renewal-with-price-hike
Autopay renews monthly (or annually for prepaid terms) without the 14-day advance email the California AB 2863 annual-reminder requirement anticipates, and sometimes at a higher price than originally signed up for — the member signed up at $175/mo during a promo, a year later they're at $199 with no notice. Fails because price-change-without-notice is the most trust-destroying flavor of subscription failure; it is the exact category of conduct California's amended ARL targets (express affirmative consent to renewal terms, annual reminder requirement, reminder when material terms change). A studio that raises rates silently is one complaint away from being the next NY AG case study.

### cancel-retention-dark-patterns
Cancel flow surfaces retention offers in unavoidable gates — "Are you sure?" modals three levels deep, mandatory surveys, testimonials inserted between cancel-continue buttons, a "pause instead?" offer that auto-selects itself and requires explicit decline, a 20%-off retention offer that must be viewed for 10 seconds before the skip button unlocks. Fails because it functionally buries cancel while technically providing it. The FTC's vacated click-to-cancel rule and the re-draft both explicitly targeted "simple cancellation mechanism" language — a retention offer that adds more than one step beyond the signup path is on the wrong side of that line. One pause-suggestion with a visible "no thanks, continue canceling" path is the acceptable ceiling; more is anti-pattern.

### commitment-term-hidden-at-signup
Signup card reads "Unlimited · $175/mo" with no indication that this is a 12-month locked contract with a $200 early termination fee. The commitment length appears in the membership agreement PDF and is sometimes disclosed only in the post-signup confirmation email. Fails because the commitment length is the single most material term of the contract after price — a customer signing up for "$175/mo month-to-month" and discovering at cancel time that they owe 9 more months has been deceived, whether or not the fine print was technically present. F45 discloses explicit terms (6- or 12-month minimum plus 14- or 21-day notice period) but the disclosure has to live on the signup card, not in the T&Cs. California's express-affirmative-consent standard for material terms now makes this a legal risk, not just a UX one.

### pause-as-cancellation-obstacle
Member clicks Cancel; the flow routes through a mandatory "Have you considered pausing?" step where Pause is pre-selected and Cancel requires an extra "No, I want to cancel" click. A close relative of pause-and-cancel-conflated and cancel-retention-dark-patterns, but specifically the pattern of weaponizing the pause product as a retention gate for cancel-intending members. Fails because it makes the pause product itself user-hostile — the pause feature becomes associated with cancel-friction rather than with real retention. The fix is to expose Pause and Cancel as peer actions on the same screen, each with equal visual weight, neither pre-selected.

### paused-state-ambiguous
Paused members see "Membership: Inactive" or "Membership: Suspended" with no resume date, no remaining-pause-days counter, and no clear indicator that the membership will automatically resume on a date certain. Members assume they have cancelled and are surprised by the autopay resumption. Fails because ambiguous account state erodes the exact trust the pause feature was supposed to build. The correct UX surfaces "Paused until Apr 29, 2026 · 12 days remaining · resumes at $175/mo" with a Resume-now button and a Cancel-instead button — the member should never have to guess what state they are in.

## Real-world references

### Equinox (and the 2025 NY AG settlement)
- Pattern observed: Freeze is a named, distinct product from cancel — "Freeze" has its own policy page (equinoxmembership.com/freeze/), its own fee ($50/mo personal freeze, $0 for medical freeze with documentation), a max 3 months per calendar year, and requires 5 days advance notice via Concierge@equinox.com. Cancellation after the one-year initial obligation requires 30 days written notice and was historically available via "email, letter, phone, or in-person" — NOT via a self-service online flow. In June 2025 the New York Attorney General secured a $600,000 settlement (Assurance of Discontinuance, Bureau of Internet and Technology) against Equinox Group covering Equinox, SoulCycle, and Equinox+ for failure to disclose subscription terms, failure to provide the NY-required subscription acknowledgment, and failure to offer a cost-effective easy-to-use online cancellation mechanism. Restitution up to $250 per eligible complainant (complaint window Feb 9, 2021 – Dec 31, 2024). As part of the settlement Equinox must change its subscription practices going forward.
- URLs:
  - https://www.equinox.com/member-policies
  - https://equinoxmembership.com/freeze/
  - https://ag.ny.gov/press-release/2025/attorney-general-james-secures-600000-fitness-company-equinox-its-hard-cancel
  - https://ag.ny.gov/sites/default/files/settlements-agreements/equinox-group-llc-assurance-of-discontinuance-2025.pdf
- last_verified: 2026-04-15
- What to notice: the freeze product is well-designed and well-surfaced — separate page, distinct fee, explicit day-count, medical variant free. The cancel product is the part that earned the $600K fine. This is the textbook case of a studio doing pause right and cancel wrong — same org, same brand, different fates. The settlement itself is the single most-citable fitness-category precedent for why cancel-via-phone-only and cancel-buried-in-nested-menus are now regulatory risks, not just UX risks.

### SoulCycle (Soul Renew subscription)
- Pattern observed: Soul Renew (the SoulCycle class-pack subscription) can be cancelled "at any time by visiting the My Soul section of the website or by contacting your local studio or emailing yousoulmatters@soul-cycle.com." Cancellation must be submitted at least 24 hours before the next billing cycle; no refunds if submitted inside 24 hours. Classes continue through the end of the paid billing period after cancel. Included in the 2025 NY AG $600K settlement alongside Equinox — same parent, same violations.
- URLs:
  - https://www.soul-cycle.com/soulconnected/soul-renew-faqs/
  - https://www.soul-cycle.com/legal/unlimited-terms-and-conditions/
- last_verified: 2026-04-15
- What to notice: the self-service web path exists (My Soul section) but the email-your-local-studio alternative remains, and the 24-hour-before-billing-cycle rule is the kind of fine print that California's AB 2863 annual-reminder requirement is designed to surface proactively. Post-settlement, expect the My Soul path to become the primary cancel surface; the email-the-studio option is legacy carryover that was part of what triggered the NY action.

### Peloton (app and all-access membership)
- Pattern observed: Self-service cancellation is available from the authenticated account (onepeloton.com → Profile/Account → Subscription/Membership → Cancel). Critically, the cancel surface differs by purchase platform — memberships purchased via Apple App Store must be cancelled through iOS Settings → Apple Account → Subscriptions → Peloton → Cancel; Amazon-purchased must go through Amazon Subscriptions. Peloton's own help article explicitly tells users "If you subscribed via Apple or Google, Peloton's main site often can't help you." The all-access membership (tied to the hardware bike) and the app membership (standalone) are separate products with separate cancel surfaces.
- URLs:
  - https://support.onepeloton.com/s/article/Peloton-Membership-How-To-Cancel-Your-App-Membership?language=en_US
  - https://www.onepeloton.com/membership-terms
- last_verified: 2026-04-15
- What to notice: this is an example of cancel-via-same-medium-as-signup done correctly — whoever processes the payment controls the subscription, and Peloton tells the user that directly instead of pretending it can cancel an Apple-billed subscription on its own site. The clarity is the feature. For a fitness studio that sells only a direct web subscription, the cancel path should be a single surface; the Peloton pattern is instructive only because it names the platform-billing branch explicitly rather than hiding it.

### Planet Fitness
- Pattern observed: Cancellation is not available online, by phone, by email, or through the app. Must be done either in person at the home club (where you signed up — other locations cannot process) or by sending a certified letter with return receipt requested to the home club. Must be submitted by the 10th of the month or member is billed for the following month. Allow up to 7 business days for processing after the club receives the letter. Annual fee (typically $39–49) is billed separately from monthly dues and has its own cancellation implications.
- URLs:
  - https://www.planetfitness.com/about-planet-fitness/customer-service
- last_verified: 2026-04-15
- What to notice: this is the archetype of cancel-via-phone-only (here: cancel-via-mail-or-in-person-only) and the single most cited "bury-cancel" pattern in consumer subscription literature. Historically defensible on a "we are a franchise, each club manages its own membership" basis; post-CARL-amendment (California, July 1, 2025, "same medium" requirement) and post-Equinox settlement, actively unsafe. A boutique or franchise studio that adopts this pattern in 2026 is choosing regulatory exposure consciously, and it should lose in any design review that cites this reference.

### Solidcore
- Pattern observed: One complimentary 14-consecutive-day freeze per calendar year, requested via in-app chat → Contact Us → freeze request form. Extended freezes available for medical/injury/student-holiday reasons with documentation. Cancellation is also submitted via the digital portal (in-app chat → Contact Us → cancellation request form), responded to within 7 business days, requires 30-day advance notice before next billing date. Class-level (not membership-level) cancel/late/no-show: 10-hour window, lost credit or late-cancel fee if unlimited.
- URLs:
  - https://solidcore.co/manage-membership
  - https://solidcore.co/cancellation-policy
  - https://solidcore.co/terms-and-conditions
  - https://solidcore.co/faqs
- last_verified: 2026-04-15
- What to notice: self-service digital surface is present for both pause and cancel — good. But the surface is a ticket (form submission + 7-business-day response) rather than an instant action, and social posts (Threads, TikTok) document member frustration with the latency. This is cancel-available-online but not cancel-available-instantly; under AB 2863's "promptly" standard it is borderline. The 14-day free freeze is a well-sized product (short enough to matter, long enough to cover a week of travel plus a buffer) but the annual limit is tight compared to Orangetheory's 60-day x 2/year.

### Barry's
- Pattern observed: Membership may be paused one time for 30 days per 6-month period. Injury freeze up to 6 months with documentation. Pregnancy freeze for the full pregnancy duration plus postpartum ramp at member's own pace. Class-level late cancel is 12 hours in advance; inside 12 hours forfeits the class and triggers a no-show fee for members. Membership cancellation via email to member services or in-person at local branch; documentation (doctor's order or verified move out of region) required for mid-term cancellation; memberships are non-refundable and not transferable.
- URLs:
  - https://www.barrys.com/terms-of-service
  - https://www.barrys.com/faq
  - https://barrys.zendesk.com/hc/en-us/articles/27797355355675-Can-I-freeze-my-membership
- last_verified: 2026-04-15
- What to notice: the pregnancy freeze-and-ramp policy is best-in-class for the category — it names the specific life event, specifies duration and resumption semantics, and does not require the member to negotiate. This is the correct fix for no-pause-option when the studio wants to signal it accommodates real life. The "documentation required for mid-term cancellation" is commitment-term-enforced-at-cancel; whether it survives CARL's same-medium requirement depends on how the original signup disclosed the documentation requirement.

### Orangetheory
- Pattern observed: Month-to-month memberships with 30-day cancellation notice (no cancellation fee). Freeze: minimum 30 days, maximum 60 days, up to 2x per year, monthly freeze fee replaces regular dues. Critical rule: cannot cancel while frozen — must resume payments first, then submit the 30-day cancel notice. Cancellation available via in-person at home studio, email, phone, or website. Significant per-franchise variance (enrollment fees, minimum terms, local owner discretion).
- URLs:
  - https://www.orangetheory.com/en-us/memberships
  - https://www.orangetheory.com/en-us/contact-us
- last_verified: 2026-04-15
- What to notice: the multi-channel cancel surface (web OR email OR phone OR in-person) is the current compliance-safe posture — no channel is mandatory, so the "same medium as signup" standard is satisfied by construction. The cannot-cancel-while-frozen rule is a gotcha that members discover at cancel time; it should be surfaced on the pause screen itself, not buried in terms. Franchise variance means the cancel UX must read from per-studio config; a brand-global template is guaranteed to be wrong for some studios.

### Pure Barre
- Pattern observed: Individually owned and operated studios, so cancellation is handled at the studio level — refer to state-specific membership agreement addendum or contact local studio. Channels: email home studio, cancel via online account at purebarre.com, or in-person at studio. Most locations require 30 days notice. Contract memberships have early termination fees up to $100; month-to-month memberships typically have no fee with 30 days notice. Freeze available only "in certain exceptional cases — serious illness or injury" in writing at the Operations Manager's discretion.
- URLs:
  - https://help.purebarre.com/hc/en-us/articles/18438862694167-How-can-I-freeze-or-cancel-my-membership
  - https://www.purebarre.com/terms
- last_verified: 2026-04-15
- What to notice: the online cancel path on purebarre.com is the compliant surface; the "email home studio" alternative is franchise-era legacy. The freeze product is dramatically weaker than Orangetheory, Barry's, or Equinox — discretionary, exception-only, manager-approved — and is closer to no-pause-option than to a real pause product. A member with a routine 3-week travel situation has no freeze path. State-specific addenda mean different states literally have different cancellation contracts, which is how CARL-style state laws bite.

### F45 Training
- Pattern observed: Contract minimums vary per studio — 3-month month-to-month, 6-month with 14-day written cancel notice after minimum, 12-month with 14-day written cancel notice after minimum, "No-Lock" memberships cancellable with 21-day written notice. Early termination fees apply if cancelling before minimum-term completion. Pause and cancel both require contacting the home studio directly; no self-service universal portal. Per-studio agreement terms are the source of truth.
- URLs:
  - https://member-help.f45.com/support/solutions/articles/151000175893-how-do-i-cancel-or-pause-my-f45-membership-
  - https://f45training.com/faqs/
  - https://f45training.com/terms/
- last_verified: 2026-04-15
- What to notice: explicit commitment-term variance (3, 6, 12 months, or No-Lock) done relatively honestly — each tier is named, the notice period for each is stated, and the No-Lock option exists as the commitment-free alternative. The signup card must render per-studio contract terms from per-studio data; a brand-global "14 days notice" claim is wrong for most studios. Contact-your-home-studio is the pause/cancel channel, which is on the vulnerable side of the "same medium as signup" standard if signup happens online.

### ClassPass
- Pattern observed: Self-service pause available in app → Account Settings → Manage plan → Pause. Pause freezes credits; unused credits roll over on resume; auto-resumes onto previous plan with fresh credits. Self-service cancel: profile icon → Membership → scroll to bottom → Cancel Membership → may present pause-or-discount retention offer (declinable) → required survey → Confirm. Recommend submitting cancel 48 hours before renewal. Reservation-level (not plan-level) cancellation policy is separate and studio-dependent.
- URLs:
  - https://help.classpass.com/hc/en-us/articles/360040920251-Can-I-pause-my-ClassPass-membership
  - https://help.classpass.com/hc/en-us/articles/204578119-How-do-I-cancel-my-ClassPass-membership
  - https://pageflows.com/post/ios/cancelling-subscription/classpass/
- last_verified: 2026-04-15
- What to notice: pause and cancel are peer actions in the same Manage Plan surface — the correct fix for pause-and-cancel-conflated. The retention offer inside cancel is a single step with a clear decline, which sits at the boundary of cancel-retention-dark-patterns (acceptable ceiling, not a violation). The required survey before Confirm is the most-complained-about part of the flow and is the kind of friction click-to-cancel rules would target; making it skippable would be a defensible improvement.

### CorePower Yoga
- Pattern observed: Pause for up to 3 months available in-account via Dashboard → My Membership. Pause during pause period: no charge, no video access. Customer complaints (BBB) indicate ambiguity around 30-day billing during pause initiation and additional fees after 30 days. Cancellation policy is strict; refunds on purchased classes are limited to "as required by applicable law." Student terms are on the site but detailed cancel mechanics are not fully documented publicly.
- URLs:
  - https://www.corepoweryoga.com/content/help-center
  - https://www.corepoweryoga.com/content/student-terms-conditions
  - https://www.corepoweryoga.com/content/all-access-membership
- last_verified: 2026-04-15
- What to notice: self-service pause surface exists (good), but the BBB complaint pattern around billing ambiguity during pause is a textbook paused-state-ambiguous symptom — if members consistently misunderstand what they are paying during pause, the UI is not communicating state clearly. The fix is not a policy change but a clearer state badge plus an upcoming-charges preview on the Pause screen.

## Regulatory context (read this before design review)

- **FTC Click-to-Cancel rule (Negative Option Rule amendment)** — issued Oct 16, 2024; enforcement delayed to July 14, 2025; vacated by the Eighth Circuit on July 8, 2025 (Custom Communications v. FTC, procedural violations of the regulatory-analysis requirement, NOT substantive rejection). FTC has submitted a draft Advance Notice of Proposed Rulemaking (ANPRM) to re-run the rulemaking correctly; both Commissioners approved. The substantive principles — same-medium cancellation, simple mechanism, clear disclosure of material terms, no saved-consent for material changes — remain the direction of travel and the direction state AGs are moving under existing UDAP/negative-option authority.
  - https://www.ftc.gov/legal-library/browse/rules/negative-option-rule
  - https://www.federalregister.gov/documents/2024/11/15/2024-25534/negative-option-rule
  - last_verified: 2026-04-15
- **California Automatic Renewal Law (AB 2863)** — amended CARL signed September 24, 2024; effective July 1, 2025. Requires express affirmative consent to auto-renewal, cancel in "the same medium" as signup, phone lines answered promptly (voicemails or cancels processed within one business day), annual renewal reminders, and reminder notice when material terms change. Applies to free trials that convert to paid.
  - https://oag.ca.gov/news/press-releases/attorney-general-bonta-issues-consumer-alert-california%E2%80%99s-automatic-renewal-law
  - https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202120220AB390
  - last_verified: 2026-04-15
- **New York Attorney General settlement with Equinox Group (June 2025)** — $600,000 penalty plus restitution up to $250 per eligible complainant, against Equinox, SoulCycle, and Equinox+, specifically for failure to disclose subscription terms, failure to provide NY-required subscription acknowledgment, and failure to offer cost-effective easy-to-use online cancellation. Enforces NY's existing subscription laws regardless of FTC rule status.
  - https://ag.ny.gov/press-release/2025/attorney-general-james-secures-600000-fitness-company-equinox-its-hard-cancel
  - https://ag.ny.gov/sites/default/files/settlements-agreements/equinox-group-llc-assurance-of-discontinuance-2025.pdf
  - last_verified: 2026-04-15

The practical design implication: even with the federal rule vacated, the compliance floor for a fitness-subscription UX in 2026 is "cancel available online, in the same medium as signup, with an annual renewal reminder, with the material terms disclosed at signup." Studios that design below that floor are operating on state-by-state luck.

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — adapted from shadcn primitives, typecheck-clean in isolation.
// Adapt to target brand. Not CI-validated against any specific project.
// Shows: (1) signup card with commitment term disclosed inline, (2) account state UI with
// Pause and Cancel as peer actions, (3) cancel dialog with ONE retention offer and clear
// decline path, (4) paused-state badge with resume date + upcoming charges.

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Pause, XCircle, AlertCircle } from "lucide-react"

type MembershipTier = {
  id: string
  name: string              // "Unlimited"
  priceMonthlyUsd: number   // 175
  commitmentMonths: number  // 0 = month-to-month, 12 = annual lock
  earlyTerminationFeeUsd: number
  noticeDays: number        // 30
}

type MembershipState =
  | { kind: "active"; tier: MembershipTier; nextChargeDate: string }
  | { kind: "paused"; tier: MembershipTier; resumesOn: string; daysRemaining: number }
  | { kind: "pending_cancel"; tier: MembershipTier; endsOn: string }
  | { kind: "expired" }

export function SignupCard({ tier }: { tier: MembershipTier }) {
  const isMonthToMonth = tier.commitmentMonths === 0
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{tier.name}</CardTitle>
        <CardDescription>
          ${tier.priceMonthlyUsd}/mo · autopay ·{" "}
          {isMonthToMonth
            ? "month-to-month, cancel anytime with " + tier.noticeDays + " days notice"
            : tier.commitmentMonths + "-month commitment · $" +
              tier.earlyTerminationFeeUsd + " early-cancel fee"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Material terms disclosed BEFORE the signup button, not in a tooltip */}
        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
          <li>Renews automatically each month at ${tier.priceMonthlyUsd}</li>
          <li>You'll get an email 14 days before each renewal</li>
          <li>Pause up to 60 days/year without losing your rate</li>
          <li>Cancel online anytime — no phone call needed</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full">
          Join · ${tier.priceMonthlyUsd}/mo
        </Button>
      </CardFooter>
    </Card>
  )
}

export function MembershipStatusPanel({ state }: { state: MembershipState }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your membership</CardTitle>
          <StatusBadge state={state} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {state.kind === "active" ? (
          <p className="text-sm text-muted-foreground">
            {state.tier.name} · ${state.tier.priceMonthlyUsd}/mo · next charge{" "}
            <strong>{state.nextChargeDate}</strong>
          </p>
        ) : null}
        {state.kind === "paused" ? (
          <Alert>
            <Calendar className="h-4 w-4" />
            <AlertTitle>Paused until {state.resumesOn}</AlertTitle>
            <AlertDescription>
              {state.daysRemaining} days remaining · resumes automatically at $
              {state.tier.priceMonthlyUsd}/mo. No charges during pause.
            </AlertDescription>
          </Alert>
        ) : null}
        {state.kind === "pending_cancel" ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Cancelling on {state.endsOn}</AlertTitle>
            <AlertDescription>
              You keep full access through {state.endsOn}. Changed your mind?
              You can resume before that date.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
      {state.kind === "active" ? (
        <CardFooter className="flex flex-wrap gap-2">
          {/* Pause and Cancel are PEER actions. Same screen. Equal visual weight. */}
          <PauseDialog tier={state.tier} />
          <CancelDialog tier={state.tier} />
          <Button variant="outline">Change tier</Button>
        </CardFooter>
      ) : null}
    </Card>
  )
}

function StatusBadge({ state }: { state: MembershipState }) {
  if (state.kind === "active") return <Badge>Active</Badge>
  if (state.kind === "paused")
    return <Badge variant="secondary">Paused · resumes {state.resumesOn}</Badge>
  if (state.kind === "pending_cancel")
    return <Badge variant="destructive">Ending {state.endsOn}</Badge>
  return <Badge variant="outline">Expired</Badge>
}

function PauseDialog({ tier }: { tier: MembershipTier }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pause className="mr-2 h-4 w-4" /> Pause
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pause your {tier.name}</DialogTitle>
          <DialogDescription>
            Hold your spot. No charges during pause. Your rate stays locked at $
            {tier.priceMonthlyUsd}/mo when you resume.
          </DialogDescription>
        </DialogHeader>
        {/* Pause product terms, clearly stated, not buried */}
        <div className="rounded-md border bg-muted/40 p-3 text-sm space-y-1">
          <p>Choose a duration (up to 60 days, 2x per year):</p>
        </div>
        <DialogFooter>
          <Button variant="ghost">Cancel</Button>
          <Button>Pause for 30 days</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CancelDialog({ tier }: { tier: MembershipTier }) {
  const [step, setStep] = useState<"confirm" | "offer" | "done">("confirm")

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-muted-foreground">
          <XCircle className="mr-2 h-4 w-4" /> Cancel
        </Button>
      </DialogTrigger>
      <DialogContent>
        {step === "confirm" ? (
          <>
            <DialogHeader>
              <DialogTitle>Cancel your {tier.name}</DialogTitle>
              <DialogDescription>
                You'll keep full access until the end of your current billing
                period. No further charges after that.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep("offer")}>
                Continue
              </Button>
              <Button variant="ghost">Keep membership</Button>
            </DialogFooter>
          </>
        ) : null}
        {step === "offer" ? (
          <>
            {/* ONE retention offer, ONE step, clear decline. No more. */}
            <DialogHeader>
              <DialogTitle>Before you go — would a pause work?</DialogTitle>
              <DialogDescription>
                Pause up to 60 days instead. Your rate stays locked. No charges
                during pause.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button variant="ghost" onClick={() => setStep("done")}>
                No thanks, continue canceling
              </Button>
              <Button>Pause instead</Button>
            </DialogFooter>
          </>
        ) : null}
        {step === "done" ? (
          <>
            <DialogHeader>
              <DialogTitle>Membership cancelled</DialogTitle>
              <DialogDescription>
                You'll keep access through your current billing period. We sent
                a confirmation email.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Done</Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
```

Four things to notice in the snippet: (1) the signup card discloses commitment length, early-termination fee, and renewal reminder cadence inline — above the "Join" button, not in a tooltip or expander; (2) Pause and Cancel are peer actions on the same row with equal visual weight, neither pre-selected, neither hidden behind the other; (3) the cancel flow has exactly one retention offer (pause-instead) with a clear "No thanks, continue canceling" button of equal weight — not a grayed-out text link; (4) paused state shows resume date, days remaining, AND the rate that will resume, so the member never has to guess.

## Measurable checks

Prose heuristics a reviewer applies to the rendered pages. Pass/fail judgments.

### cancel_flow_clicks_match_signup_clicks
**Condition:** The number of discrete user actions (clicks/taps) required to complete a cancellation from an authenticated account is less than or equal to the number required to complete signup from the public landing. A signup that takes four taps (intro-offer → tier-select → card-entry → confirm) paired with a cancel that takes ten (account → billing → membership → manage → scroll → cancel → survey → retention-offer → decline → confirm) fails.
**Reasoning:** This is the core standard the FTC's (now-vacated, being-redrafted) Click-to-Cancel rule codified and that California's AB 2863 "same medium" requirement operationalizes. It is also the substance of the NY AG's 2025 Equinox finding. Equality of friction is the simplest articulation of the fairness contract and the most reviewer-legible check.

### pause_is_distinct_action_from_cancel
**Condition:** Pause and Cancel appear as separate, clearly-labeled actions in the account UI. Clicking Pause does not route through a cancel flow, clicking Cancel does not pre-select Pause. Each action's confirmation dialog discusses only its own consequences — a pause dialog does not say "you can also cancel," a cancel dialog may surface pause-as-retention but only once and with a visible decline path.
**Reasoning:** Pause holds the customer; cancel loses them. Treating them as the same action with different intensities is the `pause-and-cancel-conflated` anti-pattern and it produces wrong outcomes in both directions. ClassPass exposes them as peer actions; Equinox's freeze has a distinct URL, distinct fee, and distinct policy page from cancel. Peer-hood is the correct model.

### cancel_available_online_without_phone_call
**Condition:** A member signed up via the public website can complete cancellation via that same authenticated website, without being required to call a phone number, email a specific address, send certified mail, or visit a physical location. In-person and phone options MAY exist as alternatives; they must not be the sole mandatory channel.
**Reasoning:** California AB 2863 requires cancel "in the same medium" as signup, effective July 1, 2025. The 2025 NY AG settlement punished exactly this failure at Equinox. Even with the federal Click-to-Cancel rule vacated, the direction of state enforcement is unambiguous. Planet Fitness's in-person-or-certified-mail pattern is the canonical violation.

### renewal_notification_14_days_before
**Condition:** Autopay renewals trigger an email (or in-app notification if that was the signup channel) 14 days before the renewal date. The notification includes the current tier name, the current price, and a direct link to the cancel/pause surface. If the price is changing at this renewal, the change is called out explicitly; California AB 2863 requires a reminder when material terms change.
**Reasoning:** California's annual-reminder requirement plus the material-terms-change reminder requirement combine into a 14-day advance notice for any price change. Even when not legally mandated (non-CA customers on a steady-price plan), a 14-day reminder is the industry-trust floor — a member who is surprised by a charge is a member considering a chargeback. Silent renewals with price hikes are the most trust-destroying failure mode.

### commitment_term_disclosed_on_signup_card
**Condition:** If the membership has a commitment length (3-, 6-, 12-month lock, etc.) or an early-termination fee, those terms are visible on the signup card/page itself — in the same visual block as the price and the "Join" CTA. Fine-print-only disclosure (buried in terms of service, only in the post-signup email, only in an expandable FAQ) fails.
**Reasoning:** Commitment length is a material term second only to price. California's express-affirmative-consent standard post-AB 2863 requires material terms to be clear and conspicuous at the point of consent, not retrievable afterward. F45's per-studio contract variance does this honestly (3-, 6-, 12-month and No-Lock each named on the pricing card); an Unlimited tier that says "$175/mo" and hides the 12-month lock in the PDF fails.

### retention_offer_maximum_one_step
**Condition:** If the cancel flow surfaces a retention offer (pause, discount, tier change, free month), it appears at most once, with a clear-and-equal "No thanks, continue canceling" button on the same step. No retention modal behind another retention modal; no required-survey-before-cancel; no "are you sure?" chain five dialogs deep; no retention video the user has to watch.
**Reasoning:** One pause-suggestion is defensible — it serves the member who genuinely forgot pause was an option. Two or more is the `cancel-retention-dark-patterns` anti-pattern and functionally buries the cancel action. The vacated FTC rule and its successor both target "simple cancellation mechanism" — adding multiple retention gates is substantively the same violation as requiring a phone call, just dressed up as user-helpful.

### paused_member_ui_state_clear
**Condition:** Members whose membership is in the paused state see an unambiguous status badge — "Paused until [specific date]" with remaining days and the price that will resume. Labels like "Inactive," "Suspended," "Hold," or "Frozen" without a resume date fail. The paused state surface also exposes a Resume-now button and a Cancel-instead button — the member never has to guess what the membership is doing.
**Reasoning:** CorePower Yoga's BBB complaint pattern around pause-billing-ambiguity is the symptom. Ambiguous state erodes the exact trust the pause feature was designed to build. Equinox's pause surface states fee, max duration, and check-in consequences explicitly; that's the correct register for a paused member's dashboard too.

### tier_upgrade_downgrade_effective_date_disclosed
**Condition:** When a member changes tiers (upgrade to Unlimited, downgrade to 4-pack), the confirmation dialog shows the effective date of the change explicitly — "this change takes effect on your next billing date, Apr 29, 2026" or "this change takes effect immediately and we will prorate $X to your card today." No ambiguity about whether the new tier starts today or next month, no surprise mid-cycle prorations discovered post-charge.
**Reasoning:** Tier changes are the second most common account action after pause/cancel and the second most common source of billing surprises. The disclosure is cheap, the ambiguity is expensive. A studio that doesn't disclose effective date is designing a billing dispute into its own UX.

### price_on_renewal_matches_price_at_signup_or_is_announced
**Condition:** The price the member pays at renewal matches the price they signed up at, OR — if there has been a price change — it was announced via an explicit notification with at least 14 days notice (see `renewal_notification_14_days_before`). A silent rate increase from $175 to $199 fails.
**Reasoning:** California AB 2863's material-terms-change notification applies; industry trust-floor applies everywhere else. Grandfathered rates are a loyalty signal; silent hikes are a trust-destroying one. If the studio is raising rates, the grown-up move is to say so.

### commitment_term_enforcement_surfaced_at_cancel
**Condition:** If the member is inside a commitment period and attempts to cancel, the cancel dialog shows the remaining commitment months, the early-termination fee that applies, and the alternative of waiting until the commitment ends. The fee is not discovered at the billing level post-cancel.
**Reasoning:** Members inside a commitment period who try to cancel are the highest-stakes billing-surprise population. The commitment was disclosed at signup (per `commitment_term_disclosed_on_signup_card`); it must also be surfaced at cancel so the member can make an informed tradeoff (pay ETF and leave now, or wait it out and leave free). F45's documentation of 14- and 21-day notice periods post-minimum-term is the baseline; the cancel dialog should show those numbers.

## Cross-pattern notes

- **`intro-offer-funnel.md`** owns the pre-conversion experience; this pattern owns the steady-state autopay membership that the intro converts into. The handshake is `auto_renew_disclosed_preclicking_claim` in intro-offer-funnel — renewal terms disclosed at claim time — and `commitment_term_disclosed_on_signup_card` here — same terms disclosed on the signup surface after the intro. If the intro claim dialog says "converts to $175/mo on Apr 29" and the signup card later says "3-month commitment," the two surfaces contradict each other and the conversion fails at trust.
- **`pricing-tier-presentation.md`** governs the tier table shown on `/memberships`. This pattern governs what happens after a tier is selected and a card is captured. The tier card must carry the commitment-term disclosure (this pattern's check) in the same visual block as price (pricing-tier-presentation's layout). They are coupled.
- **`package-credits.md`** is a different product family — class packs, credit expiry, no recurring charge. A customer who holds both a recurring membership and a credit pack has two separate cancel/pause surfaces; the account page must not conflate them. A "Cancel membership" button that also voids unused credits is an own-goal; a "Pause membership" that silently freezes credit expiry dates is helpful if explained, hostile if silent.
- **`waitlist-cancellation.md`** is class-level cancellation (late-cancel fees, no-show fees for an individual reservation). This pattern is membership-level cancellation. The two must not be merged in copy: "Cancel" on a class card must never confuse a member into thinking they are cancelling their membership, and vice versa. Use "Cancel reservation" and "Cancel membership" as distinct labels across the product.
- **`multi-location-selection.md`** matters when cancel policies vary by studio (Pure Barre, Orangetheory franchise model, F45 per-studio contracts). The cancel surface must render per-studio terms from per-studio data — notice period, fee, contact method. A brand-global template lies to members at some studios.
- **`mobile-first-defaults.md`** applies globally. The account, pause, and cancel screens must be fully operable at 375px viewport with no horizontal scroll, no pinch-to-zoom, no mobile-hidden retention offers that desktop users also see. Material disclosures (commitment term, ETF, resume date, renewal price) must be visible without expansion on mobile — stuffing them into a "Show more" accordion on mobile while showing them inline on desktop is disparate disclosure and fails the same-medium principle by accident.
- **`kiosk-checkin.md`** is out of scope. Membership signup, pause, and cancel are account surfaces, never in-studio kiosk surfaces. A front-desk staffer processing a cancel on a member's behalf is a different flow (staff portal) and should not reuse the self-service UI.
