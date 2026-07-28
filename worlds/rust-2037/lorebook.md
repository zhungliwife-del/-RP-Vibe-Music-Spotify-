# RUST 2037 — Lorebook Source

Keyed lorebook entries for the **RUST 2037** setting (post-apocalyptic North America
and the North Atlantic, six years after the Haverly outbreak).

Format of every entry:

```
### <Entry title>
Keys: comma, separated, trigger, words
Mode: normal | constant
Order: <insertion order number>
---
<entry body>
```

`Mode: constant` entries are always injected (world skeleton). Everything else is
keyword-triggered. `build_lorebook.py` compiles this file into
`rust-2037.lorebook.json` (SillyTavern / Chub / Risu compatible).
For Janitor AI and SpicyChat, paste entries one by one: title → keywords → body.

Adults-only setting (18+). Read `TONE AND LIMITS` before writing bots for it.

---

### World Skeleton — Year Six
Keys: rust 2037, year six, setting, world, apocalypse, post-apocalypse
Mode: constant
Order: 1
---
The year is 2037. Six years ago the Haverly strain (HVR-3, "the Rust") ended the
United States and most of Canada in eleven weeks. Nobody calls it a pandemic
anymore; people count time as "Year Six" and measure distance in nights spent
outside a wall.

Three facts define this world:

1. **The dead do not rot properly.** The Rust is a viral-fungal chimera. It keeps
   corpses walking, hardening them with rust-red mineral crust, and it adapts by
   region: fire-proof bodies near the burn lines, water-preserved bodies in the
   Atlantic shallows, radiation-fed bodies in the Ash Belt.
2. **Most survivors are sterile.** HVR-3 and the only treatment against it both
   destroy fertility. Roughly seven in ten adults who lived through the first two
   years can no longer have children. Fertility, not ammunition, is the scarcest
   resource on the continent — and every faction has a policy about it.
3. **Electricity, medicine and fuel are made by hand.** There is no industry, only
   guilds, scavenged tooling, and improvised chemistry.

Technology level: 2031 hardware, decayed. Cars run on filtered biodiesel and
alcohol. Radios work, satellites don't. Firearms exist but ammunition is currency;
most fighting is done with crafted melee weapons, traps, and the terrain.

---

### The Rust — HVR-3
Keys: rust, the rust, HVR-3, virus, haverly, infection, pathogen, rustcap, ржа, вирус, ржавчина, заражение
Mode: normal
Order: 10
---
**Official name:** Haverly Vector Recombinant 3 (HVR-3). **Street name:** the Rust,
the Red, Haverly's Gift.

It began as medicine. The Haverly Institute in Providence, Rhode Island, ran a
bone-marrow regeneration trial: an engineered viral vector paired with a modified
*Ophiocordyceps* culture nicknamed **Rustcap**, used to force stem-cell activity in
irradiated tissue. The pairing was supposed to be inert outside the marrow. In
January 2031 a batch of vector and a batch of fungus recombined in a cold-chain
failure, and the result did exactly what it was designed to do — force cells to
keep working — in a body that was already dead.

The virus carries the fungus and suppresses immune response; the fungus builds a
mineral-rich lattice through muscle and bone, pulling iron out of blood. That is
where the name comes from: infected tissue oxidizes, sclera turn iron-red, and a
crust the color of old rust grows along the hairline, spine and joints.

**Transmission:** bite and deep scratch (near-certain), blood or saliva into eyes
or open wound (high), inhaled spores from a mature bloom or a burst body
(moderate), sex (moderate). Not airborne over distance. Not waterborne in salt
water — brine suppresses spore release, which is why the coast smells safe and
isn't.

---

### Infection Stages
Keys: infection stages, turning, bitten, stage one, symptoms, rust-mouth, bleach kit, стадии заражения, укус, обращение, укушен
Mode: normal
Order: 11
---
Turning takes 12–36 hours. Everyone on the continent can recite the stages.

- **Stage 0 — Exposure.** No symptoms. 10–40 minutes.
- **Stage 1 — Rust-mouth.** Metallic taste, nosebleed, sclera going pink-red.
  Lasts 20 minutes to 6 hours. **The only treatable window.**
- **Stage 2 — Fever-lock.** 40°C fever, joints stiffening, hearing becomes
  painfully sharp. 2–10 hours. Person is still themselves and knows what is coming.
- **Stage 3 — Bloom.** Rust crust breaks the skin at hairline and spine. Speech
  degrades to short repeated phrases. Violence toward sound.
- **Stage 4 — Silence.** Cardiac arrest. Body cools. Reanimation follows in 3 to
  40 minutes.

**The Bleach kit** — high-dose iron chelation plus a crude antifungal, four
injections over six hours. Works only in Stage 1, succeeds maybe four times in ten,
and permanently destroys fertility in most patients. A kit costs more than a rifle.
Deciding who gets one is the most common moral catastrophe in this world.

About one exposure in nine resolves on its own; those people are **Rustproof** —
partially immune, hunted for their blood by the Sanitars and taxed as an asset by
the CMR.

---

### Sterility — The Barren Ratio
Keys: sterility, barren, fertility, infertile, barren ratio, birth rate, demographics, бесплодие, рождаемость, стерильность
Mode: normal
Order: 12
---
The Rust's quiet legacy: HVR-3 attacks reproductive tissue even in people who never
turn, and iron chelation therapy finishes the job. Six years in, roughly **72% of
adult survivors cannot conceive**. Live births in the first three years after the
outbreak were near zero across the continent.

This single number generates the politics of the whole setting. A fertile woman is
treated as strategic infrastructure by the CMR, as a person to be extracted by the
Quiet Web, as a health-controlled liability by Meridian, as cargo by traffickers,
and as a statistic by the Sanitars. A fertile man is a career opportunity inside the
Compact and a target for kidnapping outside it.

Fertility is verified, not claimed: index panels, hormone strips, marrow draws.
The paperwork of that verification — indexes, stamps, registry lines — is the real
horror engine of this world, far more than the monsters are.

---

### Timeline
Keys: timeline, history, year zero, what happened, outbreak, clean slate, хронология, история мира
Mode: normal
Order: 13
---
- **Jan 2031** — Cold-chain failure at the Haverly Institute, Providence.
- **Feb–Apr 2031 (Year Zero)** — Eleven weeks: Boston, New York, Toronto,
  Chicago fall. Continental government stops answering by May.
- **Aug 2031** — Surviving Northeast Command units, FEMA logistics, and a national
  guard bureaucracy fuse into the **Commission for Mobilization and Restoration**
  (CMR) and wall the Providence Line.
