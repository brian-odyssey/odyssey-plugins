# Instructor affinity

## What it is

How a fitness site surfaces the identity, expertise, and personality of the instructor teaching each class — and how the user acts on that information. In practice: a photo on every schedule row, a bio reachable without leaving the schedule, a follow-or-favorite mechanic that filters the schedule by preferred instructors, a differentiated treatment for founder/owner/master instructors, and an instructor-first browsing mode as a peer to the class-first schedule grid. The pattern is not about a `/instructors` directory page alone — it is about how instructor identity threads through every surface where a class is chosen.

## Why it matters in fitness

Fitness buyers pick teachers emotionally. Class type ("Classic 50", "Lagree", "Vinyasa") is the functional filter; instructor is the decision. A regular picks Tennille's 9am because of her cueing cadence, her music, the way she coaches through the last 30 seconds of footwork — not because it is a 50-minute reformer class. Peloton's entire subscription moat is that members follow an instructor, not a class type, and the product is built to honor that preference. Boutique studios that treat instructors as interchangeable staff behind class-type branding leave retention on the floor every week.

Two moments make this pattern load-bearing:

1. **Grand opening / founder teaching.** When a co-owner or founder teaches a class, that is the single strongest trust signal the brand can emit on that day — "the person whose name is on the lease is in the room with you." A schedule row that renders the founder identically to every other instructor ("Tennille B.", plain text link, no photo, no badge) throws away the signal at the exact moment it matters most. Launch days, anniversary classes, and owner's-choice events all live or die on this differentiation.
2. **The repeat-visitor schedule scan.** A member opens the schedule 2–4 times a week. If she cannot filter to "only show me Becca, Amber, and Tennille," she scans the full grid every time, reads instructor names in small type, and mis-books when a substitute is quietly swapped in. A favorite-instructor mechanic collapses the scan into one glance.

The generic-CMS failure mode is to put instructors on an `/instructors` page (bio grid, photos, link back to homepage) and then link to that page from the footer, while rendering schedule rows as `9:00 AM · Classic 50 · Tennille B.`. The bio is in the building; the schedule is in another building; the user never crosses the street.

## Anti-patterns

### instructor-as-plain-text
Schedule rows render the instructor as plain text or a text-only link, with no photo, no avatar, no affordance to peek at a bio. Users scan names without faces; new members can't put a person to a name until week three. Fails because the instructor is the primary emotional decision input on a fitness schedule — hiding the face hides the decision. Boutique CMS themes that inherit their schedule from a generic booking plugin ship this by default.

### founder-not-differentiated
Owner, founder, or master instructor teaching a class renders identically to any other instructor on the row. No badge, no "Owner," no "Founder," no visual weight. Fails catastrophically on grand-opening days and owner's-choice marketing moments — the single biggest trust signal the brand can emit is flattened into sameness. Also fails on anniversary classes, founder-led workshops, and signature-format debuts.

### no-favorite-mechanic
No way to favorite, follow, or heart an instructor; no way to filter the schedule by favorited instructors; no personalized view of "my teachers' classes this week." Fails because repeat members — the retention core of any studio — think in instructor names, not class types. Forcing them to scan the full grid every visit converts what should be a one-tap action into a weekly cognitive tax.

### instructor-bio-buried
Bios require multiple navigation steps away from the schedule — schedule → footer → instructors index → individual bio → back button → lose your schedule place. Fails because users want to peek at a bio mid-booking (new substitute teaching the 6am? who is she?) without abandoning the reservation they were about to make. A drawer, popover, or hover card keeps the user in the schedule context; a full-page navigation breaks it.

### single-instructor-voice
Brand uses one marketing tone for every instructor — same bio template, same adjectives ("passionate," "certified," "loves helping clients reach their goals"), same portrait crop, no distinct playlist/format/vibe callouts. Fails because instructor identity is the differentiator; flattening it into a brand-voice monolith throws away the specificity users book on. SoulCycle gets this right by surfacing each instructor's music taste as a first-class attribute; boutique studios often miss it entirely.

### stale-substitute-handling
When a substitute instructor replaces the scheduled teacher, the schedule row still shows the original instructor's photo and name — or flips silently to the substitute with no visual cue. Fails because the instructor is the reason the user booked; a silent swap is a trust violation. The row must mark "Sub: Angie for Tennille" explicitly, not change the name without acknowledgment.

## Real-world references

