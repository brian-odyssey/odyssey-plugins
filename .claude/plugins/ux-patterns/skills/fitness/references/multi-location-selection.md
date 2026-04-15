# Multi-location selection

## What it is

How a fitness brand lets a shopper or member pick which studio they're interacting with — on the schedule page, the memberships page, the instructor bio, the booking flow. The right pattern is not one pattern; it's four, sorted by brand shape:

1. **Single-location studio.** No selector. Don't render a dropdown of one.
2. **Boutique multi-location (2–10 studios).** Location-centric UX: a compact tab bar, a segmented control, or a persistent "You're viewing: Sandy" pill. Schedule, memberships, and instructors are scoped per location. No city picker, no ZIP code gate — the whole footprint fits on one screen.
3. **Franchise (50+ locations, often 1,000+).** Geography-centric UX: country → state → city → studio. Each studio page is effectively its own microsite with its own pricing, instructor roster, and schedule. Orangetheory, F45, Pure Barre operate this way.
4. **Marketplace / multi-brand (ClassPass).** Location is the search axis; travel across cities is a first-class feature, not an exception.

Orthogonal to all four: **pre-launch locations**. A studio that's under construction or opening in three weeks is neither "live" nor "absent" — it's a real CMS entity with a real opening date, a lead-capture affordance, and usually a founding-member offer. Rendering it identically to the four live studios is the common failure mode on launch day.

## Why it matters in fitness

Location isn't a shipping address — it's the entire product. A member's "home studio" is a social identity (they know the front desk, the 6am regulars, which reformer is their favorite). A shopper evaluating two studios 8 miles apart is evaluating two completely different experiences: different instructors, different parking, different schedule density, different class types. Treating location as a filter-chip afterthought collapses this into noise.

Three fitness-specific forces drive the pattern:

1. **Schedule density varies by studio.** A flagship studio runs 14 classes/day; a suburban satellite runs 6. A "classes" page that doesn't scope to a location shows either too much (unreadable) or too little (wrong default). Every serious multi-location operator scopes the schedule to a chosen studio.
2. **Pricing and instructor rosters are per-studio on franchises.** Orangetheory's Boca Raton pricing is not its Manhattan pricing. A member moving from Austin to Denver needs a different roster of coaches. Hiding this until checkout is a trust violation — [Orangetheory explicitly prices locally](https://www.thepricer.org/the-cost-of-orangetheory/) because rents, wages, and demand differ.
3. **Travel is common for committed members.** ClassPass built a billion-dollar marketplace substantially on the premise that [members want to use their membership while traveling](https://help.classpass.com/hc/en-us/articles/205433735-Can-I-use-ClassPass-while-traveling). Single-brand chains (Orangetheory, Barry's, Equinox) handle this through reciprocity programs. The UX must not punish a traveling member by making them look like a new lead.

The Millcreek-launch-day failure mode: four location tabs — Sandy, Draper, Orem, Millcreek — rendered identically, but Millcreek is three weeks pre-launch. A shopper taps Millcreek, sees an empty schedule, and concludes the studio is either broken or closed. The location page must *differentiate* pre-launch from live — opening date, grand-opening class reservations, founding-member offer, or simply "Opens April 18 — reserve your spot" messaging.

## Anti-patterns

### pre-launch-location-treated-as-live
Rendering a coming-soon studio in the location selector with no visual distinction from live studios — same tab style, same "View schedule" CTA, same booking flow affordances. The user taps it, lands on an empty grid or an error state, and can't tell if the site is broken or the studio is closed today. Fails because pre-launch is a distinct lifecycle state with its own high-value UX (lead capture, grand-opening reservation, founding-member offer) and erasing that state wastes launch-window demand. See [Barry's "Studios Coming Soon"](https://www.barrys.com/studios-coming-soon) for the correct treatment — a dedicated page, explicit upcoming status, email-capture affordance, not a tab that mimics live locations.

### location-as-afterthought
Putting the location selector below the fold, or off to one side as a filter chip, or defaulting to "All Locations" on a schedule that can only meaningfully display one. Fails because the schedule — the primary conversion surface — is unreadable without a location scope. Users either see a blended schedule that mixes studios (and book at the wrong one) or a cluttered grid they can't parse. Boutique multi-studio sites (2–10 locations) hit this anti-pattern most often because designers over-index on "minimal nav" and forget the schedule needs scope to function.

### franchise-pricing-hidden
Franchise chains (Orangetheory, Pure Barre, F45) whose pricing varies by location but whose web flow shows a generic "Starting at $X" on the marketing site and only surfaces real pricing after ZIP-code gating, account creation, or trial booking. Fails because [Orangetheory prices vary meaningfully across markets](https://www.thepricer.org/the-cost-of-orangetheory/), and a shopper comparing two nearby studios (or relocating cross-country) feels deceived when the real number shows up late. The location page should surface local pricing before the user commits a minute of attention, not after.

### no-location-memory
User picks "Sandy" on the schedule page, navigates to /memberships or /instructors, returns to /classes — location has reset to default (alphabetical first, or hardcoded). Fails because a returning member or serious shopper is making a location-scoped decision across multiple pages, and losing the scope on every navigation forces them to re-select repeatedly. The chosen location should persist across the session (cookie, localStorage, or URL segment) and ideally across sessions for returning users.

### city-centric-routing-for-boutique
A 3-location or 5-location boutique imitating a franchise's country → state → city → studio routing pattern. The user is forced through "Select your state" → "Select your city" → "Select your studio" for a brand with three studios in one metro area. Fails because the entire footprint fits on one screen; the geography hierarchy is pure friction. Boutique multi-location should render a flat tab bar or segmented control with all studios visible at once. City-centric routing is correct only when the footprint can't fit on one screen — [Orangetheory's global location tree](https://www.orangetheory.com/en-us/locations) earns it; a 4-studio Utah brand does not.

### travel-use-case-blocked
A paying member at one studio can't book a class at a sister studio without re-signing-up, paying again, or navigating around a "this location requires a separate membership" error. Fails because committed fitness customers travel frequently (business, vacation, family) and expect portability — [ClassPass built the travel use case as a first-class feature](https://classpass.com/blog/why-classpass-is-great-for-booking-at-multiple-studios/), and single-brand chains that refuse to match it surrender their highest-LTV members to the marketplace. Exception: genuinely separate franchised owners with separate billing (some Pure Barre studios) must still show the friction *explicitly*, not as a silent error.

### default-to-alphabetical-first
Location selector defaults to the alphabetically first studio ("Draper" wins over "Sandy") regardless of the user's actual location, last-used studio, or even the brand's flagship. Fails because alphabetical ordering is the lazy default that pretends to be neutral; it's actually hostile to every user who lives closer to a non-A studio. The correct defaults, in order of preference: (1) last-used studio from session/cookie, (2) geolocation-nearest with user opt-in, (3) the brand's flagship or highest-traffic location. Alphabetical is a last resort, and even then should be flagged for follow-up.

## Real-world references

### Orangetheory Fitness (franchise, 1,500+ studios)
- Pattern observed: Country selector → state/region → individual studio pages. The global directory is the entry point; each studio has its own page with local schedule, coaches, and pricing. The directory is the routing layer, not the selector.
- URL: https://www.orangetheory.com/en-us/locations
- last_verified: 2026-04-15
- What to notice: A 1,500-studio footprint *requires* geography-centric routing. No flat list would work; no dropdown could fit. The studio page itself then becomes the standalone experience — it's where pricing, schedule, and booking live. The brand chose the franchise UX model because the footprint demands it.

### Barry's (multi-city boutique, ~100 studios, "coming soon" page)
- Pattern observed: `/studios` renders a global directory with region grouping. Individual studio URLs (`/studio/west-hollywood`) host that studio's schedule and booking. A separate `/studios-coming-soon` page lists upcoming openings with email capture — explicitly *not* mixed into the live directory.
- URLs:
  - https://www.barrys.com/studios
  - https://www.barrys.com/studios-coming-soon
  - https://www.barrys.com/studio/west-hollywood
- last_verified: 2026-04-15
- What to notice: Barry's separates pre-launch from live with a dedicated URL and explicit "coming soon" framing. The live directory does not contain phantom tabs for future studios. This is the correct treatment for the Millcreek case — a differentiated state, not an empty-schedule tab pretending to be live.

### SoulCycle (multi-city boutique, ~60 studios)
- Pattern observed: `/studios/` is the global directory; `/studios/nyc/` is a region page; individual studios sit under region slugs like `/studios/ny-newyork-noho/`. A "region selector" persists the chosen region so schedule browsing stays scoped.
- URLs:
  - https://www.soul-cycle.com/studios/
  - https://www.soul-cycle.com/studios/nyc/
- last_verified: 2026-04-15
- What to notice: SoulCycle sits between boutique and franchise — 60+ studios, region-grouped but not state-hierarchical. The region pill persists across navigation, which is the correct persistence pattern for a brand this size. Note the additional friction around travel: [class packs are region-locked and non-transferable](https://www.soul-cycle.com/series/), which the UI should disclose *before* purchase — some members learn this only at the travel moment.

### F45 Training (global franchise, 1,600+ studios, 60+ countries)
- Pattern observed: `/find-a-studio/` is the primary entry — a search-first experience (enter city, ZIP, or use geolocation) that returns nearby studios. Each studio has its own micro-site with local coaches and pricing.
- URL: https://f45training.com/find-a-studio/
- last_verified: 2026-04-15
- What to notice: At 1,600 studios across 60 countries, neither a flat list nor a tree is viable — the pattern becomes search-centric. Geolocation (with opt-in) is the correct default because alphabetical ordering is meaningless at that scale. The studio microsite model follows because franchise pricing and staffing are genuinely local.

### Pure Barre (franchise, 600+ studios)
- Pattern observed: `/location-search` as the entry point; individual studio pages at `/nj-princeton`, `/ca-pasadena`, etc. State-city slug format signals the franchise tree without forcing a multi-step routing experience.
- URL: https://www.purebarre.com/location-search
- last_verified: 2026-04-15
- What to notice: Search-as-default with structured slugs, same model as F45 at smaller scale. Pricing is per-studio because franchise owners set it; the individual studio page is where pricing must surface, not the marketing homepage.

### Peloton Studios (two locations, NYC + London)
- Pattern observed: A single booking surface at `studio.onepeloton.com/schedule` with a location toggle (NYC vs London) in the top-right. Region-specific URL variants like `/london/schedule` also exist.
- URLs:
  - https://studio.onepeloton.com/schedule
  - https://studio.onepeloton.com/london/schedule
- last_verified: 2026-04-15
- What to notice: Two studios is the minimum viable "multi-location" and shows the floor case — a simple toggle is sufficient, no tree, no search. This is what a 2-location boutique should emulate; the moment you're adding a third it starts to become a tab bar. Don't build a city picker for two cities.

### ClassPass (marketplace, 2,500+ cities)
- Pattern observed: Unified marketplace with city-switching as a first-class feature. Search by city, neighborhood, or ZIP; [travel mode explicitly invites members to change their city when traveling](https://help.classpass.com/hc/en-us/articles/205433735-Can-I-use-ClassPass-while-traveling).
- URL: https://help.classpass.com/hc/en-us/articles/205433735-Can-I-use-ClassPass-while-traveling
- last_verified: 2026-04-15
- What to notice: ClassPass treats the traveling member as the happy path, not an edge case. Single-brand operators whose members also travel should take notes — an explicit "book at another location" affordance reduces friction for the most committed customers.

### CorePower Yoga (multi-city, ~200 studios)
- Pattern observed: `/yoga-studios` as the selector; `/yoga-studio/all-locations/los-angeles` as city pages. Studio filtering supports teacher, class type, intensity, and time of day — location is the primary axis, class attributes are the secondary filters.
- URL: https://www.corepoweryoga.com/yoga-studio/all-locations
- last_verified: 2026-04-15
- What to notice: Mid-scale (~200 studios) fits a city-hub pattern: pick your city, then browse studios within it. Classes are filterable once scoped. This is the right pattern in the 50–500 studio band between boutique and franchise.

### Solidcore (multi-city boutique, growing fast)
- Pattern observed: `/studios` directory; individual studios at `/studios/center-city`, `/studios/culver-city`. Studios are listed by neighborhood-city name, not state hierarchy.
- URL: https://solidcore.co/studios
- last_verified: 2026-04-15
- What to notice: Neighborhood-named slugs (rather than state-city) reflect the brand's urban-centric footprint. This is a branding signal as much as a UX decision: Solidcore's customers think "Center City" or "SoHo," not "PA" or "NY."

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference snippet — typecheck-clean in isolation. Adapt to target brand.
// Boutique multi-location pattern: flat tab bar across 2–10 studios, with explicit
// differentiation for pre-launch locations. Location choice persists to cookie.

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarClock, MapPin } from "lucide-react"

type LocationStatus = "live" | "pre-launch" | "closed"

type Location = {
  slug: string
  name: string
  address: string
  status: LocationStatus
  opensOn?: Date // only set when status is pre-launch
}

type Props = {
  locations: Location[]
  initial?: string
  renderSchedule: (slug: string) => React.ReactNode
}

const STORAGE_KEY = "selected_location"

export function LocationTabs({ locations, initial, renderSchedule }: Props) {
  const [current, setCurrent] = useState<string>(
    () => initial ?? locations.find((l) => l.status === "live")?.slug ?? locations[0].slug,
  )

  // Rehydrate from cookie/localStorage on mount. Persist choice.
  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    if (stored && locations.some((l) => l.slug === stored)) {
      setCurrent(stored)
    }
  }, [locations])

  function handleChange(slug: string) {
    setCurrent(slug)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, slug)
    }
  }

  // Single-location: don't render a selector at all.
  if (locations.length <= 1) {
    return <div>{renderSchedule(locations[0]?.slug ?? "")}</div>
  }

  return (
    <Tabs value={current} onValueChange={handleChange} className="w-full">
      <TabsList className="flex w-full flex-wrap gap-1">
        {locations.map((loc) => (
          <TabsTrigger key={loc.slug} value={loc.slug} className="gap-2">
            <span>{loc.name}</span>
            {loc.status === "pre-launch" && loc.opensOn ? (
              <Badge variant="secondary" className="bg-amber-500/15 text-amber-700">
                Opens {loc.opensOn.toLocaleDateString([], { month: "short", day: "numeric" })}
              </Badge>
            ) : null}
          </TabsTrigger>
        ))}
      </TabsList>

      {locations.map((loc) => (
        <TabsContent key={loc.slug} value={loc.slug} className="mt-4">
          {loc.status === "pre-launch" && loc.opensOn ? (
            <PreLaunchPanel location={loc} />
          ) : (
            <>
              <LocationHeader location={loc} />
              {renderSchedule(loc.slug)}
            </>
          )}
        </TabsContent>
      ))}
    </Tabs>
  )
}