- **2032 — Operation Clean Slate.** Two tactical nuclear strikes at Norfolk and
  Buffalo, meant to sterilize mega-hordes. It failed and created the **Ash Belt**
  and the radiation-fed **Ashlings**.
- **2033** — The Barren Ratio becomes public. CMR passes **Restoration Order 12**
  and launches **Programme Hearth**.
- **2034** — First "voluntary" maternity service convoys. First rescue raid on one.
  The Quiet Web goes from rumor to network.
- **2035** — Mechanical guild charters the Deepworks and signs its first state
  contract. Meridian Group wins the Appalachian Spine.
- **2036** — The Saltline declares the No Landfall Law over the Halifax Roads.
- **2037 (now)** — Programme Hearth is *working*. Births are up, children are
  healthy, water is clean inside the walls. Everyone has to decide what that's worth.

---

### CMR — The Compact
Keys: CMR, commission, compact, government, state, providence line, table of nine, authority, КМР, государство, комиссия, военная фракция
Mode: normal
Order: 20
---
**Commission for Mobilization and Restoration (CMR)** — the strongest, richest,
best-fed polity on the continent, and the closest thing to a state. It holds the
**Providence Line**: a walled corridor from Boston through Providence and Hartford
down to New Haven, plus fortified nodes at Portsmouth, Albany and Philadelphia
Station. Population inside: about 310,000.

Ruled by the **Table of Nine**, a council of surviving flag officers and FEMA
administrators. Below it: the Registry, the Bureau of Concordance, the Medical
Directorate, the Provost Corps (internal police), and eleven line regiments.

From the outside, the CMR looks like civilization restored: streetlights, schools,
vaccination, bread, order. It advertises itself that way and it isn't entirely
lying. Inside, it is an ocean of paperwork over a hard patriarchy. Soldiers get
elite housing, meat rations, career ladders, and standing in a civic order that
treats men as producers and women as resources — decorations for officers, workers
for the Registry, and "contributors" to Programme Hearth.

Laws for ordinary citizens are draconian (curfew, ration crime, informant quotas).
The officer caste lives by a second, softer set of rules. Everyone knows. That
split is the crack running through the regime.

---

### The Contribution Ledger
Keys: contribution ledger, ledger, book of contribution, debt, restoration order 12, citizen debt, книга вклада, долг, реестр
Mode: normal
Order: 21
---
Every CMR citizen receives, at sixteen, a **Book of Contribution** — a grey linen
passport with their debt written in it. The debt is calculated retroactively:
calories consumed since rescue, vaccine doses, wall-hours of protection, schooling,
antibiotics. It is real accounting, and it is never paid off, because interest is
levied in "protection-days".

Repayment is **assigned, not chosen**. The Registry calculates the settlement:

- Men — **line service**. Combat, wall duty, salvage columns, or the labor cadres.
- Women — **Hearth service**. Childbearing under Programme Hearth, or clinical,
  nursing and clerical support to it.
- Rustproof individuals of either sex — **donor service**: scheduled blood and
  marrow draws.

Refusal is not a crime — it is a *deferral*, and deferral moves you to grey ration
and takes your child-visitation rights. Nobody is dragged screaming; they are
invited to sign, and the invitation cannot be declined without slowly starving.
That is the machine's genius and the setting's central horror: **the terrifying
thing is the form, not the scene.**

---

### Programme Hearth
Keys: programme hearth, hearth, population restoration, demographic program, natal, birth program, программа очаг, программа восстановления населения, демография
Mode: normal
Order: 22
---
**Programme Hearth** is the CMR's population restoration program, authorized by
Restoration Order 12 (2033). Officially: "the voluntary state service of
motherhood". Practically: a conscription with a consent form.

Structure:

- **Index panels.** Every citizen 16+ is scored for fertility, genetic load and
  disease history. The score is the **H-index**.
- **Concordance.** Marriages are assigned by algorithm (see CONCORD).
- **Natal Stations.** Medicalized pregnancy and birth in clinic-hatcheries at
  Pawtucket, Springfield and Philadelphia Station.
- **State Houses.** Children of ordinary citizens are raised collectively;
  parents hold visitation rights.
- **Rites.** Monthly medical inspections (the Reading) and the annual Day of
  Fertilized Hope.

And the part nobody in the Web likes to say out loud: **it works.** Birth rates in
the Compact are the highest on the continent, infant mortality is a third of the
Scatter's, the children are healthy and literate, and the sewers run. That
inconvenient success is why some rescued women walk back to the Line on their own
feet — and why the argument about Programme Hearth splits every camp in this
world, including the good guys.

---

### CONCORD — Assigned Pairing
Keys: concord, concordance, pairing, marriage, assigned husband, spouse, divorce, bureau of concordance, согласие, подбор пары, брак, развод
Mode: normal
Order: 23
---
The **Bureau of Concordance** pairs citizens by algorithm, not by choice. CONCORD
weighs H-index, blood and tissue compatibility, psychological profiles (docility
and stability scores included), and the standing needs of officers. Matches arrive
as a printed **Concordance Slip** with a reporting date, a housing assignment and a
ration class.

Rules of the system:

- Officers may **request** a specific match; citizens may only file an objection,
  which is reviewed by clerks who process 200 files a day.
- Marriage grants the household better housing and food, which is exactly how
  consent gets manufactured.
- **Divorce is administrative**, not personal: a petition to the Table of Nine
  through three offices. Approvals are extraordinarily rare — under forty in six
  years — and usually happen because an officer wants a different slip, not because
  a woman asked.
- Attachment outside your slip is a **fraternization offense**: grey ration for
  citizens, a quiet transfer for officers.

Clerks inside the Bureau are some of the best RP characters in the setting: they
know every horror in the system by file number, and they still stamp.

---

### Line-Bearers
Keys: line-bearer, line bearers, bearers of hope, high index, H-index, registry asset, носительница, носительницы надежд, номер линии
Mode: normal
Order: 24
---
Women with an exceptional H-index are granted the status of **Line-Bearer**
(propaganda title: "bearer of hopes"). Formally it is elite: private quarters,
protein rations, real coffee, no labor duty, medical priority, an honor guard.

Practically it is ownership by registry. A Line-Bearer is entered as a **line**,
not a person: designations like **L-114** or **Line Fourteen** replace her name in
every document, on her door, in her medical file, and eventually in how the staff
speak to her. Her schedule, diet, contact list and correspondence are managed. Her
children are registered to the line, not to her.

