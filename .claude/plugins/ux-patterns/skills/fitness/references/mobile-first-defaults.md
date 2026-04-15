# Mobile-first defaults

## What it is

The baseline posture that every fitness surface — schedule grid, class detail, booking confirmation, membership page, instructor bio — is designed for a phone first and enlarged to desktop second, not the other way around. Concretely this means: tap targets sized for a thumb (44px minimum, 48-56px preferred), primary actions docked in the bottom-third thumb zone, information stacked vertically rather than gridded horizontally, no interactions that require hover, input fields at 16px+ body size to avoid iOS zoom-on-focus, sticky Book CTAs on class detail pages so the primary action is always one tap away, and a tolerance for flaky cellular networks and mid-booking WiFi handoffs. "Open in app" banners, if present, are dismissable in one tap and never block mobile-web functionality.

## Why it matters in fitness

The fitness user is almost never sitting at a desk when they book. They are on a couch at 10pm scheduling tomorrow, in a locker room rebooking after class, in a car between meetings scanning the 6pm schedule, or walking up to the front door deciding whether to waitlist. Industry data tilts heavily mobile: boutique studios routinely see 70-85% of bookings originate on a phone, and even desktop-originated sessions typically end on mobile (the user picks the class at work, commits on the train). A fitness site designed desktop-first ships with the conversion surface sized wrong, placed wrong, and broken in exactly the contexts that matter most.

There is a second force specific to fitness: physical interruption. The user is often holding a coffee, a kid, a car door, or a gym bag. One-handed thumb taps with sweaty fingers are the default input modality, not the edge case. A 32px "Book" button that works fine for a mouse cursor misses half the time for a right-handed thumb on a 6.1-inch phone, and that miss rate compounds across the weekly schedule-rebook ritual that drives studio revenue. The Apple Human Interface Guidelines hard floor of 44×44 points is not a design suggestion here — it is the difference between a user who books and a user who rage-quits to call the studio.

Precedence from SKILL.md makes this pattern load-bearing: mobile-first beats schedule-grid density. A weekly matrix that reads cleanly on a 1440px desktop but forces horizontal scroll at 375px is always the wrong answer — even when the desktop version is the "signature" view.

## Anti-patterns

### desktop-first-with-mobile-patch
The site was designed desktop-first and mobile is a shrunk-and-cropped version: the navigation collapses into a hamburger that hides the schedule link, the instructor bio drops its photo because "no room," the weekly grid turns into a horizontal-scroll table. The mobile experience is strictly worse than desktop — less info, more taps, harder to read — which inverts real fitness traffic (mobile is the majority; desktop is the edge case). A user who reads a bio on her laptop and comes back on her phone cannot find the same bio.

### tiny-tap-targets
CTAs sized for a mouse cursor — 32-40px buttons, 28-32px icon buttons, schedule cells that are 60px wide on mobile. Falls below Apple's 44-point floor and is measurably unhittable one-handed. Fitness users are thumb-tapping with sweaty fingers while standing, often one-handed. A 36px Book button misses 15-25% of the time in that context; the user blames themselves, then blames the studio, then switches to calling the front desk — which is a conversion cost, a CS cost, and a trust cost in one.

### top-heavy-cta-placement
Primary conversion CTA (Book, Reserve, Join Now, Waitlist) sits at the top of the page because that was the desktop hero position, and on mobile it is above a fold of hero copy the user has to scroll past to re-reach the button after reading the class details. The thumb-reachable zone is the bottom-third of a phone viewport; top-anchored CTAs require a round-trip scroll every time the user finishes reading. On class detail pages in particular, the primary Book action should be sticky to the bottom or duplicated there.

### hide-content-behind-hover
Schedule cells reveal instructor photo, class description, or capacity only on hover. Hover does not exist on touch — mobile users see an inert row with no affordance. Any critical information gated behind `:hover` is invisible to the majority of traffic. This often appears as "just a polish" on desktop and silently degrades every mobile booking decision.

### horizontal-scroll-for-week-grid
A 7-column weekly matrix rendered as a horizontally scrolling table on mobile. Users lose orientation (which column is today?), horizontal scroll conflicts with native browser gestures, and the day label detaches from the class data when scrolled. This is the archetypal case the SKILL.md precedence rule targets — collapse to daily list on mobile, not horizontal scroll.