### Peloton — instructor as the primary product axis
- URL: https://www.onepeloton.com/instructors · last_verified: 2026-04-15
- Pattern observed: A dedicated `/instructors` landing page browses the full roster with large headshots and discipline tags. Inside the app, classes can be filtered by instructor as a first-class filter alongside length, music, and class type. A separate `/instructor-match` quiz helps new users find their fit. Peloton's blog and marketing openly frame instructor selection as the core member decision.
- What to notice: instructor is not a metadata field on a class — it is a top-level browsing axis, co-equal with class type. The filter-by-instructor capability is the mechanic that makes favoriting useful. Cautionary note: Peloton's scale (50+ instructors) justifies a quiz; a 6-instructor boutique studio should not copy that surface, but should copy the filter-by-instructor primitive.

### SoulCycle — per-instructor bio pages with personality attributes
- URL: https://www.soul-cycle.com/instructors/91/Melanie/ · last_verified: 2026-04-15
- Pattern observed: Each instructor has a numbered bio page (`/instructors/91/Melanie/`, `/instructors/51/Laurie/`, `/instructors/75/Sue/`) with narrative that names specific attributes — music taste ("eclectic playlists with everything from alternative rock to dance to pop sing-alongs"), teaching tenure ("first rider to become an instructor in 2009"), personal story (cancer survivor, mother of three), and brand role (Senior Master Instructor, Senior Director of Brand Experience). An "Instructor Spotlight" Spotify playlist extends the identity off-site.
- What to notice: bios are not templates — they are portraits. Music is treated as a defining instructor attribute, not trivia. Tenure and role ("founding Senior Master Instructor," "original instructor since 2009") are called out in-copy, which is the closest the market gets to founder-differentiation without a formal badge.

### Barry's — URL-addressable per-instructor pages
- URL: https://www.barrys.com/instructors · last_verified: 2026-04-15
- Pattern observed: The `/instructors` index lists trainers globally with photos; each trainer has a clean URL slug (`/instructor/derek-degrazio/`, `/instructor/ben-zerbst`, `/instructor/nikolai-hepp`, `/instructor/ian-chan`). Bios include years of experience, prior careers (ex professional dancer, coaching history), and the studios where they teach. Index copy: "click on an instructor to learn more and book a class with them" — the bio and the booking are on the same path.
- What to notice: clean slugs make instructor pages shareable and bookmarkable — a user can text a friend `/instructor/derek-degrazio/` instead of "the tall guy with the beard." The index → bio → booking handoff is one continuous surface, not three disconnected sections.

### Equinox — landing page positions instructors as subject-matter experts
- URL: https://www.equinox.com/landing/group-fitness-instructors · last_verified: 2026-04-15
- Pattern observed: A brand-level landing page (`/landing/group-fitness-instructors`) frames instructors as credentialed experts ("subject matter experts that have years of experience in their respective sports and fields"), not as generic staff. Copy emphasizes that group fitness classes are "created by the industry's best-minds and taught by expert Instructors who know how to turn a class into an experience."
- What to notice: even at a large-club chain where individual instructors do not have the brand gravity of a Peloton or SoulCycle name, the marketing surface still elevates instructors as experts. The lesson for boutique studios: the floor for instructor framing is "expert," never "staff."

### Alo Moves — instructor bios with discipline-specific specialization
- URL: https://wellnessclub.aloyoga.com/explore/instructors · last_verified: 2026-04-15
- Pattern observed: The `/explore/instructors` index links to individual pages (e.g., `/instructors/briohnysmyth`, `/instructors/ashley`, `/instructors/dylanwerner`) with substantial narrative bios naming specific specializations ("blends an invigorating flow with eye-opening alignment instruction"; "known around the world for her strength and flexibility"; "10 years of advanced movement training before teaching in over 60 countries"). Each instructor is framed by what they uniquely teach, not by a shared template.
- What to notice: discipline-specific specialization is surfaced in the bio's first sentence, not buried in a paragraph three. For a Pilates/Lagree studio, the analog is: lead with "Tennille teaches the classic 50 format with an emphasis on spinal articulation" rather than "Tennille is a certified reformer instructor who loves helping clients."

## Reference implementation (shadcn + Tailwind)