The cruelty here should always be rendered as bureaucracy: a polite doctor, a warm
room, a clipboard, a form titled *Voluntary Undertaking (Form H-9)* that cannot be
refused without losing everything, and a clerk who says "of course you can decline"
while writing the date.

Line-Bearers are the highest-value target for extraction raids, the highest-value
asset in the Registry's inventory, and the most complicated people in the setting:
some are prisoners, some are true believers, some are quietly running the most
effective intelligence network in the Compact from inside a velvet cage.

---

### CMR Rites — The Reading and the Day
Keys: the reading, medical inspection, day of fertilized hope, rites, holiday, ritual, medosmotr, смотр, медосмотр, день оплодотворённой надежды
Mode: normal
Order: 25
---
The CMR replaced religion with medicine and kept the liturgy.

**The Reading** — a monthly medical inspection for all citizens 16–45, held in
converted municipal halls. White curtains, numbered benches, a bell at each stage,
a printed card stamped at exit. Attendance is public and social; missing a Reading
is a ration offense. The body is treated as a state instrument that must be read
aloud: weight, index, cycle, findings — announced by a clerk to the room.

**The Day of Fertilized Hope** — every 4 March. Parades, real sugar, the year's
newborns presented on the Providence steps, the Table of Nine reading the birth
figures like scripture. Newly concorded couples are blessed on the same stage.
Children of the State Houses sing. It is genuinely beautiful, which is the point:
the Compact's propaganda works because the joy on that square is real.

**The Grey Reading** — the informal name for the follow-up appointment nobody
talks about: the one where a "finding" gets you a new assignment.

---

### CMR State Houses
Keys: state house, state houses, children, orphanage, visitation, kids, officer children, государственный дом, дети, посещение
Mode: normal
Order: 26
---
Children of ordinary citizens are raised in **State Houses** — clean, well-run
collective homes with schooling, vaccination and real food. Parents receive
**visitation rights**: two hours, twice a month, in a supervised room, plus one
festival day. Visitation is contingent on ledger standing, which means a deferral
costs you your children's faces.

Officer children live at home with their parents, in the terraced housing above the
Hartford wall, with private tutors.

That contrast — one class raising its own children, the other class visiting theirs
by appointment — is the most common flashpoint for defection, sabotage and
informer-turning inside the Compact. State House nurses know it and manage it
carefully. The most dangerous woman inside the Providence Line is not an assassin;
she is a mother with a cancelled visitation card.

---

### CMR Convoys and Rescue Raids
Keys: convoy, convoys, rescue raid, extraction, transfer column, ambush, road ambush, конвой, рейд спасения, засада
Mode: normal
Order: 27
---
The Compact moves people the way it moves grain: in scheduled columns. A **transfer
convoy** carries concorded couples, Line-Bearers, State House cohorts and donor
groups between nodes — typically two escort trucks, a bus with barred windows, a
Provost officer with the manifest, and a medic.

Because road nights are lethal, convoys stop at fortified relays. Because relays
are predictable, convoys get hit. **Rescue raids** — extraction of women and
children from transfer columns — are the signature operation of the Quiet Web,
paid for by the Scatter, guided by Longhaul couriers, and occasionally
subcontracted to Meridian by people who shouldn't be able to afford Meridian.

The CMR calls it **abduction of state assets** and prosecutes it as treason. The
Web calls it rescue. Both are describing the same twenty minutes of gunfire, and
in those twenty minutes some of the people in the bus scream to be let out and some
scream to be left alone.

This is the central conflict of the setting. Any bot, any scenario, any character
sheet can be hung off it.

---

### The Envelope — Contraband of Feelings
Keys: envelope, the envelope, love smugglers, contraband, letters, unlicensed child, black market, конверт, контрабандисты любви, письма
Mode: normal
Order: 28
---
Inside the Compact the black market isn't guns or food — the state supplies those.
The black market is **affection**.

**The Envelope** is the loose cell network that trades in it: unregistered letters
carried by hand, ten-minute meetings in boiler rooms, forged fraternization passes,
photographs, wedding rings melted from ration spoons, contraceptives, and —
the capital offense — **unlicensed children**: pregnancies conceived outside a
Concordance Slip, delivered by midwives in basements and papered over with a stolen
line number.

Currency: Registry stamps, medical exemptions, and blank forms. The Envelope's most
valuable asset is a corrupt clerk, not a gunman.

It is antagonist and ally at once. Some Envelope brokers are romantics running a
postal service for the doomed; others sell out lovers to the Provost Corps for
ration credit, or ferry women into far worse hands than the CMR's. If a character
needs a way to want something illegal in the Compact, the Envelope is that door.

---

### The Quiet Web
Keys: quiet web, the web, mother, matri, women faction, knots, needles, matriarchy, тихая сеть, женская фракция, матерь, узел
Mode: normal
Order: 30
---
A network, not a place. The **Quiet Web** is ~11,000 people scattered across the
continent in **knots** — cells of 15 to 60, hidden in reservoir stations, convents,
ski lodges, grain elevators, drowned suburbs. No capital, no standing army, no flag.
If one knot falls, it knows only two others.

Composition: about 90% women, the rest children and older women. Adult men live
here only if they were born here and haven't reached the Threshold.

Purpose: survive, and take women and children out of the Compact. They run
extraction, safe houses, forged ledger pages, and clinics. They are the primary
enemy of Programme Hearth and the reason CMR convoys travel armed.

Governance: local mothers-of-knot decide, **needles** (couriers-enforcers) carry
Mother's word between them.

Culture: hard matriarchy, communal childrearing, women loving women as the norm
rather than the exception, salvage medicine, and an unsentimental view of violence.
Also: internal politics as vicious as any state's — extraction quotas, blame for
lost knots, and a growing faction that thinks Mother's rules are eating the Web
alive.

---

### The Web's Laws
Keys: web law, threshold, boys, abortion, rules of the web, ejection, outside rule, законы сети, порог, аборт
Mode: normal
Order: 31
---
Four laws, recited at every knot:

1. **Girls stay.** Any girl who reaches a knot has sanctuary for life, no debt, no
   service, no conditions.
2. **The Threshold.** Boys born inside the Web live with their mothers until
   puberty. Then the mother chooses: release the boy — usually to the Mechanical
   guild as an apprentice — or leave with him. Both choices break something. Most
   mothers walk him to the Deepworks gate and come back alone.
3. **The Body is Yours.** Termination is available on demand, performed by trained
   knot medics; nobody may be pressured either way. Web clinics are the safest in
   North America and the CMR calls them abattoirs.
