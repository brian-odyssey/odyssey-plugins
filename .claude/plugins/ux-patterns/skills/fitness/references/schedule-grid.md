# Schedule grid patterns

## What it is

The schedule grid is the page where a user decides "what class am I taking, where, and when." It merges four dimensions at once — day, time, class type, instructor — and is typically scoped by a fifth (studio location). Because every booking flow eventually funnels through this page, the grid's structure is the single highest-leverage UX choice on a fitness site: a legible grid converts browsers into reservations, while a dense or disoriented grid quietly redirects traffic to the phone number or to a competitor.

## Why it matters in fitness

Schedule is the most-visited page on a fitness site, period. Regulars hit it daily to book their standing 6am class; drop-ins hit it once to scan for a time that works; intro-offer shoppers hit it before buying anything to confirm the studio actually has a class they can attend. Mobile traffic dominates — users are checking the schedule from a locker room, a car, or bed at 10pm. That makes the grid a mobile-first problem masquerading as a desktop-style calendar.

Fitness buyers also navigate by day-of-week rhythm, not by numeric date. "Saturday morning" is a plan; "April 18" is a puzzle. Multi-studio brands amplify this — a Sandy regular checking the schedule from her phone must not land on Draper's grid by default. Every wrong-location booking is a refund, a CS ticket, and a class someone else could have taken. The grid has to resolve "who am I, where am I, what day is it" in the first viewport or it loses the booking.

## Anti-patterns

### desktop-grid-on-mobile
A 7-column weekly grid that renders as a horizontally scrolling matrix on a 375px viewport. Column widths collapse to ~50px, time labels wrap onto three lines, and the CTA button disappears below the fold. Common in franchise sites built from a desktop mock and resized naively. If the user has to pinch-zoom to read a class time, the grid has already failed.

### no-today-shortcut
The day picker shows only numeric dates ("13, 14, 15, 16…") with no "Today" or "Tomorrow" label. User has to calculate today's date, find the matching tab, and hope the default selection is correct. This is friction on a decision that should be a single tap — the two most-booked days on any fitness site are today and tomorrow.

### location-as-afterthought
Multi-studio brand defaults to one location without a visible switcher, or buries the switcher below the schedule. User scrolls, picks a class, taps Book, and only then realizes they booked at the wrong studio. Especially bad for franchises where regional subpages all share a template — the URL says Nashville but nothing above the fold confirms it.

### week-only-no-daily
Schedule shows a week-at-a-glance matrix with every class for every day visible simultaneously. Works for regulars who know their class and just want to scan availability, but fails intro-offer shoppers and drop-ins who want to see the full roster for a single day without visual competition from six other days of data.

### time-without-duration
Class row shows a start time (6:00 AM) with no duration or end time. User can't plan their morning around the class. Pilates/Lagree/HIIT classes range from 40 to 60 minutes depending on format — the difference matters for childcare pickup, the next meeting, or the commute back to the office.

## Real-world references

### SoulCycle
- Pattern observed: weekly day tabs with numeric dates, location explicit at top with studio code + region dropdown, row-level room/class-type/instructor/action granularity.
- URL: https://www.soul-cycle.com/find-a-class/studio/20/
- last_verified: 2026-04-15
- What to notice: location-first structure, room-level granularity, differentiated class-type labels ("SoulCycle" vs "Soul + Strength"). What to avoid copying: no "Today"/"Tomorrow" labels — the numeric-only tabs violate `no-today-shortcut`.

### Barry's
- Pattern observed: location-scoped schedule URLs (`/schedule/nashville/`, `/schedule/west-hollywood/`), reservation window opens T-7 days so the day picker only surfaces bookable days.
- URL: https://www.barrys.com/schedule/nashville/
- last_verified: 2026-04-15
- What to notice: location as URL primitive (clean shareability, no wrong-location confusion). When reservation windows are short, the schedule grid should visually communicate that — don't render greyed-out future weeks the user can't act on yet.