### app-wall-without-web-path
Mobile web shows a full-screen "Open in our app" interstitial (or a non-dismissable sticky banner) that blocks the schedule, class details, or booking flow unless the user installs the native app. Fitness users standing outside a studio at 6:55am will not install an app to book a 7am class — they will call the studio or leave. A smart-app-banner that offers the app as an option while keeping the mobile-web path fully functional is fine; a wall is a conversion guillotine.

### sub-16px-input-body
Login, search, or signup inputs rendered at 14px or smaller. On iOS Safari, inputs below 16px trigger auto-zoom on focus and the page does not auto-zoom back out — leaving the user in a half-zoomed broken viewport mid-booking. This is a well-documented iOS behavior and fixing it is a one-line CSS change; shipping sub-16px inputs to a mobile-heavy audience is a self-inflicted wound.

## Real-world references

### Barry's
- Pattern observed: Barry's mobile schedule is a vertical stack of class rows with per-row Reserve/Waitlist CTAs, not a horizontally scrolling weekly grid. The schedule loads at a location-scoped URL (`/schedule/nashville/`, `/schedule/west-hollywood/`) so a user deep-linking from SMS or a calendar event lands in the right studio's context, not on a national default.
- URL: https://www.barrys.com/schedule
- last_verified: 2026-04-15
- What to notice: the schedule page is mobile-first in structure (vertical row stack, one CTA per row) even when rendered on a desktop. There is no desktop-only dense grid that collapses badly at 375px — the desktop view is a wider version of the mobile view, not a different layout. This is the inverse of desktop-first-with-mobile-patch.

### SoulCycle
- Pattern observed: SoulCycle's studio schedule page (`/find-a-class/studio/<id>/`) renders each class as a full-width row with studio code, time, instructor, and a primary action button (Reserve or Waitlist) sized for thumbs. Day tabs scroll horizontally at the top of the grid but the class rows themselves are a vertical list, not a matrix.
- URL: https://www.soul-cycle.com/find-a-class/studio/16/
- last_verified: 2026-04-15
- What to notice: horizontal scroll is confined to the day picker (a small, well-understood pattern) and never to the class list. The instructor name is always visible, not hover-revealed. Waitlist and Reserve are co-equal-weight CTAs on the row, so the tap target stays consistent between open and full states.

### ClassPass
- Pattern observed: ClassPass's mobile-web studio schedule is a single-column list of classes with credit cost inline on each row and a prominent primary Reserve button. The reservation flow is two deliberate taps (Reserve → Confirm) specifically to protect against accidental credit burns — the commit dialog is mobile-native (full-width bottom sheet on narrow viewports).
- URL: https://help.classpass.com/hc/en-us/articles/204335689-How-do-I-make-a-reservation
- last_verified: 2026-04-15
- What to notice: the commit dialog is a bottom sheet on mobile rather than a center-screen modal. Bottom sheets land inside the thumb zone, which is the right place for a credit-spend confirmation that the user must actually read before tapping.

### Peloton Studios
- Pattern observed: Peloton moved in-person studio booking to a dedicated subdomain (`studio.onepeloton.com`) separate from the on-demand streaming app, and the 2024 redesign removed the virtual queue + pre-purchased-credit model so users can book pay-as-you-go without preloading the app. Booking is mobile-web-first — the studio booking site is optimized for a phone reservation taken minutes before commuting to the class.
- URL: https://studio.onepeloton.com/
- last_verified: 2026-04-15
- What to notice: the studio booking flow is its own web surface, not hidden behind the native streaming app. Peloton's streaming product is app-first by necessity (video playback), but the in-studio booking flow is correctly identified as a different job that demands mobile web. Conflating the two would force a user to install a 500MB app to reserve a 45-minute class.