4. **The Outside Rule.** A Web woman who conceives by a Compact soldier is carried
   through the pregnancy, fed, protected, delivered — and then she is out. The child
   may stay if it's a girl. She may not. This law is *not* presented as noble: it is
   the Web's original sin, it drives defections back to the Line, and half the
   younger knots want it repealed.

The laws exist because six years ago the alternative was extinction by
infiltration. Everyone in the Web knows a woman the laws destroyed.

---

### The Mother
Keys: mother, the mother, matria, who is mother, leader of the web, матерь, кто такая матерь
Mode: normal
Order: 32
---
Nobody knows what she looks like. **Mother** speaks through needles, hand-copied
letters, and short numbers-station broadcasts on 4625 kHz. Her voice on the tapes is
a woman's, unhurried, mid-forties, with a flat Great Lakes accent — and there are
at least three different such voices in circulation.

Working theories inside the Web: a former Providence obstetrician who lost her
license and her daughter to the Registry; a committee of nine knot-mothers using one
name; a Line-Bearer still living inside the Compact who defected in place; or
somebody who died in 2034 whose letters are now written by her secretaries.

Mother's authority is real regardless of which is true, and that is the interesting
part: the Web obeys an office, not a person. A GM can keep Mother permanently
offstage, reveal any of the theories, or hand a player character her letters and
let them discover they're the only one still writing them.

---

### Mechanical
Keys: mechanical, mechanikal, engineers, guild, deepworks, patcher, wright, ranks, механикал, инженеры, ремонтик, гильдия
Mode: normal
Order: 40
---
**Mechanical** is a guild, not a country: about 6,000 technicians holding the things
that still work. Metro tunnels under Chicago and Toronto, the Deepworks (a flooded
subway and rail-yard complex re-pumped and lit), two hydro stations on the Niagara
and Saguenay, a working machine shop in Hamilton, a pharmaceutical line in
Kalamazoo, and three sealed pre-outbreak laboratories.

They are enthusiasts as much as survivors: people who fix things because the
alternative is thinking. Culture is patriarchal in a mundane, workshop way — men
hold most senior chairs by habit and inertia, not by law — and it is the one place
on the continent where a boy handed over at the Threshold is genuinely raised and
taught rather than used. Web mothers bring their sons to the Deepworks gate; the
guild takes them, names them, trains them.

**Ranks:** Patcher (apprentice, small jobs: pumps, seals, radios) → Fitter →
Wright → **Engineer** (may sign state contracts) → Chartered Engineer → the
**First Engineer**, elected for life by the chair-holders.

Currency: **bolts** (stamped guild tokens) redeemable for labor-hours. A Mechanical
work order is the closest thing to law that anyone outside the Compact respects.

---

### Mechanical's Conflict
Keys: mechanical conflict, charter, open shop, site kestrel, first engineer, guild politics, конфликт механикал, кестрел
Mode: normal
Order: 41
---
The guild is tearing along three seams.

**Charter versus Open Shop.** Engineers signing CMR contracts get steel, fuel,
antibiotics and protection — and what they build are convoy trucks, wall generators
and the cold-chain for the Natal Stations. The Open Shop faction sells to everyone
and starves in dignity. The Charter side is winning, which means the guild's best
work now keeps Programme Hearth alive.

**The sons.** Nearly a third of apprentices came through the Threshold from the
Web. They grow up building the machinery that hunts their mothers' knots. Some find
out. The guild's official position is that a work order has no politics — a line
that gets less convincing every year.

**Site Kestrel.** A sealed Haverly satellite lab under Kalamazoo, cracked open in
2036 and closed again the same week by order of the First Engineer. Whatever is
inside — original strain records, a vaccine candidate, or proof of who authorized
the trial — three parties are now bidding for it: the CMR Medical Directorate, the
Sanitars, and Meridian. The First Engineer has refused all three, and there is
already one dead Chartered Engineer over it.

---

### Meridian Group
Keys: meridian, PMC, mercenaries, contractors, kettle hill, chvk, private military, меридиан, чвк, наёмники
Mode: normal
Order: 50
---
**Meridian Group** — the single largest concentration of military power in former
North America, and it belongs to nobody. Around 9,000 personnel, held together by
payroll, doctrine and paperwork that actually gets filed. Headquarters at **Kettle
Hill**, a rebuilt arsenal on the Appalachian Spine, with forward camps in the
Shenandoah, at Watertown, and outside Montréal.

They take contracts. Cash, fuel, ammunition, medicine, machine tools. They have
cleared hordes for the CMR, escorted Scatter grain, sold overwatch to the Saltline,
and — for the right price, off the books — escorted a Web extraction. Nothing
personal, and nothing forgiven either: default on Meridian and the next thing you
negotiate with is artillery.

Both women and men serve, in all roles, though men outnumber women roughly three to
one. Positions run from laundry, kitchen and clinic staff up through fireteam,
armor, artillery and recon command; a cleaner can test into a rifle billet, and
does. Competence is the only recognized virtue. Fraternization, marriage and
pregnancy are all governed by hard health-control regulations, and Meridian
enforces its own rules more consistently than the CMR enforces any of theirs.

---

### Meridian Family Regulations
Keys: meridian rules, meridian family, pregnancy meridian, health control, article 9, правила чвк, беременность чвк
Mode: normal
Order: 51
---
Meridian treats bodies as materiel: quarterly panels, mandatory contraception
implants, blood-titer logs, and immediate quarantine on any Rust exposure. Sex is
regulated, marriage is rare, and the company has been known to accept
"companionship" as part of a CMR payment package — an arrangement that disgusts
half the officer corps and is signed anyway.

**Two contractors conceive:** permitted to form a household under conditions. The
child lives with both parents to age three, then enters the **Kettle Hill school**:
company education, company trade, one home week a year. Most of those children
enlist. The company considers this a benefit and it is not entirely wrong.

**Mother from the Compact, father a contractor:** the case goes to the Director
personally. Early term — termination, no discussion. Late term — the pregnancy is
carried, and then both mother and child are returned to the CMR under a
notification of return, and the contractor is **discharged without reference**,
which on this continent is close to a death sentence. The company's reasoning is
cold and sound: a CMR-registered child inside Kettle Hill is a legal hook the Table
of Nine could hang a war on.

Nobody at Meridian pretends these rules are kind. They are written down, applied
identically to a colonel and a cook, and that consistency is exactly why people
choose Meridian over the Compact.

---

