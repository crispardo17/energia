# A1 curriculum and colorful route update

A1 now has 40 lessons in 10 units. Each lesson includes a Spanish explanation, four vocabulary items, a contextual reading, a distinct listening recording, eight automatically scored questions (two per skill), and an oral/written production task for self-practice. A1 has 320 practice items, a 200-item exam/review source bank and 60 recordings. Audio uses a synthetic English voice.

## Units

1. Hello, world!: greetings, names/spelling, origins, requesting repetition.
2. Números que conectan: ages/numbers, phone numbers, days/dates, times.
3. Mi gente y yo: family, occupations/articles, possession, descriptions.
4. Un lugar para llamar hogar: rooms, prepositions, plurals/demonstratives, housing questions.
5. Así es mi día: affirmative routines, negatives, questions, frequency.
6. Lo que me mueve: likes, ability, present continuous, habits versus current actions.
7. A la mesa: food/countability, some/any, café requests, quantities.
8. Un mundo ahí fuera: local services, directions, tickets, city itineraries.
9. Pequeñas decisiones: clothes/colors, prices/payment, preferences/sizes, shopping dialogues.
10. Ya puedo comunicarme: weather/suggestions, needs/help, short messages, integrated conversation.

## Assessment and progression

All four lessons of earlier A1 units must be passed before a later unit's exercises can start. The UI shows all unit goals but keeps later exercises locked. This is enforced by the server, including direct API calls.

The A1 final exam samples one item for every combination of 10 units × 4 skills (40 questions). Grammar/vocabulary items rotate within each unit; reading/listening use independent authored assessment contexts. The delayed review uses a separate form and distinct recordings. A pass requires 85% overall, 75% in each skill and 75% in each unit. All 40 practices must be completed before the exam; the existing 24-hour delayed-review rule remains.

A1 policy is versioned as `2026-11-18-a1-v2`. Historical demo attempts remain in the database and history, but old eight-question A1 demo exams cannot count as evidence for the expanded curriculum. In-progress attempts from an older policy must restart. No existing accounts or attempts were deleted by this change.

## Instructional limits

40 lessons is a course-design choice, not an official CEFR requirement or a guarantee of proficiency. Practice, feedback, retention and production matter more than counting lessons. Oral and written tasks are supplied but are not automatically assessed; human review or a validated production-assessment workflow is still required before certifying proficiency. A2–C2 still contain their introductory material and have not been expanded in this update.

Topic coverage is informed by the Council of Europe's A1 can-do descriptors: familiar expressions, personal details, simple concrete needs, times/quantities, directions and supported interaction. All lesson and assessment text in this repository is original.

Sources:
- https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors-search
- https://europass.europa.eu/en/common-european-framework-reference-language-skills
- https://learnenglish.britishcouncil.org/free-resources/grammar/a1-a2

## Interface

The dashboard uses violet, coral, mint, amber and blue accents, a compact hero, stronger heading sizes, a per-level progress counter, collapsible units with goals and completion indicators, a study companion and structured lesson content. Each A1 unit has its own accent color and icon. Text contrast, keyboard focus, responsive layouts and reduced-motion behavior are preserved.

`npm run course:sync` regenerates the public lesson catalogue from server learning content, stripping answer keys and assessment scenes. The server retains grading logic and correct answers. `node scripts/generateAudio.js` generates any missing recordings on macOS. `npm test` validates unit coverage, versioning, gating, answers and audio assets.