### Solidcore
- Pattern observed: in-app schedule with per-row "off-peak" attribute badges that surface price/time tradeoffs inline; monthly schedule release cadence on the 24th.
- URL: https://solidcore.co/faqs
- last_verified: 2026-04-15
- What to notice: per-row attribute badges beat hiding the detail in a modal. If your studio has peak/off-peak pricing, tagging rows on the grid itself is the right shape.

### CorePower Yoga
- Pattern observed: every schedule view routed through an explicit `centerId` query param so the grid is always studio-scoped; users must pick a location before seeing any grid.
- URL: https://www.corepoweryoga.com/yoga-schedules/studio?centerId=39522e2f-90d3-49e1-9ba0-9ae566580c69
- last_verified: 2026-04-15
- What to notice: no "default studio" guessing — eliminates the `location-as-afterthought` failure mode for multi-studio brands where geolocation is unreliable.

### Orangetheory
- Pattern observed: class booking removed from the website entirely; 30-day schedule is only in the mobile app, booking window opens 29 days from current date.
- URL: https://www.orangetheory.com/en-us/app-faq
- last_verified: 2026-04-15
- What to notice: a legitimate design choice for a franchise with a 95%-existing-member base. Cautionary note: for a studio with an active intro-offer funnel, removing the web schedule would strand every prospective first-timer.

## Reference implementation (shadcn + Tailwind)

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClassRow = {
  id: string;
  startTime: string;      // "8:00 AM"
  endTime: string;        // "8:50 AM"
  classType: string;      // "Classic 50"
  instructor: string;     // "Tennille Boseman"
  capacityLabel: string;  // delegated to capacity-signal.md
  action: "book" | "waitlist" | "full";
};

type Day = {
  key: string;            // "today", "tomorrow", "sat-apr-18"
  label: string;          // "Today", "Tomorrow", "Sat, Apr 18"
  classes: ClassRow[];
};