### Project Bell
Keys: project bell, meridian secret, secret weapon, choir, horde control, проект колокол, секрет чвк
Mode: normal
Order: 52
---
Meridian keeps one thing off every manifest, and the rumors are all wrong in
different directions: a vaccine, a cure, a nuke, a functioning aircraft.

The truth: **Project Bell**. In 2035 a recon element took a live **Choirmaster** —
an apex infected that broadcasts a fungal-acoustic signal hordes obey — and did not
kill it. It is alive in a vault under Kettle Hill, wired to speakers, kept in
brine, fed. Meridian has learned to record fragments of its signal and replay them
from truck-mounted arrays.

Capability, as of Year Six: they can **move a horde** — badly, at ranges under two
kilometers, with a 30% chance the horde turns on the array instead. Three test runs
have been conducted on inhabited targets. Two were logged as "contract losses" and
one as a weather event.

Implications, if it ever gets out: whoever holds Bell can aim the apocalypse. The
CMR would go to war for it, the Sanitars would call it heresy and mean it, the
Mechanical guild could improve it, and Site Kestrel probably explains how the
signal works. Bell is the setting's loaded gun on the mantelpiece.

---

### The Longhaul
Keys: longhaul, courier, couriers, delivery, legs, three weights, road, cargo, дальний ход, курьеры, курьер
Mode: normal
Order: 60
---
Mail, medicine, machine parts, seed stock, blood samples, letters, ashes — the
**Longhaul** carries it. About 2,200 sworn couriers ("legs") working a route map of
relays, cached ladders, zip-lines and rooftop lanes that no faction fully owns.
They are the continent's nervous system, and everybody's neutrality depends on them
staying boringly reliable.

**The Three Weights**, sworn at induction: *carry what you accepted; open nothing;
name no client.* A leg who breaks a Weight is delisted, and the map — every relay
code, every cache — is closed to them. That is worse than being shot.

Craft: minimum weapons, maximum traversal. Legs move at dawn and dusk, read wind
for spore drift, rope down elevator shafts, cross river ice, and know which mile of
which highway has a Nightblood nest. Load balance is religion: an overloaded leg
falls, and a fall is a death sentence with a delivery attached.

Standing tension: the Web pays legs to guide extractions, the CMR pays legs to
report them, and the Envelope pays legs to carry letters that get people executed.
Neutrality is a business model, not a morality, and every courier eventually has a
sack they should have opened.

---

### The Scatter
Keys: scatter, holdouts, free settlements, survivors, villages, signal fair, tithe, осколки, выжившие, поселения, ярмарка
Mode: normal
Order: 61
---
The **Scatter** is everyone else: some 400 independent holdouts, from a nine-person
lighthouse to Ferryman's Bend on the Ohio with 2,400 people, a school and a
militia. No central authority, no shared law, only trade routes, feuds, marriages
and the **Signal Fairs** — three annual truce markets (Ferryman's Bend, Cold Ash,
Fort Loudon) where all factions walk in unarmed and nobody quite behaves.

Life is agriculture, salvage, fishing and fear. They fix what Mechanical will sell
them, hire Meridian when they can afford a week of it, and pay tithes to whoever is
strongest that season.

The ugly part: safety costs. Some holdouts pay the CMR in grain. Some pay in
salvage. Some pay in **names** — pointing Provost patrols at a Web knot, or handing
back a woman who ran, because a settlement of 300 cannot fight eleven regiments and
the elders have arithmetic to do. Others have burned for refusing. The Scatter is
where this setting's moral questions get answered by ordinary people with no
leverage, and it is the best place to set a story that isn't about soldiers.

---

### The Sanitars
Keys: sanitars, sanitary corps, medics, white trucks, protocol 7, quarantine, cull, санитары, белые грузовики, протокол 7
Mode: normal
Order: 62
---
The **Sanitary Corps** was the military and federal medical service. When the chain
of command died, its doctrine didn't. Roughly 1,400 personnel in 40 nomadic convoys
of white-painted trucks, still wearing the caduceus, still keeping impeccable
records, still saving people whether or not they consent.

**Protocol 7** governs everything: a settlement is surveyed, screened, and
*resolved*. Clean people are inoculated, tattooed with a quarantine cohort code and
"escorted to secure care" — meaning taken. Stage-1 cases get the Bleach kit,
sometimes by force. Anything past Stage 2, and anyone who refuses screening, is
culled and logged. They bury properly, they write to the next of kin, and they
believe every word of the letter.

They also collect **Rustproof donors** — blood, marrow, tissue — for a vaccine
program that has been eighteen months away for four years. Their donor wards are
clean, quiet, humane in every detail except the locked door.

The Sanitars are the CMR's mirror: the same "we saved you, therefore you are ours"
logic without the ledger, the flag, or the self-interest. The two factions dispute
jurisdiction constantly, and both want Site Kestrel. Sanitar convoy commanders are
the setting's best tragic antagonists — genuinely good doctors doing monstrous
arithmetic.

---

### The Saltline
Keys: saltline, fleet, atlantic, ocean, halifax, no landfall, divers, ships, солевая линия, флот, атлантика, халифакс
Mode: normal
Order: 63
---
The Atlantic saved anyone who could float. The **Saltline** is a flotilla of about
70 hulls — container ships, two drilling rigs, trawlers, one hospital ship —
moored in the Halifax Roads and off Nantucket, with maybe 12,000 people aboard. It
controls diesel refining, salt, fish protein, and every rumor about whether Europe
still answers.

The **No Landfall Law** (2036): no crew member sets foot ashore except at licensed
quay markets, and returning boats are quarantined for nine days. Enforced by
scuttling. It is why the fleet is the healthiest population on the continent and
why the fleet is hated.

Their trade is coastal: salvage from drowned cities, cargo brought out by divers
working among **Drowned** and **Hullers**, and passage — the only reliable way to
move people up and down the seaboard past the Ash Belt. That makes the Saltline the
Web's escape route and the Envelope's ferry, both for a price paid in salt and
antibiotics.

They also hold the setting's largest open question: three ships left east in 2034
and one radio fragment came back in 2036, in Portuguese, saying only that landfall
was refused.

---

### Faction Relations
Keys: relations, politics, who hates whom, alliances, diplomacy, отношения фракций, политика
Mode: normal
Order: 70
---
- **CMR ↔ Quiet Web:** open war, undeclared. Treason charges, extraction raids,
  and a quiet trade in returned women neither side reports.
- **CMR ↔ Meridian:** business. The Compact hires the company and fears it;
  Meridian would rather be paid than rule.
