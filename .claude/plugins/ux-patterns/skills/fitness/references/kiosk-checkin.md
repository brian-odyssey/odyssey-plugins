# Kiosk check-in

## What it is

The in-studio self-service screen a member taps when they walk through the door 5 minutes before class. Typically an iPad wall-mounted near the entrance, sometimes a larger touchscreen at a reception counter or hallway. The screen's job is to move a member from "I just arrived" to "I am marked present on the class roster" in fewer than three taps, without asking for a password, without forcing the member to take off a backpack, and without making them squint from two feet away in gym lighting. Kiosk check-in is a distinct surface from the public website and from the member's mobile app — it is shared-device, single-purpose, and physically anchored to a studio location that the hardware already knows about.

## Why it matters in fitness

Class start is a rush-hour event. A 6:00pm reformer class has fifteen people arriving in a 5-minute window, all holding water bottles, phones, bags, and keys. Every extra second at the kiosk is a body not yet in the room and an instructor standing at the front waiting to start. A kiosk that demands an email and a password replicates the front-desk queue the studio was trying to eliminate — and boutique studios increasingly market front-desk-less operations as a premium experience ("seamless check-ins" is MarianaTek's explicit positioning for the category). Shared-device context forces three constraints general-purpose UX frameworks do not: (1) **zero-auth or minimal-auth** — the person tapping is not signed in, they identify themselves, (2) **time-filtered schedule** — nobody at a kiosk cares about Thursday's 9am class; they care about the next 30 minutes, and (3) **gym-hands touch targets** — sweaty, gloved, or post-workout fingers need 72-96px targets, not 44px mobile minimums.

The wrong-class recovery flow is rare but load-bearing. When a member accidentally taps the wrong class (adjacent time slots are common at the kiosk because the schedule is time-filtered and sorted chronologically), the next 3 seconds determine whether the studio gets a corrected roster or an angry member standing at the front of the wrong class. A kiosk without a one-tap correction path forces staff intervention, which defeats the entire reason the kiosk exists.

## Anti-patterns

### password-gated-checkin
Kiosk demands email + password (or worse, full signup) before allowing check-in. Fails because the member is standing in their own studio, holding gear, late for a class they already booked and paid for. Passwords are forgotten, emails are mistyped on a shared iPad keyboard, and the queue forms behind the person fumbling. The correct identifier at a kiosk is phone number (numeric keypad, 10 digits), QR code (scanned from the app or email), or name-lookup typeahead — any of which resolves to the member record without a credential challenge. Platforms purpose-built for studio kiosks (MarianaTek Biz App Kiosk Mode, Mindbody Check-In, Glofox kiosk) default to name-lookup or tap-your-name-on-roster, not password auth.

### tiny-tap-targets
Buttons sized to a desktop pointer or mobile 44px minimum. Fails at a kiosk because the viewing distance is 18-24 inches rather than 10, users are standing (not seated with device in hand), and fingers are often damp, gloved, or carrying things. The WCAG 44×44 mobile minimum is the floor, not the target — kiosk norms land at 72-96px for primary actions. Compounding miss: when tap targets are small, users miss and tap twice, which on a slow connection double-checks-them-in or triggers a duplicate record.

### schedule-not-time-filtered
Kiosk shows the entire week's schedule at entry, forcing users to find "today" and then "the next hour." Fails because 100% of kiosk traffic is there to check in to a class starting in the next 10 minutes. The default view should be "classes starting within the next 60 minutes at this location" — not a week grid, not a month view, not even today's full schedule. Only after the user indicates they want to browse (rare at a kiosk) should the fuller schedule appear.

### no-wrong-class-recovery
User taps the wrong class — very possible when the 5:45 and 6:00 classes are stacked on screen — and has no visible "not that one?" affordance. Fails because correcting requires either staff intervention (defeats the kiosk's purpose) or an undo flow buried in a confirmation detail page. Correct pattern: after check-in the confirmation screen shows the checked-in class prominently with a clearly visible "Wrong class? Change" link that drops the user back to the next-60-minutes list with their identity preserved.

### tiny-text
Class names, instructor names, time labels rendered at 14-16px like a desktop UI. Fails because kiosk users are further from the screen than phone users and reading conditions are worse (overhead fluorescents, sweat in eyes, motion). Primary copy should be 24-32px minimum; class titles should be 32-48px. The Mindbody Check-In app explicitly uses large-format class names for this reason.

### slow-feedback
Tap-to-visible-feedback takes more than 300ms, with no spinner or button-state change. Fails because users assume the tap did not register and tap again — producing a double check-in, a duplicate confirmation, or (with optimistic UI) a flicker that reads as broken. Kiosk check-in is a moment where the perceived responsiveness is the UX; a 1-second delay with nothing on screen reads as a busted iPad.

### no-location-context
Kiosk is deployed across multiple studios and expects the member to pick a location at check-in time, or worse, defaults to the wrong one. Fails because the hardware is physically bolted to one studio — location is a device-config problem, not a user-input problem. MarianaTek and ClubReady both treat location as a kiosk-setup step done by staff once, not a per-check-in choice for the member.

## Real-world references

### MarianaTek — Biz App Kiosk Mode on iPad
- Pattern observed: Staff taps "Kiosk Mode" in the Biz App Daily Schedule and selects region + location at setup. Customer-facing view: member finds their class, sees the class roster, taps their own name, and taps "Check In." Confirmation modal displays plus add-ons and spot number (for Pick-A-Spot classes). Intended for iPad specifically because "a larger interface is preferred" for a customer-facing feature.
- URL: https://support.marianatek.com/en/articles/8006068-what-is-kiosk-mode-on-the-biz-app
- last_verified: 2026-04-15
- What to notice: Identification is roster-tap — no password, no phone number challenge, the member is already on the class roster because they booked. Location is chosen once at setup, not per-check-in. Spot number (Pick-A-Spot) displays in the confirmation, giving the user their next physical action (which reformer to go to) in the same screen that confirmed the check-in.

### MarianaTek — front-desk-less positioning
- Pattern observed: Product marketing frames self check-in as a premium experience ("Seamless Check-ins: Transforming the Fitness Studio Experience"), explicitly targeting studios that want to eliminate the front desk as a queue point.
- URL: https://www.marianatek.com/blog/redefining-fitness-studios-without-front-desk/
- last_verified: 2026-04-15
- What to notice: The kiosk is not a back-office convenience — it is positioned as brand experience. This matters for review: a kiosk that feels clunky undermines the premium positioning the studio paid to project.

### Mindbody — Check-In app for iPad
- Pattern observed: Standalone iPad app (separate from the main Mindbody business app) dedicated to self-check-in. Customers search for their name and tap to mark arrival; app chimes on successful check-in as audible feedback. Shows remaining class count per customer (social / behavioral signal). Respects Core-software class visibility settings so private classes don't appear on the public kiosk. Supports Pick-A-Spot spot assignment surfacing.
- URL: https://apps.apple.com/us/app/mindbody-check-in/id978183901
- last_verified: 2026-04-15
- What to notice: Name-search typeahead instead of password, audible confirmation chime (matters in a noisy studio environment where visual confirmation alone may be missed), and the deliberately separate app identity — Mindbody chose not to overload the business app with kiosk mode because the contexts are different.

### Mindbody — Class Check-in support docs
- Pattern observed: Documentation describes the kiosk as stationed at "the front desk or directly outside classrooms" — two physical placement modes studios commonly use. App explicitly lists the day's classes and allows one-tap customer check-in as the primary flow.
- URL: https://support.mindbodyonline.com/s/article/205681418-Class-Check-in-for-iPad
- last_verified: 2026-04-15
- What to notice: Physical placement guidance (front desk vs. outside classroom) shapes the UX — a hallway kiosk outside a specific room can safely narrow further to "this room's next class" rather than a studio-wide list.

### Glofox — Check-in Kiosk
- Pattern observed: 100% self-service kiosk available to Boost and Elite-tier studios. Supports branded self check-in, waiver capture, photo capture, and "fast lines during peak periods." Members can see classes happening now, view open slots, and book into an open class on the spot (if credits cover it or the class is free). Walk-ins who need to pay are routed to reception.
- URL: https://support.glofox.com/hc/en-us/articles/360004211217-Getting-Started-with-the-Check-in-Kiosk
- last_verified: 2026-04-15
- What to notice: Kiosk extends beyond check-in into same-day booking — recognizing that walk-ins happen and the kiosk is already the right surface to resolve them. Also: the explicit "fast lines during peak periods" framing, which matches the class-start rush-hour reality.

### ClubReady — Check-In Web Kiosk
- Pattern observed: Web-based kiosk (no app install) supporting barcode, 4-digit PIN, or username/password identification. Runs on any touchscreen monitor or tablet. Staff can manually check in via Check-In Monitor using barcode, PIN lookup, phone number, ClubReady User ID, or name search — all common identifier types explicitly supported. Custom branding (logo, colors) included.
- URL: https://clubready.zendesk.com/hc/en-us/articles/360041823932-Check-In-Web-Kiosk-Overview
- last_verified: 2026-04-15
- What to notice: Phone number is a first-class lookup identifier. 4-digit PIN is the accepted lightweight alternative to a password — short enough to remember, long enough to disambiguate without a full auth flow. Web-based (not native app) allows deployment on any cheap touchscreen.

### Wodify — Kiosk+ for CrossFit gyms
- Pattern observed: Kiosk+ is the dedicated in-gym display surface. Sign-In Panel handles attendance; Results Panel adds workout-scoring capability so the same kiosk can log WOD results. Designed for CrossFit class format where check-in and workout logging are adjacent actions.
- URL: https://help.wodify.com/hc/en-us/articles/9639394363159-Set-Up-Kiosk
- last_verified: 2026-04-15
- What to notice: Kiosk scope expands to adjacent in-gym actions (workout logging) rather than staying narrowly on check-in. Lesson transferable to any studio: once the member is at the kiosk, the kiosk can be the surface for other lightweight member-facing interactions (signing a waiver, viewing spot assignment, seeing remaining credits). Scope carefully — overloading kills the check-in speed that was the point.

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — adapted from shadcn primitives, typecheck-clean in isolation.
// For in-studio iPad kiosks ONLY. Do not import these sizing or auth patterns to the public website.
// Happy path: member walks in, enters phone number, taps their next class, sees confirmation.

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCircle2 } from "lucide-react"

type ClassSlot = {
  id: string
  startsAt: Date
  classType: string
  instructor: string
  spotNumber?: number
}

type Member = { id: string; firstName: string; lastName: string; upcoming: ClassSlot[] }

type Props = {
  locationName: string  // device-configured, never user-input
  lookupByPhone: (phone: string) => Promise<Member | null>
  checkIn: (memberId: string, classId: string) => Promise<void>
}

export function CheckinKiosk({ locationName, lookupByPhone, checkIn }: Props) {
  const [phone, setPhone] = useState("")
  const [member, setMember] = useState<Member | null>(null)
  const [checkedInto, setCheckedInto] = useState<ClassSlot | null>(null)
  const [pending, setPending] = useState(false)

  async function handleLookup() {
    if (phone.length < 10) return
    setPending(true)
    const m = await lookupByPhone(phone)
    setPending(false)
    if (m) setMember(m)
  }

  async function handleCheckin(slot: ClassSlot) {
    if (!member) return
    setPending(true)
    await checkIn(member.id, slot.id)
    setCheckedInto(slot)
    setPending(false)
  }

  function reset() {
    setPhone("")
    setMember(null)
    setCheckedInto(null)
  }

  // Confirmation state — persistent, with wrong-class recovery.
  if (checkedInto && member) {
    return (
      <Card className="mx-auto max-w-2xl border-emerald-500/40 bg-emerald-500/5">
        <CardHeader className="items-center text-center">
          <CheckCircle2 className="h-20 w-20 text-emerald-500" />
          <CardTitle className="text-5xl">You're checked in</CardTitle>
          <CardDescription className="text-2xl">
            {member.firstName}, see you in {checkedInto.classType}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <div className="text-3xl font-semibold tabular-nums">
            {formatTime(checkedInto.startsAt)} · {checkedInto.instructor}
          </div>
          {checkedInto.spotNumber ? (
            <div className="text-4xl font-bold">Reformer #{checkedInto.spotNumber}</div>
          ) : null}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              variant="outline"
              className="h-20 px-10 text-2xl"
              onClick={() => setCheckedInto(null)}
            >
              Wrong class? Change
            </Button>
            <Button className="h-20 px-10 text-2xl" onClick={reset}>
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Class picker — member identified, showing next 60 minutes only.
  if (member) {
    const upcoming = member.upcoming.filter(
      (c) => c.startsAt.getTime() - Date.now() < 60 * 60_000,
    )
    return (
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-4xl">Hi, {member.firstName}</CardTitle>
          <CardDescription className="text-2xl">Tap your class to check in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {upcoming.length === 0 ? (
            <p className="text-2xl text-muted-foreground">
              No classes in the next hour. See the front desk.
            </p>
          ) : (
            upcoming.map((slot) => (
              <Button
                key={slot.id}
                variant="outline"
                className="h-24 w-full justify-between px-8 text-2xl"
                disabled={pending}
                onClick={() => handleCheckin(slot)}
              >
                <span className="text-left">
                  <div className="text-3xl font-semibold">{slot.classType}</div>
                  <div className="text-xl text-muted-foreground">{slot.instructor}</div>
                </span>
                <span className="text-3xl font-bold tabular-nums">
                  {formatTime(slot.startsAt)}
                </span>
              </Button>
            ))
          )}
          <Button variant="ghost" className="h-16 w-full text-xl" onClick={reset}>
            Not you? Start over
          </Button>
        </CardContent>
      </Card>
    )
  }

  // Entry — phone number lookup, numeric keypad on iPad.
  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-5xl">Welcome to {locationName}</CardTitle>
        <CardDescription className="text-2xl">
          Enter your phone number to check in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Input
          type="tel"
          inputMode="numeric"
          autoFocus
          className="h-24 text-center text-4xl tabular-nums"
          placeholder="(555) 555-5555"
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          maxLength={10}
        />
        <Button
          className="h-24 w-full text-3xl"
          disabled={phone.length < 10 || pending}
          onClick={handleLookup}
        >
          {pending ? "Finding you…" : "Check in"}
        </Button>
      </CardContent>
    </Card>
  )
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}
```

Three things to notice: (1) tap targets are `h-24` (96px) for primary actions and `h-20` (80px) for secondary — well above the 44px mobile floor and in line with the 72-96px kiosk norm; (2) class names render at `text-3xl` (30px) and titles at `text-4xl`/`text-5xl` so a standing user two feet from the screen can read at a glance; (3) the confirmation screen includes a "Wrong class? Change" button — one tap back to the class picker with identity preserved, satisfying wrong-class recovery.

## Measurable checks

Prose heuristics a reviewer applies to a rendered kiosk screen. Pass/fail judgments.

### checkin_requires_no_password
**Condition:** Identification at the kiosk uses phone number, QR scan, 4-digit PIN, or name-lookup typeahead. A full email + password challenge fails. A first-time-user signup flow that blocks check-in until complete also fails.
**Reasoning:** Members at a kiosk are already paying customers holding gear, late for class. Passwords are the friction point the kiosk exists to eliminate. MarianaTek, Mindbody, Glofox, and ClubReady all ship lookup-based identification as the default.

### tap_target_min_72px
**Condition:** Every primary tap target (check-in button, class row, keypad digit, confirmation action) is at least 72×72 pixels. Secondary controls ("start over," "wrong class") may be slightly smaller but not below 56px.
**Reasoning:** 44px is the mobile minimum for devices held close in a user's hand. Kiosk viewing distance is 2-3× longer and fingers are often damp or gloved. Below 72px, mis-taps produce double check-ins and queue delays.

### text_min_24px
**Condition:** Class names, instructor names, time labels, and member name on the identified state all render at ≥24px. Primary headings render at ≥32px.
**Reasoning:** Viewing distance and conditions at a kiosk (overhead lighting, standing user, motion) require larger type than a phone in-hand. 14-16px desktop type is unreadable at kiosk distance and forces users to lean in, slowing the queue.

### schedule_shows_next_60_min_only
**Condition:** Default view after member identification shows only classes starting within the next 60 minutes at this location. The full day's schedule is available only via a deliberate affordance ("See all today") and is not the default view.
**Reasoning:** 100% of kiosk traffic is there to check in to an imminent class. Showing the week's grid or the full day's schedule buries the one row the user needs under noise.

### confirmation_persistent_5s_min
**Condition:** The "You're checked in" confirmation screen stays on screen until the user taps "Done" OR for a minimum of 5 seconds before any auto-reset. No toast-style confirmations that disappear in 2 seconds.
**Reasoning:** The confirmation is the single source of truth that the member is on the roster. A fast-disappearing toast leaves the user unsure, and in a noisy studio the chime alone is not sufficient. Barry's-style audible chime + persistent visual state together is the target.

### wrong_class_recovery_one_tap
**Condition:** The confirmation screen includes a visible affordance ("Wrong class? Change," "Not this one?") that returns the user to the class-picker state with identity preserved — one tap, no re-identification required.
**Reasoning:** Adjacent class times (5:45 and 6:00 back-to-back) make mis-taps inevitable. Without one-tap recovery, corrections require staff intervention, which defeats the kiosk's entire purpose. This is the lowest-frequency but highest-cost failure mode.

### feedback_under_300ms
**Condition:** Tap on a primary action produces visible state change (button press animation, spinner, disabled state) within 300ms. Network-dependent confirmations render an optimistic in-progress state immediately.
**Reasoning:** Slower feedback triggers double-tap behavior, which on an unreliable network can produce duplicate check-ins or confused confirmation states. Perceived responsiveness is the kiosk UX.

### location_is_device_configured
**Condition:** Location/studio identity is configured once at kiosk setup (staff action) and never asked of the checking-in member. The screen header displays the location name ("Welcome to Sandy") as confirmation, not as a picker.
**Reasoning:** The kiosk hardware is physically anchored to one studio; location is not a user-input problem. MarianaTek and ClubReady both treat location as setup-time config. Asking the member adds a tap and invites wrong-location check-ins.

## Cross-pattern notes

- **`booking-flow.md`** is for public-web booking. SKILL.md precedence rule 5 applies: booking-flow beats kiosk-checkin on web surfaces. If you find yourself wanting 96px tap targets and phone-number-only identification on the public website, you are building the wrong thing — those patterns belong only on an in-studio touch device.
- **`schedule-grid.md`** governs the public schedule display. The kiosk's next-60-minutes list is explicitly NOT a schedule grid — it is a time-filtered, identity-aware subset. Do not import schedule-grid's day-tab pattern to the kiosk; do not import the kiosk's 60-minute filter to the public schedule.
- **`capacity-signal.md`** is irrelevant at check-in — the member already has a reservation, capacity is settled. The kiosk should not render "Almost full" badges on the class-picker view; that signal belongs upstream on booking surfaces.
- **`waitlist-cancellation.md`** partially intersects: a waitlisted member who walks in may be promoted off the waitlist if spots opened. The kiosk should surface this in the class-picker state ("You were promoted from the waitlist — tap to check in") rather than silently treating them as booked.
- **`mobile-first-defaults.md`** applies in spirit (touch-first, large targets) but the kiosk norms are larger than mobile norms. Where mobile-first says ≥44px tap targets, kiosk says ≥72px. Treat kiosk as its own size class, not a mobile breakpoint.