export function ScheduleGrid({
  locations,
  selectedLocation,
  onLocationChange,
  days,
}: {
  locations: { slug: string; name: string }[];
  selectedLocation: string;
  onLocationChange: (slug: string) => void;
  days: Day[];
}) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto px-4">
      {/* Location switcher — top of the schedule area, never buried */}
      <Select value={selectedLocation} onValueChange={onLocationChange}>
        <SelectTrigger className="w-full h-12" aria-label="Studio location">
          <SelectValue placeholder="Choose a studio" />
        </SelectTrigger>
        <SelectContent>
          {locations.map((loc) => (
            <SelectItem key={loc.slug} value={loc.slug}>
              {loc.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Day tabs — scrollable horizontally on narrow viewports */}
      <Tabs defaultValue={days[0]?.key}>
        <ScrollArea className="w-full whitespace-nowrap">
          <TabsList className="inline-flex h-auto p-1 gap-1">
            {days.map((day) => (
              <TabsTrigger
                key={day.key}
                value={day.key}
                className="min-h-11 min-w-[88px] px-4 py-2 text-sm"
              >
                {day.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {/* Daily list — one class per row, mobile-first single column */}
        {days.map((day) => (
          <TabsContent key={day.key} value={day.key} className="mt-4">
            <ul className="flex flex-col gap-3">
              {day.classes.map((cls) => (
                <li key={cls.id}>
                  <Card>
                    <CardContent className="flex items-center justify-between gap-4 p-4">
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="text-sm font-medium tabular-nums">
                          {cls.startTime} — {cls.endTime}
                        </div>
                        <div className="text-base font-semibold truncate">
                          {cls.classType}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {cls.instructor}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cls.capacityLabel}
                        </div>
                      </div>
                      <Button
                        size="lg"
                        variant={cls.action === "book" ? "default" : "secondary"}
                        className="min-h-11 shrink-0"
                        disabled={cls.action === "full"}
                      >
                        {cls.action === "book"
                          ? "Book"
                          : cls.action === "waitlist"
                          ? "Waitlist"
                          : "Full"}
                      </Button>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
```

Notes on the reference:
- Single-column daily list, not a 7-column weekly matrix — per SKILL.md precedence rule 1: mobile-first beats schedule-grid density.
- `Today` / `Tomorrow` / `Sat, Apr 18` labels come from the data layer, not the component — caller is responsible for computing relative labels for the next ~2 days and falling back to `EEE, MMM d` format after.
- `tabular-nums` on the time line so start/end times align vertically across rows.
- `min-h-11` (44px) on buttons and day tabs to satisfy `mobile_tap_target_min_44`.
- Capacity string is opaque to this component — generation is delegated to `capacity-signal.md`.

## Measurable checks

### today_shortcut_present
Condition: The day picker's first two cells render as "Today" and "Tomorrow" rather than numeric dates alone. Subsequent days use day-of-week + date format.
Reasoning: Eliminates date-calculation friction on the two most-trafficked days and reduces cognitive load on mobile where screen real estate is scarce.

### day_label_clarity
Condition: Day cells beyond "Today"/"Tomorrow" show day-of-week abbreviation plus date (e.g., "Sat, Apr 18"), not just a numeric date ("18") or just a day-of-week ("Sat").
Reasoning: Users plan by day-of-week rhythm; date anchors the absolute time and disambiguates across weeks.

### location_switcher_visible
Condition: Location/studio switcher is visible in the first viewport above the schedule content — a dropdown, tab group, or selector, not a hidden link or a footer item.
Reasoning: Wrong-location bookings produce refund tickets, CS load, and a class someone else could have booked. The switcher must be the second thing a user sees after the page heading.

### time_shows_start_and_end
Condition: Every class row displays both start time and end time, or start time and an explicit duration badge ("50 min").
Reasoning: Users plan around the hour. A single timestamp forces mental math against a class-type duration the user may not have memorized.

### capacity_visible_per_row
Condition: Every class row has a capacity signal (exact format defined in `capacity-signal.md`) — never a dead row with no availability indicator.
Reasoning: A schedule row without capacity data is a commitment to a potential dead-end tap; users learn to distrust the grid and call the studio instead.

### mobile_tap_target_min_44
Condition: Day-picker tabs and per-row action buttons each have a minimum tap target of 44×44 px (Apple HIG / WCAG 2.5.5 equivalent).
Reasoning: Fitness traffic is thumb-driven and often in-motion (walking, in a locker room, one-handed from bed). Sub-44px targets measurably lose bookings.

### single_column_on_mobile
Condition: At viewport widths ≤640px, the schedule renders classes as a single-column vertical list, not a multi-column weekly matrix.
Reasoning: Per SKILL.md precedence rule 1: "mobile-first beats schedule-grid density." Horizontally-scrolling grids on mobile are the `desktop-grid-on-mobile` anti-pattern.

## Cross-pattern notes

- **Delegates capacity rendering to `capacity-signal.md`.** This reference defines *that* each row needs a capacity label; the exact thresholds ("1 spot" vs "Almost full" vs "Waitlist +3") belong to capacity-signal and must not be duplicated here.
- **Interacts with `instructor-affinity.md`** for how the instructor name is presented per row. On featured rows (co-owner, founder, beloved veteran), instructor affinity wins over pure capacity signaling — see SKILL.md precedence rule 2: "instructor-affinity beats capacity-signal on featured rows."
- **Interacts with `multi-location-selection.md`** for the location switcher at the top of the grid. If the brand has pre-launch locations, the switcher must distinguish "coming soon" studios from bookable ones (see `multi-location-selection.md`'s pre-launch guidance).
- **Interacts with `waitlist-cancellation.md`** for the sold-out state on a class row. Per SKILL.md precedence rule 4, waitlist-cancellation beats capacity-signal for sold-out rendering — show "Waitlist +N" as social proof rather than a terminal "FULL" label.
- **Precedence rule 1 from SKILL.md**: mobile-first beats schedule-grid density. If the desktop mock calls for a 7-column weekly matrix and the mobile breakpoint can't accommodate it legibly, collapse to daily-list on mobile — do not ship a horizontally-scrolling desktop grid to phones.