### Solidcore
- Pattern observed: Solidcore pushes booking into the native app (iOS and Android) with a consistent "Book" / "Waitlist" CTA pattern per class row. User-reported friction (App Store reviews, solidcore's own blog on waitlist tips) centers on clunky in-app navigation — the cautionary tale is that even when the app is the primary channel, the mobile-web fallback must remain viable for users who don't install.
- URL: https://apps.apple.com/us/app/solidcore/id1452460311
- last_verified: 2026-04-15
- What to notice: relying on the app exclusively creates a wedge with new prospects who have not committed enough to install. Solidcore's own FAQ documents the waitlist as a system users actively engage with through the app; the best-in-class version would mirror this on mobile web so intro-offer traffic lands on a functional booking surface without an install gate.

### CorePower Yoga
- Pattern observed: CorePower's mobile app landing page (`/content/mobile-app`, `/content/app-download`) is direct about the app being the primary booking channel, but `/yoga-schedules` on the web still works — users can see schedules without installing, with App Store / Play Store links surfaced as options, not walls.
- URL: https://www.corepoweryoga.com/yoga-schedules
- last_verified: 2026-04-15
- What to notice: the "better in the app" messaging is present without blocking mobile-web functionality. A user can complete a schedule-checking job on mobile web; the app is pitched as an upgrade, not a prerequisite. This is the app-banner pattern done non-hostile.

### Orangetheory
- Pattern observed: Orangetheory removed web booking entirely — the 30-day schedule lives only in the mobile app. This works because Orangetheory's audience is ~95% existing members who have already installed the app; removing web booking for a studio with an active intro-offer funnel would strand every cold-traffic prospect.
- URL: https://www.orangetheory.com/en-us/app-faq
- last_verified: 2026-04-15
- What to notice: "mobile-first" taken to its limit can mean "mobile-app-only" — but only for a specific audience profile. Cautionary reference: do not copy this pattern without the member-heavy traffic mix that justifies it.

### Apple Human Interface Guidelines
- Pattern observed: Apple's HIG specifies a minimum tap target of 44×44 points across iOS, iPadOS, and watchOS, grounded in the average fingertip contact area. Controls below this threshold have measurably higher mis-tap rates.
- URL: https://developer.apple.com/design/human-interface-guidelines/accessibility
- last_verified: 2026-04-15
- What to notice: 44pt is a floor, not a target. Fitness contexts (one-handed, sweaty, in-motion) warrant 48-56pt for primary actions. WCAG 2.5.5 Level AAA lands at 44px CSS as a parallel target; meeting either standard also satisfies the other in practice.

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — mobile-first by construction. Tailwind base classes target
// mobile; sm:/md:/lg: modifiers enlarge for tablet and desktop. Typecheck-clean in isolation.

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { X, Smartphone } from "lucide-react"

type ClassDetail = {
  id: string
  title: string
  instructor: string
  startsAt: string
  durationMin: number
  location: string
  description: string
}

export function ClassDetailMobileFirst({ cls, onReserve }: { cls: ClassDetail; onReserve: () => Promise<void> }) {
  const [bannerOpen, setBannerOpen] = React.useState(true)
  const [sheetOpen, setSheetOpen] = React.useState(false)

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      {/* Dismissable smart-app-banner — never blocks content, one-tap dismiss */}
      {bannerOpen ? (
        <div
          role="region"
          aria-label="Open in app"
          className="flex items-center justify-between gap-3 bg-muted px-4 py-2 text-sm"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
            <span className="truncate">Faster booking in the app</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="link" size="sm" className="h-11 px-2" asChild>
              <a href="https://apps.apple.com/us/app/placeholder/id0">Open</a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11"
              onClick={() => setBannerOpen(false)}
              aria-label="Dismiss app banner"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* Content — vertically stacked on mobile, two-column on md+ */}
      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:gap-10">
          <section className="flex-1 min-w-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">{cls.title}</CardTitle>
                <CardDescription className="text-base">
                  {cls.instructor} · {cls.startsAt} · {cls.durationMin} min · {cls.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* 16px body min — avoids iOS zoom-on-focus + aging-demo readability */}
                <p className="text-base leading-relaxed">{cls.description}</p>
              </CardContent>
            </Card>
          </section>

          {/* Desktop inline CTA — visible md+ only; mobile uses the sticky bottom bar */}
          <aside className="hidden md:flex md:w-64 md:flex-col md:gap-3">
            <Button size="lg" className="min-h-12 text-base" onClick={onReserve}>
              Reserve
            </Button>
            <p className="text-sm text-muted-foreground">
              Cancel 12+ hours before class to avoid the late-cancel fee.
            </p>
          </aside>
        </div>
      </main>

      {/* Sticky bottom Book CTA — mobile only. Sits in the right-thumb zone. */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur md:hidden">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{cls.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {cls.startsAt} · {cls.location}
            </p>
          </div>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              {/* min-h-12 = 48px; wider than Apple 44pt floor, fitness-appropriate */}
              <Button size="lg" className="min-h-12 min-w-28 text-base font-semibold">
                Reserve
              </Button>
            </SheetTrigger>
            {/* Bottom sheet lands in the thumb zone — confirm dialog next to the thumb, not at the top */}
            <SheetContent side="bottom" className="rounded-t-xl">
              <SheetHeader>
                <SheetTitle>Confirm reservation</SheetTitle>
                <SheetDescription className="text-base">
                  {cls.instructor} · {cls.startsAt} · {cls.location}
                </SheetDescription>
              </SheetHeader>
              <SheetFooter className="mt-6 flex-col gap-2 sm:flex-col">
                <Button
                  size="lg"
                  className="min-h-12 w-full text-base"
                  onClick={async () => {
                    await onReserve()
                    setSheetOpen(false)
                  }}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="min-h-12 w-full text-base"
                  onClick={() => setSheetOpen(false)}
                >
                  Back
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
```

Notes on the reference:
- Base classes are mobile-sized; `sm:` / `md:` modifiers enlarge for wider viewports. This is Tailwind's mobile-first modifier convention, not a desktop-first pattern with mobile overrides.
- Sticky bottom bar (`fixed inset-x-0 bottom-0 ... md:hidden`) is mobile-only. On desktop, the inline CTA in the aside takes over. The sticky bar sits in the right-thumb zone of a phone.
- `min-h-12` (48px) on all interactive controls — above Apple's 44pt floor, tuned for fitness use.
- `text-base` (16px) on body copy and inputs prevents iOS Safari zoom-on-focus.
- The "open in app" banner is a dismissable region, never a modal wall, and its dismiss button is itself a 44×44pt target.
- Confirm uses a bottom Sheet rather than a center-screen Dialog on mobile — bottom sheets land natively in the thumb zone.
- `pb-24` on the page root reserves space for the sticky bar so final content isn't occluded.

## Measurable checks

Prose heuristics a reviewer applies to the rendered page. Pass/fail judgments.

### primary_tap_target_min_44px
**Condition:** Every primary interactive element — Book, Reserve, Waitlist, Cancel, day-picker tab, schedule-row CTA, mobile nav item, form submit — has a minimum tap target of 44×44px. 48-56px preferred for the single highest-weight action on a page.
**Reasoning:** Apple HIG floor and WCAG 2.5.5 AAA. Below 44px, one-handed thumb mis-tap rates climb sharply; fitness contexts (sweaty, in-motion, one-handed) amplify the cost. The floor is cheap to hit and expensive to violate.

### primary_cta_in_thumb_zone_on_mobile
**Condition:** On class detail, booking confirmation, and single-class pages, the primary Book/Reserve CTA is reachable by a right-handed thumb in one-handed grip — bottom-third of the viewport, anchored sticky to the bottom or duplicated there. A CTA that requires scrolling back to the top of the page to act fails this check.
**Reasoning:** Thumb-zone ergonomics are empirical (LukeW, Steven Hoober) — the bottom-third of a phone viewport is the only region reliably reachable one-handed on a 6.1"+ phone. Fitness users are often one-handed (coffee, keys, gym bag) and top-anchored CTAs produce a scroll-round-trip on every booking.

### schedule_stacks_vertically_on_mobile
**Condition:** At viewport widths ≤640px, the schedule renders as a single-column vertical list of class rows, not a 7-column weekly matrix that horizontally scrolls. Day navigation may scroll horizontally (a well-understood pattern) but class content does not.
**Reasoning:** Delegates to `schedule-grid.md` for layout specifics. The SKILL.md precedence rule ("mobile-first beats schedule-grid density") makes this the load-bearing check when those two patterns' desktop instincts conflict with mobile reality.

### no_hover_dependent_affordances
**Condition:** All interactive affordances and critical information are reachable via tap alone. No instructor photo, class description, capacity badge, or action button is gated behind `:hover` without a corresponding tap-accessible path (either always-visible or tap-to-reveal).
**Reasoning:** Hover does not exist on touch devices. Any `:hover`-only information is invisible to ~70-85% of fitness traffic. Generic design reviewers often miss this because they review on desktop with a mouse.

### mobile_typography_min_16px_body
**Condition:** Body copy, form inputs (email, password, search, phone, birthday), and any text the user reads to make a booking decision is at least 16px (`text-base`) on mobile. Metadata (timestamps, legal fine print) may be 14px; primary reading content and inputs must be 16px+.
**Reasoning:** iOS Safari auto-zooms inputs below 16px on focus and does not auto-zoom back out — a documented viewport-breaking failure mode. Independently, boutique fitness demographics skew older than generic SaaS (30-55 is the heavy booking cohort); 14px body copy measurably hurts readability and trust for this group.

### app_banner_dismissable_or_absent
**Condition:** If an "Open in app" / "Get our app" banner appears on mobile web, it is (a) dismissable in one tap, (b) occupies less than ~15% of the viewport height, and (c) leaves all mobile-web functionality (schedule, class detail, booking, membership) fully usable after dismissal. A full-screen interstitial, a non-dismissable sticky banner, or a banner that blocks scroll fails.
**Reasoning:** Users standing outside a studio at 6:55am will not install a native app to book a 7am class. An app-wall converts captured mobile-web traffic into abandonment. A dismissable smart-banner is fine; the hostile variants are pure conversion loss.

### sticky_book_cta_on_class_detail
**Condition:** Class detail pages have a persistent Book/Reserve CTA anchored to the bottom of the viewport on mobile (sticky or fixed, always visible as the user scrolls). The CTA does not require scrolling back to the top to reach.
**Reasoning:** Class detail pages often contain instructor bio, class description, cancellation policy, and other content the user reads before committing. A top-only CTA forces a scroll round-trip at the highest-intent moment. Sticky bottom placement lands the action in the thumb zone and eliminates the round-trip.

### network_forgiveness_on_booking
**Condition:** The booking flow tolerates cellular flakiness — a Reserve tap shows an optimistic or loading state within 200ms, a timeout is retried once with a visible retry affordance, and a failed commit surfaces a clear error with the exact class still selected (no state loss). A booking flow that silently fails, requires form re-entry, or leaves the user uncertain whether they're booked fails.
**Reasoning:** Fitness users transition between cellular, studio WiFi, and parking-lot dead zones mid-booking. Naive fetch-without-timeout designs strand users in spinner purgatory; silent failure modes produce duplicate taps (and duplicate bookings). The commit dialog is the worst place for flaky-network behavior — it interacts directly with the late-cancel fee contract.

### deep_link_preserves_context
**Condition:** URLs for specific schedule views, class detail pages, and studio locations are shareable and survive a round-trip through SMS, email, calendar app, or a login redirect. Opening `https://studio.example/schedule/sandy?day=sat` lands on Sandy's Saturday schedule, not a generic national homepage. Opening a class detail URL after login lands back on that same class, not a generic dashboard.
**Reasoning:** Fitness traffic routinely bounces through SMS ("join me at this class: <link>"), calendar deep-links, and auth redirects. Dropped context forces the user to re-navigate, often fails (they can't remember which 6pm class), and is a silent conversion killer. Location-scoped URLs (Barry's `/schedule/nashville/`) are the positive pattern.

## Cross-pattern notes

- **Global precedence.** `mobile-first-defaults.md` applies across every other pattern in the skill. Precedence rule 1 from SKILL.md ("mobile-first beats schedule-grid density") is an explicit call-out; the same posture applies implicitly to booking-flow, capacity-signal, waitlist-cancellation, instructor-affinity, pricing-tier-presentation, and intro-offer-funnel. If a desktop instinct from any other pattern conflicts with a mobile constraint from this one, mobile wins.
- **`schedule-grid.md`** owns the vertical-list-vs-weekly-matrix choice on the schedule page. This pattern's `schedule_stacks_vertically_on_mobile` check delegates to that reference for specifics (day labels, time display, capacity delegate).
- **`booking-flow.md`** owns the tap-count budget (two taps to confirm) and the confirmation state. This pattern requires the primary Book CTA in that flow to sit in the thumb zone and the confirm step to prefer a bottom sheet over a center-screen modal on mobile.
- **`capacity-signal.md`** governs per-row scarcity language. This pattern requires that signal to remain legible at 375px and that urgency treatments (color, weight) never depend on hover.
- **`kiosk-checkin.md`** is explicitly different — kiosks are in-studio touch devices with their own tap-target and layout rules (larger still, no network assumptions, no auth). Do not conflate kiosk with mobile web; precedence rule 5 from SKILL.md prevents the mixup.
- **`intro-offer-funnel.md`** interacts at the first-visit moment — a mobile-web visitor hitting `/join` should see the intro offer surfaced above the fold without app-install friction. App-wall behavior on the intro-offer page is a double conversion loss.
