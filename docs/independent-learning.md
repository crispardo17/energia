# Independent, accessible learning

No model or human teacher is required. Auth remains managed Neon Auth. Both courses use guided explanations, worked examples, self-explanation and objective server-side practice. The system measures performance on the published tasks, not complete mastery of an entire language or profession.

## Problems addressed

| Difficulty | Implemented response |
|---|---|
| Too much information and unfamiliar vocabulary | Four guided steps; one question at a time; expandable technical material; searchable glossary |
| Weak prerequisites | Twelve beginner sessions before advanced engineering; eight AI fundamentals before applied LLMs |
| Literal translation and unfamiliar English syntax | Unit-specific tips; all forty A1 examples have Spanish translations; sentence construction |
| Difficulty hearing or decoding connected speech | Replayable recorded assessments, slower playback, voiced training examples, written material |
| Fear of mistakes or slow pace | No speed score or countdown; suggested sessions of 5/10/20 minutes; drafts across pauses |
| Forgetting after one success | Server-persisted reviews after 1,3,7,14,30 days; mistakes become due immediately; early repetition cannot extend the due date |
| Reading and motor access | Large-text option stored per account; visible focus; large controls; reduced-motion support; no drag-only exercises |
| Missing personal context | Private notes per user and lesson; examples using daily life and a consistent library system |

Teaching decisions are informed by IES guidance on spacing, retrieval and worked examples (https://ies.ed.gov/ncee/wwc/PracticeGuide/1), W3C older-user accessibility (https://www.w3.org/WAI/older-users/developing/) and the CEFR activity framework (https://www.coe.int/en/web/common-european-framework-reference-languages/home). Content and exercises are original. Interval choices and interface patterns are product decisions, not a validated promise of faster learning for every individual.

## Curriculum

Engineering now has 48 sessions in nine stages: 12 foundations; original 24 advanced sessions with stable IDs; 8 AI fundamentals; 4 sessions on global backend security, data operations, infrastructure/cost and architecture. Foundations include programming, data structures, DNS/HTTP/TLS, processes/concurrency, cross-language architecture, API contracts, SQL, storage, Git/tests, identity and production. AI foundations include vectors/probability, datasets/leakage/baselines, regression/loss/optimization, classification/metrics, unsupervised learning/embeddings, neural networks/transformers, rules/RAG/fine-tuning, multimodal systems and responsible operation. Node.js is one implementation example, not the course boundary.

Each session contains four conceptual decisions, a proposed flow, code diagnosis, reasoning and transfer. Approval requires 85%, all essential conceptual questions correct, and both application exercises correct. Optional written notes are never approved by length or keyword matching. Text analysis, unrestricted code execution, speech/pronunciation grading and free-form tutoring are not implemented. No external inference provider or model was connected.

A1 still has forty substantive lessons, ten units, recorded practice and independent exam/review forms. A2–C2 remain introductory material; these changes do not turn them into complete courses or provide CEFR certification. Speaking/writing tasks remain practice rather than automatically certified production skills.

## Persistence and migration

`003_independent_learning.sql` adds private preferences, per-concept spaced-review records and private lesson notes, extends draft windows to thirty days and keeps English drafts per activity. Authentication and ownership are enforced on every request. Course submit and memory updates commit in one transaction; duplicate submit does not schedule a review twice. Early repeats keep the due date; an error resets the schedule. Review suggestions link only to lesson practice; existing prerequisite checks still apply.

Existing learning history and notes are preserved. Earlier teacher-approved advanced sessions retain credit. Old pending manual submissions become reinforcement with a note inviting the learner to the automatic assessment; they are not silently approved or deleted. New prerequisite lessons appear before advanced sessions. New lesson ordering temporarily offsets existing positions within the same migration transaction, preventing unique-key collisions.

## Validation

`npm test`; isolated branch migration; `ACADEMY_ENV_FILE=/private/tmp/angkor-independent-branch.env node scripts/checkIndependentLearning.js`; browser checks using a synthetic verified account on that same branch. Checks cover automatic gates, ownership, private notes/preferences, drafts, review schedule and wrong application not compensated by long text. Browser checks cover login, course entry, large text, guided content and saved English practice. The UI still needs usability testing with actual older adults and beginners; no universal age or learning-speed guarantee is made.