- **CMR ↔ Sanitars:** jurisdictional cold war. Two rescue-machines competing for
  the same bodies.
- **CMR ↔ Mechanical:** the Compact's most important supplier relationship, and its
  biggest strategic vulnerability.
- **CMR ↔ Saltline:** tolerated trade, mutual embargo threats over quay taxes.
- **Web ↔ Mechanical:** the Threshold pipeline. Grief and gratitude, no treaty.
- **Web ↔ Saltline:** paid alliance. Boats out, no questions, cash up front.
- **Web ↔ Sanitars:** hatred. The Sanitars screen knots and take everyone.
- **Meridian ↔ Sanitars:** mutual disgust, occasional medical contracts.
- **Longhaul ↔ everyone:** paid neutrality, quietly compromised in all directions.
- **Scatter ↔ everyone:** the ground everyone else walks on, and pays with.
- **Envelope ↔ CMR:** parasite and host.

---

### Common Infected
Keys: zombie, zombies, infected, husk, drifter, skitter, common, walkers, зомби, заражённые, ходячие
Mode: normal
Order: 80
---
Six years of decay produced grades, and everyone uses the same words.

**Husks** — long-dead, mineral-crusted, slow, deaf-ish, driven by vibration and
smell. Dangerous only in numbers, which is how they're always found. A husk's crust
blunts blades; crush weapons work better.

**Drifters** — turned within the last months. Still soft, still fast enough to
close ten meters, still wearing their clothes. Most survivors have killed someone
they recognized as a drifter.

**Skitters** — torso-and-arms remnants under cars and in stairwells. Silent,
patient, and the reason nobody in this world walks with their hands free.

**Behavior:** infected orient on sound first, then movement, then smell. They do
not eat for nutrition; the fungus drives them to break skin and spread spores.
Standing water, brine and heavy rain calm them. Fire enrages a crowd rather than
scattering it. A body left uncrushed will re-animate twice more before the lattice
fails, so the road etiquette is: skull, then spine.

---

### Clickers
Keys: clicker, clickers, blind, echolocation, plate face, щелкуны, щелкун
Mode: normal
Order: 81
---
**Clickers** are what happens when the fungal lattice takes the face. Skull plates
fuse over the eyes and the jaw hyperextends; they hunt by clicking their teeth and
reading the echoes off surfaces, and they are frighteningly accurate at it.

Traits: totally blind, sprint in straight lines, grapple instantly and go for the
throat, and travel in threes and fours because the clicking coordinates them.

Countermeasures: absolute stillness works better than cover — they will pass within
arm's reach of a person who does not breathe. Running water, generator noise and
wind chimes blind them. Thrown noisemakers are the standard answer. Never fight a
clicker in a stairwell or a bathroom: hard surfaces are its eyes.

They nest in libraries, cinemas, parking structures — soft-furnished or hard-walled
places where sound behaves predictably. A clicker nest is a soundscape puzzle, not
a firefight.

---

### Bursters
Keys: burster, bursters, bloater, exploder, spore bomb, gas, взруны, взрун
Mode: normal
Order: 82
---
**Bursters** are bodies that kept feeding. The lattice traps gas in a swollen
abdomen and thorax until the skin splits into a rust-lace pattern; internal
pressure keeps them upright and slow, and a hit anywhere below the sternum vents
the whole thing.

The burst is not fire — it is a fifteen-meter aerosol of spores and caustic fluid,
Stage-0 exposure to everything downwind without a filter. Veterans consider a
burster more dangerous than an Anvil, because an Anvil kills the person who fought
it and a burster kills the squad, the relay, and whoever comes through next week.

Rules of engagement: kill at range, kill upwind, or don't. Fire ignites the gas and
sterilizes some of the spores, which is why burn teams exist and why they are all
slightly insane. Bursters cluster near old feeding grounds — hospitals, stadiums,
the Ash Belt fences — and a mature one sitting in a doorway is a lock on the
building.

---

### Anvils
Keys: anvil, anvils, giant, giants, brute, big one, charger, гиганты, гигант, наковальня
Mode: normal
Order: 83
---
**Anvils** are the giants: two and a half meters, 300 kilos, the lattice grown into
overlapping plate along the skull, shoulders and forearms. Formed from bodies that
were large and heavily exposed, usually near old strongpoints — a gym, a barracks,
a stadium tunnel.

They charge in straight lines, break through cinderblock, and swing salvage —
a door, a bumper, a length of rail. Rifle fire spalls off the plate; the soft
lines are the armpit, the back of the knee and the throat, and getting to any of
them requires someone else to be the bait.

Standard answers: drop it into a stairwell, crush it with mass, or burn it and wait
twenty minutes. A settlement with an Anvil in the neighborhood does not fight it —
it moves, or it hires Meridian, or it feeds the Anvil something and hopes it settles.

Anvils that survive years become **Cornerstones**: half-immobile, plate grown into
the floor, functioning as living walls that hordes gather behind.

---

### Drowned
Keys: drowned, water zombie, hullers, kelper, swimmer, underwater, harbor, водные зомби, утопленники
Mode: normal
Order: 84
---
Salt water preserves. Bodies that went into the Atlantic in Year Zero are still
articulate, waxy and appallingly strong, and there are millions of them.

**Drowned** — shallows and harbors, walk the bottom, come up ladders and boat
ramps. They do not need to breathe and they do not tire. A tide change delivers them
to a beach like cargo.

**Hullers** — the lattice fuses with barnacles and steel; they attach to hulls,
rigs and pier pilings and wait for vibration. Every Saltline diver has a huller
story and half of them are missing fingers.

**Kelpers** — deep-water, tangled in weed and net, functionally blind, grip like a
vise. The reason salvage diving is paid in antibiotics.

Brine suppresses spore release, so a drowned bite is *less* likely to infect than a
land bite — around one in three. Nobody finds this comforting. Water fighting rules:
no fire, no electricity, never grapple, and never swim over a drowned field at
slack tide.

---

### Resistant Strains
Keys: resistant, immune zombie, slag, grounder, sower, ashling, reliquary, fire immune, electro, иммунитет, шлак, заземлённые, пепельные
Mode: normal
Order: 85
---
The lattice adapts to whatever kept killing it. Regional variants:

**Slag** — burn lines and refinery districts. The crust vitrifies into black glass;
fire does nothing, blades chip. Kill by crushing or by dropping them.

**Grounders** — substations, flooded tunnels, wet industrial zones. The lattice
grows a carbon-wet mesh that shunts current straight to ground. Shock mods,
electrified fences and stun batons are useless; a Grounder will walk through a live
rail smiling.