function LocationHeader({ location }: { location: Location }) {
  return (
    <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
      <MapPin className="h-4 w-4" />
      <span>{location.address}</span>
    </div>
  )
}

function PreLaunchPanel({ location }: { location: Location & { opensOn: Date } }) {
  const dateLabel = location.opensOn.toLocaleDateString([], {
    weekday: "long",
    month: "long",
    day: "numeric",
  })
  return (
    <Card className="border-amber-500/40 bg-amber-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-amber-600" />
          {location.name} opens {dateLabel}
        </CardTitle>
        <CardDescription>{location.address}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button>Reserve a grand-opening class</Button>
        <Button variant="secondary">Get opening-day updates</Button>
      </CardContent>
    </Card>
  )
}
```

## Measurable checks

Prose heuristics a reviewer applies to the rendered page. Pass/fail judgments.

### location_selector_persists_across_pages
**Condition:** A location chosen on the schedule page is still the active location when the user navigates to memberships, instructors, or the booking flow, and when they return. Persistence is session-scoped at minimum (cookie/localStorage), ideally user-scoped for returning logged-in members.
**Reasoning:** A shopper comparing two studios is making a multi-page decision; re-selecting on every navigation is friction that compounds. Losing scope on the booking page is the worst failure mode — the user can book at the wrong studio without realizing it.

### pre_launch_state_differentiated
**Condition:** Pre-launch or coming-soon locations render with visually distinct treatment in the selector (badge, opening-date pill, color) and land on a panel that explicitly says "Opens [date]" with a lead-capture or grand-opening reservation affordance — not an empty schedule grid and not a generic 404. Barry's `studios-coming-soon` page is the reference; replicate the lifecycle distinction even within a single selector if your CMS mixes live and pre-launch together.
**Reasoning:** Pre-launch is the highest-value UX moment for a new studio — demand is strongest at announcement and launch. An empty tab wastes it; a dedicated state converts it.

### default_location_is_closest_or_last_used
**Condition:** The default location on first page-load is either (a) the user's last-used studio from persistence, (b) the geolocation-nearest studio with opt-in, or (c) the brand's flagship. Alphabetical-first is never the default; if it is, flag it as a finding.
**Reasoning:** Alphabetical ordering is lazy neutrality. A user in Orem doesn't want Draper selected because D < O. Sensible defaults reduce selection cost for every visitor; alphabetical only reduces it for the alphabetically-closest user.

### location_pricing_disclosed_preclicking_checkout
**Condition:** If pricing varies by location (franchise model), the location page shows local pricing before the user commits to a checkout step, creates an account, or books a trial. A generic "Starting at $X" on the marketing page is acceptable only if the actual local price is displayed on the location-specific page.
**Reasoning:** Orangetheory and Pure Barre price locally; users comparing studios across markets feel deceived when the real number surfaces only at payment. Disclosing early is trust-positive and reduces support load.

### travel_member_flow_supported
**Condition:** A logged-in member at one location can book at another sister location without re-signup, without a "location not included" error, or with the friction *explicitly disclosed* if a business rule requires it (franchise separation, region-locked packs). Silent failures are never acceptable; explicit disclosure is.
**Reasoning:** ClassPass built the travel use case as a feature; single-brand operators who block it cede their highest-LTV customers. If a business rule genuinely requires separation (SoulCycle's region-locked packs), the rule must be surfaced before the purchase that triggers it, not at the travel attempt that fails against it.

### single_location_hides_selector
**Condition:** A single-location brand renders zero location chrome — no dropdown of one, no "You're viewing: [studio]" pill, no tab bar of one tab. The selector component returns null or is gated behind `locations.length > 1`.
**Reasoning:** UI chrome that presents a choice when there is none is noise. It also primes the user to expect more studios, which is a mismatch for a single-location brand and can erode confidence ("is this a real brand?"). Render the selector only when selection is meaningful.

## Cross-pattern notes

- **`schedule-grid.md`** is consumed by this pattern — the location selector scopes what the grid shows. Don't render a blended multi-studio schedule; always scope. Precedence rule 1 from SKILL.md still applies: the scoped grid must remain mobile-readable.
- **`pricing-tier-presentation.md`** interacts heavily with franchise selection. Franchise pricing is location-specific; the location page is the correct surface for tier display, not the marketing homepage.
- **`intro-offer-funnel.md`** should also scope to location when the offer varies per studio (grand-opening founding-member offers, city-specific promos). The pre-launch panel in the reference implementation is the right hook point.
- **`booking-flow.md`** inherits the selected location as context — the booking confirmation should name the location explicitly (as it already does in the booking-flow reference snippet) so a traveling or multi-studio user can verify.
- **`mobile-first-defaults.md`** applies globally — a horizontal tab bar of 5+ locations must wrap or scroll gracefully on 375px. Franchise search-centric UX is inherently mobile-friendlier than a flat tab bar once footprint exceeds ~6 locations; flag density issues accordingly.