```tsx
// Reference-quality snippet — adapted from shadcn primitives, typecheck-clean in isolation.
// Adapt to target brand. Not CI-validated against any specific project.
// Shows: founder badge, photo avatar, favorite toggle, bio drawer reachable without losing schedule place.

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Heart, Star } from "lucide-react"

type Instructor = {
  id: string
  name: string
  slug: string
  photoUrl: string
  role: "instructor" | "owner" | "founder" | "master"
  bio: string
  specialization: string
}

type InstructorRowProps = {
  instructor: Instructor
  startTime: string
  classType: string
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  capacityLabel: string // delegated to capacity-signal.md
  onBook: () => void
}

const ROLE_LABEL: Record<Instructor["role"], string | null> = {
  instructor: null,
  owner: "Owner",
  founder: "Founder",
  master: "Master Instructor",
}

export function ScheduleRowWithInstructor(props: InstructorRowProps) {
  const { instructor, startTime, classType, isFavorited, onToggleFavorite, capacityLabel, onBook } = props
  const [bioOpen, setBioOpen] = useState(false)
  const roleLabel = ROLE_LABEL[instructor.role]
  const isFeatured = instructor.role !== "instructor"

  return (
    <Card className={isFeatured ? "border-purple-500/40 bg-purple-500/5" : undefined}>
      <CardContent className="flex items-center gap-4 p-4">
        {/* Photo — not just a name. Tap to open bio sheet. */}
        <Sheet open={bioOpen} onOpenChange={setBioOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-ring"
              aria-label={`About ${instructor.name}`}
            >
              <Avatar className="h-12 w-12">
                <AvatarImage src={instructor.photoUrl} alt={instructor.name} />
                <AvatarFallback>{initials(instructor.name)}</AvatarFallback>
              </Avatar>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {instructor.name}
                {roleLabel ? (
                  <Badge className="bg-purple-500/15 text-purple-700 border-purple-300">
                    <Star className="mr-1 h-3 w-3" />
                    {roleLabel}
                  </Badge>
                ) : null}
              </SheetTitle>
              <SheetDescription className="text-sm">{instructor.specialization}</SheetDescription>
            </SheetHeader>
            <p className="mt-4 text-sm text-muted-foreground">{instructor.bio}</p>
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium tabular-nums">{startTime}</div>
          <div className="truncate text-base font-semibold">{classType}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="truncate">{instructor.name}</span>
            {roleLabel ? (
              <Badge variant="outline" className="shrink-0 border-purple-300 text-purple-700">
                {roleLabel}
              </Badge>
            ) : null}
          </div>
          <div className="text-xs text-muted-foreground">{capacityLabel}</div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isFavorited ? `Unfavorite ${instructor.name}` : `Favorite ${instructor.name}`}
            aria-pressed={isFavorited}
            onClick={() => onToggleFavorite(instructor.id)}
          >
            <Heart className={isFavorited ? "h-5 w-5 fill-rose-500 text-rose-500" : "h-5 w-5"} />
          </Button>
          <Button size="sm" onClick={onBook} className="min-h-11">
            Book
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}
```

Notes on the reference:
- Avatar is a button wrapping a Sheet trigger — tapping the photo opens a right-side drawer with the bio. Schedule scroll position is preserved because the drawer overlays rather than navigates.
- `role` is a discriminated enum, not a boolean `isOwner`. Owner, founder, and master instructor each get a distinct label; a generic "instructor" renders no badge at all.
- Card gets a purple-tinted border when `isFeatured` — lightweight differentiation that works on a dense schedule without crowding the grid.
- Favorite toggle is an icon button with `aria-pressed` state; parent owns the favorited-set and passes it in so filtering the schedule by favorites is a caller-side concern.
- Capacity copy is opaque to this component — generation belongs to `capacity-signal.md`. Per SKILL.md precedence rule 2, the featured/role badge wins visual weight over the capacity signal on owner/founder rows.

## Measurable checks

Prose heuristics a reviewer applies to the rendered page. Pass/fail judgments.

### instructor_has_photo_on_schedule
**Condition:** Every schedule row displays an instructor photo (avatar, headshot thumbnail, or equivalent image), not just a text name. Minimum 32×32px, ideally 40–48px on mobile.
**Reasoning:** Users pick instructors emotionally and associate faces with teaching style long before names. A text-only row is the `instructor-as-plain-text` anti-pattern and is measurably worse for new-member retention.

### instructor_name_links_to_bio
**Condition:** The instructor's name (or photo, or both) on a schedule row is a tappable affordance that surfaces the bio — either as a drawer/popover that preserves schedule context, or as a linked page with clear back-navigation.
**Reasoning:** Users want to peek at a bio during booking without abandoning the row. A name that is plain text with no affordance is a dead-end; a name that navigates away and loses scroll position is almost as bad.