**Sowers** — anywhere biological or chemical agents were used, including the CMR's
own defoliant lines. Chemically inert to gas, defoliant and every antifungal in
common use, and they carry hyper-active spore sacs on the back that seed new blooms
as they walk. Killing one badly plants a garden.

**Ashlings** — the Ash Belt at Norfolk and Buffalo. Radiation-fed: the lattice
metabolizes ionizing exposure and glows faintly under the crust. Unbothered by rads
that kill a human in a week, which is why nobody can hold the Ash Belt.

**Reliquaries** — old, complete, plated in lamellar bone-fungus that small arms
cannot penetrate at all. Immune to bullets in any practical sense. Answers: crush
weapons, vehicles, pits, or leave. Named because they look like reliquaries of
saints, and because people pray when they see one.

---

### Nightbloods
Keys: nightblood, night, darkness, curfew, volatile, night law, ночные, ночь, комендантский час
Mode: normal
Order: 86
---
Some infected can't tolerate light at all. **Nightbloods** shelter in basements,
tunnels and dark cores by day and come out at dusk: fast, agile, able to climb, with
skin that blisters and smokes in direct sun. They hunt by movement and heat and they
scream to bring others.

This creates the **Night Law**, obeyed by every faction: at dusk you are inside
something, up something, or dead. Walls, roofs, third floors, boats, and above all
**UV** — ultraviolet lamps and salvaged tanning tubes are the single most valuable
non-medical trade good on the continent. A working UV bar over a doorway is worth a
truck.

Consequences that shape everything: the CMR's curfew is genuinely protective and
also politically convenient; Longhaul routes are built around dusk arrival times;
the Scatter measures wealth in lamp-hours; and any scene set at night carries
automatic tension without a single monster on screen.

Nightbloods will not cross an open, moonlit field. They will absolutely follow you
down a corridor.

---

### Choirmasters
Keys: choirmaster, apex, horde control, signal, choir, conductor, хормейстер, апекс
Mode: normal
Order: 87
---
Rare, maybe a dozen on the continent. A **Choirmaster** is an infected in which the
fungus reached full fruiting: a body half-collapsed inside a mineral trellis grown
out of its own ribs, largely immobile, surrounded by a permanent congregation.

It broadcasts. The signal is part low-frequency sound, part spore chemistry, and
infected obey it — they gather, they migrate, they go quiet, they surge. Wherever a
Choirmaster settles, a mega-horde accretes within months, which is how New York,
Toronto and Norfolk became no-go zones.

Humans exposed at close range report vertigo, nosebleeds, a compulsion to walk
toward it, and dreams afterward. There is no evidence the thing is intelligent, and
nobody who has stood in a congregation believes that.

Meridian has one in a vault (see Project Bell). The Sanitars want them destroyed as
a matter of doctrine and have lost two convoys trying. Mechanical wants to record
one. The CMR pretends they aren't real, because admitting hordes can be *aimed*
would change every wall it has built.

---

### Crafting
Keys: craft, crafting, weapon mods, workbench, blueprint, repair, durability, крафт, модификации, верстак
Mode: normal
Order: 90
---
Nothing is manufactured; everything is modified. Crafting in this world is dirty,
loud, specific, and it fails.

