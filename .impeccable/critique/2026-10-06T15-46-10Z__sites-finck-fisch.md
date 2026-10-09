---
target: site F&F (sites/finck-fisch)
total_score: 18
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 4
target_identity: "file:C:\\Users\\nadja\\ff-atelier\\sites\\finck-fisch"
timestamp: 2026-10-06T15-46-10Z
slug: sites-finck-fisch
---
Method: dual-agent (A: design review · B: detector + browser)

## Design Health Score — 18/32 (Persuade; heuristics 7, 10 n/a)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 2 | Looping film without controls; nav hides on scroll |
| 2 | Match real world | 3 | Clear French; "Direction atelier/clair/rétro", "Pages villes" are studio jargon |
| 3 | User control | 2 | Autoplay film >5 s without pause (WCAG 2.2.2); smooth-scroll hijack |
| 4 | Consistency | 2 | Film shows old site/eyebrows; pill inputs in a hairline-square system |
| 5 | Error prevention | 3 | Form validation ok |
| 6 | Recognition | 2 | Price at ~79% depth; 72 h condition split; demos can't be opened |
| 7 | Flexibility | n/a | landing page |
| 8 | Aesthetic/minimal | 2 | Clean but generic, redundant, low tonal range |
| 9 | Error recovery | 2 | Form hands off to Mail app, no in-page confirmation |
| 10 | Help | n/a | FAQ adequate |

## Design specificity
Content is studio-specific (3-proposals plate, 0-72 h ruler, refusals manifesto, written price). Visual language is the "premium dark agency" default: chrome-gradient monogram + sheen, radial halo, grain, Cormorant Light on #0a0b0d, grey paragraphs, mono 01/02 labels, fade-reveal on every heading, dark video band. Brand is black ink on cream paper; site renders it silver on black; the only register none of the 12 demos use.
Detector: source scan clean; built-page 51 static findings all false positives (contrast vs #ffffff, compiled padding); browser overlay: radial-spotlight-glow (.hero-halo), oversized-h1 (104 px), line-length x5 (94-99 chars), layout-transition (misattributed).

## Priority issues
- [P1] Visual identity contradicts brand and audience → rebuild in the logo's ink-and-paper world, flat ink monogram, colour from client work. (/impeccable shape, /impeccable colorize)
- [P1] No call to action, worst on iPhone (Contact 52x24 hides on scroll, phone only in 12 px footer, ctaTitle never rendered) → hero action, closing contact block, sticky mobile Appeler/Écrire bar. (/impeccable layout)
- [P1] Film is a trailer of the page itself, unreadable on iPhone (≈4 px text) → remove from homepage or replace with real footage. (/impeccable distill)
- [P1] Honesty overdose reads as "nothing is real" (12x "démonstration", "provisoire" x3, no faces/names) → state once, show the two partners. (/impeccable clarify)
- [P2] Monotone section rhythm, inverted h1 emphasis (72 h dimmest) → vary scale/surface, strongest ink on the promise. (/impeccable typeset)

## Persona red flags
- Martine, 55, baker, iPhone: thin grey serif on black, no number/button, unreadable film, Contact vanishes, mailto opens Mail → leaves.
- Skeptical comparer: no clients/faces/address, provisional everything, demos not openable.
- Distracted mobile user: autoplay loop, disappearing nav, illegible 170 px thumbnails.

## Minor
Pill inputs vs square system; tap targets 24 px; service pages buried; "Site réalisé par Finck & Fisch" on own site; meta-copy ("Film muet"); Offre "–" marks near invisible; monogram 3.3 s to settle.

## Questions
1. Brand is ink on paper — why is the shop window the one colour no demo uses?
2. What if the homepage re-rendered its own hero in the three directions?
3. Would Martine call with two faces, a first name and a big phone number on screen one?