### founder_owner_badge_present
**Condition:** When a founder, owner, or master instructor is teaching a class, the schedule row displays a distinct badge, role label, or visually differentiated treatment (border, background tint, badge). A founder teaching must not render identically to a regular instructor.
**Reasoning:** Founder-teaching is the single biggest trust signal a studio emits on launch days and anniversary moments. Rendering it as sameness is the `founder-not-differentiated` anti-pattern and a direct conversion loss.

### favorite_mechanic_present
**Condition:** Users can favorite, follow, or heart an instructor from either the schedule row or the bio view. A "Favorites" filter or personalized view applies the favorited set to the schedule. A site with no mechanism to express instructor preference fails this check.
**Reasoning:** Repeat members think in instructor names. Without a favorite primitive, the schedule becomes a weekly scan task; with one, it becomes a one-glance action. Peloton built a subscription business on this primitive.

### bio_reachable_without_losing_schedule_place
**Condition:** Opening an instructor bio from the schedule uses an overlay pattern (drawer, sheet, popover, modal) or preserves scroll/filter state across navigation. Returning from a bio lands the user exactly where they were on the schedule.
**Reasoning:** Mid-booking bio peeks are a common user behavior. Full-page navigation with no state preservation breaks the flow and measurably increases abandonment. The overlay pattern is how Barry's, SoulCycle, and Alo Moves keep users in context.

### instructor_listing_first_class_option
**Condition:** The site offers an instructor-first browsing mode (a `/instructors` index with photos + bios + "book a class with this instructor" affordance, or a schedule filter keyed to instructor), not only a class-first schedule grid. The instructor-first path is reachable from primary navigation, not buried in a footer.
**Reasoning:** A nontrivial share of bookings start from "I want to take Tennille's class" rather than "I want a Classic 50 at 9am." If the only entry point is the class-first grid, that intent has no on-ramp. Peloton's `/instructors` and Barry's `/instructors` are both top-nav-reachable.

### instructor_specialization_surfaced
**Condition:** Instructor bios name a specific specialization, format preference, or signature attribute in the first two sentences — not a generic template ("passionate about helping clients reach their goals"). Attributes like music taste, format (Classic 50 vs inTensiFIRE), coaching style, or prior career count.
**Reasoning:** Users book specificity. Generic bios are the `single-instructor-voice` anti-pattern. Alo Moves and SoulCycle both lead with the distinct attribute; boutique studios that inherit CMS bio templates flatten this and pay in undifferentiated brand perception.

### substitute_instructor_acknowledged
**Condition:** When a substitute instructor replaces the scheduled teacher, the schedule row shows an explicit "Sub:" prefix or a "Subbed by" badge — not a silent name swap and not a stale original photo. The substitute's photo and name should both update.
**Reasoning:** The instructor is the reason the user booked. Silent swaps violate the booking's implicit contract; acknowledgment keeps trust intact even when the swap is unwelcome.

## Cross-pattern notes

- **`schedule-grid.md`** owns how the schedule row is structured (time, class type, CTA, day picker). This pattern owns what the instructor slot within that row looks like. The photo, name, role badge, and favorite toggle described here are slotted into the row component defined in schedule-grid.
- **`capacity-signal.md`** governs the scarcity indicator on the same row. **Precedence rule 2 from SKILL.md applies:** on featured rows (owner, founder, master instructor), instructor-affinity wins visual weight over capacity-signal. Scarcity is still shown but is not the primary visual — the founder badge and row treatment lead. A 1-spot-left owner-taught class reads "the founder is teaching, and it's almost full" in that order, not the reverse.
- **`booking-flow.md`** owns the commit dialog after the user taps Book. The dialog should restate the instructor's name and photo — never drop the identity signal between schedule and confirmation. A user who booked because of the instructor and sees a confirmation with only class type and time has lost the decision input that drove the booking.
- **`intro-offer-funnel.md`** owns the first-visit surface. On intro-offer landing pages, leading with founder/owner identity ("Meet Tennille, co-owner and lead instructor") is often the strongest trust anchor available, especially for a new or grand-opening location. Instructor affinity is not only a repeat-visitor pattern.
- **`multi-location-selection.md`** interacts when instructors teach at multiple studios. The bio should list the locations where the instructor teaches, and the favorite mechanic should either filter across all locations or scope to the user's selected studio — whichever the brand's booking model supports. Do not silently drop an instructor off the schedule because the user's selected studio changed; surface "Tennille teaches at Sandy and Millcreek" explicitly.
- **`kiosk-checkin.md`** is out of scope. In-studio kiosks do not need favoriting; they need fast check-in. Never mix kiosk and web instructor patterns.