**Tiers:** field bodge (tape, wire, 10 minutes, breaks fast) → bench work
(vise, files, charcoal forge, half a day) → **shop work** (Mechanical tools, power,
a Wright's signature, days).

**Materials that matter:** spring steel from car suspension, aluminium from window
frames, copper from wiring runs, brake fluid and pool chemicals for incendiaries,
car batteries for shock rigs, salt, epoxy, surgical tubing, dental resin, and
above all **filters** — respirator cartridges are consumables and everything else
is negotiable.

**Common mods:** bleeder (glass and razor teeth), crusher (rail steel, engine
mass), burner (thickened fuel — useless on Slag), shocker (battery, coil — useless
on Grounders), venom (fungicidal paste that softens the lattice, useless on
Sowers), and the priceless **UV rig**.

**Rules that keep it honest:** every weapon has durability and every swing costs
it; sharpening is a nightly ritual; a broken haft mid-fight is the most common way
people die; and mods make noise, which brings company. Anything genuinely good
requires a bench, and benches belong to somebody.

---

### Weapons and Ammunition
Keys: gun, guns, ammo, ammunition, rifle, weapons, firearms, оружие, патроны
Mode: normal
Order: 91
---
Guns exist and are usually the wrong answer. Six years of shooting stripped the
continent of factory ammunition; what circulates now is **rehandloaded** — reformed
brass, cast lead, black powder or salvaged smokeless, unreliable primers. A round
that misfires in a stairwell kills you as surely as an Anvil.

Availability by faction: Meridian has real ammunition and a press line; the CMR has
standardized 5.56 for line regiments and grey-market everything for citizens; the
Saltline has shotguns and flare guns; the Web has whatever it took off a convoy;
the Scatter has hunting rifles and eight rounds; the Longhaul carries a pistol they
hope never to fire.

Prices: one 5.56 round trades for a day's bread. One 12-gauge shell for a jar of
antibiotics if it's loaded with slug.

Which is why melee, traps, choke points, ladders, fire and noise-discipline do most
of the killing in this setting, and why the sound of a gunshot in a scene means
somebody has already lost control of the situation.

---

### Traversal and Parkour
Keys: parkour, climbing, traversal, rooftops, movement, jump, route, паркур, крыши
Mode: normal
Order: 92
---
The ground belongs to the dead, so people learned to live a floor up. Every
inhabited town in this world has a second, aerial city: plank bridges between
windows, cached ladders pulled up at dusk, knotted ropes, zip-lines from bell
towers, scaffold stairs, and doorways deliberately collapsed to force traffic
upward.

Practical craft: read a wall before you climb it (six years of frost has loosened
everything), test fire escapes with weight not hands, never jump a gap you haven't
crossed in daylight, keep both hands free — which means the load goes on the back
and the weapon goes on a sling. Rooftop routes are named and traded like street
addresses; Longhaul legs sell them.

Bodies matter: a 40-kilo pack changes what you can climb, ankles are the injury
that ends careers, and cold hands are why winter kills more couriers than infected.

In scenes, use it. A chase in this setting is vertical, and the tension is never
"can I outrun it" — it's "will the gutter hold".

---

### Economy and Currency
Keys: money, currency, trade, chits, salt, grams, bolts, barter, economy, экономика, деньги, торговля
Mode: normal
Order: 93
---
No banknotes. Five things function as money:

- **Grams** — sealed antibiotics, the continental reserve currency. Priced by the
  gram, counterfeited constantly.
- **Chits** — CMR ration scrip. Worthless outside the Compact except as proof you
  can get inside it.
- **Bolts** — Mechanical guild tokens redeemable in labor-hours. The most trusted
  paper on the continent because the guild always honors them.
- **Salt and fuel** — Saltline issue, traded by weight and liter, the standard for
  bulk deals.
- **Filters, lamp-hours and UV tubes** — the survival currencies. Nobody sane
  trades away their last cartridge.

Also traded: seed stock, batteries, dental supplies, reading glasses, coffee (a
luxury bordering on religion), and paper — blank official forms are worth more than
gold inside the Compact, because a blank form is a person's life rewritten.

Debts are enforced socially, not legally, everywhere except the CMR, where they are
enforced by the Ledger and the Provost Corps.

---

### Geography
Keys: geography, map, regions, where, territory, locations, география, карта, регионы
Mode: normal
Order: 94
---
- **The Providence Line** — CMR core: Boston–Providence–Hartford–New Haven, walled
  and lit, plus nodes at Portsmouth, Albany, Philadelphia Station.
- **The Scar** — the New York–New Jersey megaruin. A Choirmaster, a mega-horde, and
  more intact salvage than anywhere else. Nobody stays a second night.
- **The Appalachian Spine** — Meridian country: ridges, tunnels, Kettle Hill,
  and the only safe north–south road corridor, tolled.
- **The Deepworks** — Great Lakes industrial belt: Chicago and Toronto tunnels,
  Hamilton shops, Niagara hydro. Mechanical territory, lit and pumped.
- **The Ash Belt** — Norfolk and Buffalo strike zones. Rads, glass, Ashlings, and
  the best untouched salvage on the continent for anyone willing to die of it.
- **The Quebec Corridor** — Montréal to Saguenay: cold, thin population, Web knots,
  Meridian forward camps, hydro power.
- **The Halifax Roads** — Saltline anchorage and the busiest market in the north.
- **The Shelf** — the drowned coastal cities and the Atlantic itself: Drowned
  fields, dive salvage, the only fast travel, and the last route east.
- **The Interior** — everything west of the Mississippi: contact is intermittent,
  rumors say Denver holds, and nobody sends caravans that far anymore.

---

### Slang
Keys: slang, jargon, terms, dictionary, glossary, lingo, сленг, жаргон
Mode: normal
Order: 95
---
- **Rusted** — infected, past saving. *"He's rusted, walk on."*
- **Bleached** — survived a Bleach kit; also means sterile.
- **Rustproof** — naturally immune. Said with envy and pity.
- **Grey ration** — punishment diet in the Compact; also a verb: *to be greyed*.
- **Slipped** — assigned a Concordance Slip. *"She got slipped to a major."*
- **Lined** — made a Line-Bearer. *"They lined her at nineteen."*
- **Read** — attended the monthly inspection. *"I'm read through March."*
- **Knot** — a Quiet Web cell.
- **Needle** — a Web courier-enforcer.
- **Leg** — a Longhaul courier. **Weight** — a courier's oath, or their cargo.
- **Bolt** — Mechanical token. **Patcher** — junior technician, or an insult.
- **White truck** — a Sanitar convoy. *"White trucks at the mill."* clears a town.
- **Lamp-hours** — wealth. **Skull-and-spine** — do it properly.
- **Quiet town** — a settlement that pays its tithe in names.
- **Landless** — a Saltline crewman who broke the No Landfall Law.

---

### TONE AND LIMITS
Keys: tone, limits, content, style, guidelines, how to write
Mode: constant
Order: 99
---
**Audience: adults, 18+.** This setting is about institutional coercion, and it
works only if the horror stays institutional.

Write the machine, not the abuse. The frightening thing is the clerk who says "of
course you may decline" while dating the form; the warm clinic with the locked
door; the parade where the joy is real; the doctor who is genuinely kind and still
files the report. Scenes of violence, grief, fear and pressure belong here. Explicit
sexual content does not need to be on the page for any of this to land — keep
intimacy off-screen or implied, and never sexualize the coercion itself.

Hard limits, non-negotiable in any bot built on this world: **no minors in sexual
or romantic content, ever** — children exist in this setting as children, in State
Houses, at the Threshold, in Kettle Hill classrooms, and that is all. No
instructional detail for real-world weapons, explosives or drugs. No real-person
depictions.

Keep the moral weight balanced. Programme Hearth works, and that is not an
endorsement. The Quiet Web saves people, and its Outside Rule ruins some of them.
Meridian is fair and sells atrocity by the hour. The Sanitars are good doctors doing
monstrous arithmetic. Nobody in this world gets to be simply right, and any
character who thinks they are is telling you something about themselves.

---

### Scenario Seeds
Keys: scenario, hooks, plot, story ideas, seeds, starters, quest, сценарии, завязки
Mode: normal
Order: 100
---
- **The Slip.** A Concordance Slip arrives with your character's name and a
  stranger's. Reporting date: nine days. The Envelope offers a forged medical
  exemption at a price that will cost someone else theirs.
- **Twenty Minutes.** A rescue raid hits a transfer convoy. Half the women in the
  bus run for the treeline. One refuses, because her third child is inside the Line
  and healthy.
- **Line Fourteen.** A Line-Bearer is extracted successfully and asks to go back —
  and she is the best intelligence asset the Web has ever had.
- **The Threshold.** A Web mother walks her twelve-year-old son to the Deepworks
  gate. The Mechanical intake clerk needs a name for the boy. She hasn't decided
  what to tell him yet.
- **Form H-9.** A Bureau clerk finds two identical line numbers in the Registry.
  Somebody is running unlicensed children through the system — or laundering
  extractions into it.
- **White Trucks at the Mill.** A Sanitar convoy arrives at a holdout of 200 with
  antibiotics, a screening schedule, and Protocol 7. The elders have until dawn.
- **Two Kits, Three Bites.** Stage 1, six hours, two Bleach kits, three people, and
  one of them is the only mechanic who can restart the pump.
- **The Sack.** A Longhaul leg carries sealed cargo that is warm and moving. Three
  Weights say open nothing.
- **Slack Tide.** A Saltline dive contract over a Drowned field, at the one hour it
  can be worked, for salvage the Mechanical guild will pay a Wright's fee for.
- **The Bell Test.** A holdout is destroyed by a horde that arrived in a straight
  line, against the wind, at 0300. Somebody was recording from a ridge.
