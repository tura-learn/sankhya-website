/**
 * Manu-S1, in the words of its model card (huggingface.co/sankhya-aI/manu-s1-4b). Every number
 * here is the card's; if the card changes, this file changes with it.
 */

export const HF_URL = 'https://huggingface.co/sankhya-aI/manu-s1-4b';
export const MODEL_ID = 'sankhya-aI/manu-s1-4b';

/**
 * Four cheque-bounce complaints (s.138 NI Act) from the live run of Manu-S1 v1 on one NVIDIA L40S
 * (2026-09-29, 1,972 decisions). The records are generated; the answers, confidences and times are
 * the model's own. Source: nyaya-s1 demo/page_data.json.
 */
export const LIVE_RUN = { decisions: '1,972', seconds: '197', perSecond: '10', cannotTell: '71', gpu: 'NVIDIA L40S' } as const;

/**
 * Four kinds of work, each Manu-S1 v1's own output from its live run. The trial file is a real
 * special-court case with every name and number removed; the High Court order is from the public
 * dataset; the cheque complaint is a generated record.
 */
export type Tone = 'ok' | 'flag' | 'unsure' | 'info';
export type Example = {
  story: string;
  source: string;
  record: readonly string[];
  answers: ReadonlyArray<readonly [question: string, answer: string, confidence: number, ms: number | null, tone: Tone]>;
  foot: string;
};

export const EXAMPLES: readonly Example[] = [
  {
    story: 'Court routing',
    source: 'A real special-court trial file · names removed',
    record: ['A case filed by a central investigating agency.', 'Charged under Sec. 13(2) read with 13(1)(d) of the Prevention of Corruption Act, 1988.'],
    answers: [['Which special court should hear it?', 'PC Act special court', 90.5, 58, 'info']],
    foot: 'Before training: right 3 times in 24 · Manu-S1: 24 of 24',
  },
  {
    story: 'Attendance',
    source: 'The same trial file · one day’s order sheet',
    record: ['Six accused, one hearing. Who was in court, and how?'],
    answers: [
      ['A-1', 'Through counsel', 90.2, 85, 'info'],
      ['A-2', 'In person, with counsel', 96.4, 85, 'ok'],
      ['A-3', 'In person, with counsel', 95.2, 86, 'ok'],
      ['A-4', 'Through counsel', 93.1, 85, 'info'],
      ['A-5', 'In person, no counsel', 92.0, 84, 'flag'],
      ['A-6', 'Through counsel', 84.3, 85, 'info'],
    ],
    foot: 'Six decisions, one order · the hearing itself read as an adjournment (94.6%)',
  },
  {
    story: 'Order reading',
    source: 'A High Court order · public dataset (CC-BY-4.0)',
    record: ['A first appeal from an order, listed for admission.'],
    answers: [
      ['What kind of order is it?', 'Final disposal', 98.2, null, 'info'],
      ['How did it end?', 'Dismissed for default', 95.8, null, 'flag'],
      ['Any interim order?', 'None in the matter', 99.0, null, 'ok'],
      ['Costs?', 'No costs', 98.0, null, 'ok'],
    ],
    foot: 'Four decisions in 135 ms · matches the High Court’s own registry entry',
  },
  {
    story: 'Deadlines',
    source: 'A cheque-bounce complaint · s.138 NI Act',
    record: [
      'Cheque returned unpaid 22.05.2025. Notice received 30.05.2025.',
      'Complaint presented 10.06.2025.',
    ],
    answers: [
      ['Cheque presented in time?', 'Within validity', 99.94, 47, 'ok'],
      ['Notice sent in time?', 'In time', 99.97, 53, 'ok'],
      ['Complaint filed in time?', 'Too early', 99.68, 46, 'flag'],
    ],
    foot: 'The 15 days to pay had not run out: filed before the cause of action arose',
  },
];

/** Orders from the public High Court dataset (CC-BY-4.0) in the same run: what the registry recorded, and what Manu-S1 read. */
export const HIGH_COURT = [
  ['Bombay High Court', 'Dismissed as withdrawn', 'Dismissed as withdrawn', 97.1, 211],
  ['High Court', 'Dismissed for non-prosecution at admission', 'Dismissed for default', 95.8, 135],
  ['High Court', 'Disposed of as abated', 'Abated', 94.2, 156],
  ['Madras High Court', 'Allowed as prayed for', 'Allowed', 92.5, 188],
  ['Bombay High Court', 'Dismissed for default', 'Dismissed for default', 88.3, 192],
] as const;

export const FAMILIES = [
  {
    title: 'Deadlines and limitation',
    plain: 'Was it filed in time?',
    body: 'Cheque-bounce complaints under s.138, suit limitation, arbitration challenges, consumer complaints, written statements, caveats and more.',
  },
  {
    title: 'Orders',
    plain: 'What did the court just do?',
    body: 'What kind of order it is, how the case was disposed of, whether there is an interim order, and whether costs were imposed.',
  },
  {
    title: 'Appearance',
    plain: 'Who came to court?',
    body: 'Whether a party came in person or only through counsel.',
  },
  {
    title: 'Routing',
    plain: 'Which court should hear it?',
    body: 'The special court a criminal case belongs to (PC Act, NDPS, POCSO, SC/ST, PMLA, UAPA), and old or new penal code by the date of the offence.',
  },
  {
    title: 'Research',
    plain: 'Is this precedent still good?',
    body: 'How a later judgment treats an earlier one. For research use only.',
  },
] as const;

/** The card's results table: guessing the commonest answer, the model before, and Manu-S1. */
export const RESULTS = [
  { test: 'Held-out High Court orders', size: '2,346 cases it never saw', majority: 72.3, before: 86.9, after: 91.8 },
  { test: 'Rule families', size: '1,620 generated records', majority: 39.3, before: 97.0, after: 99.5 },
  { test: 'A real special-court trial file', size: '24 routing decisions', majority: 100, before: 12.5, after: 100 },
] as const;

export const NEVER = [
  'Bail',
  'Flight risk',
  'Reoffending',
  'Credibility',
  'Guilt',
  'Liability',
  'Outcomes',
  'Sentences',
  'Amounts',
  'Anything keyed on caste, religion, gender, region or a name',
] as const;

export const LIMITS = [
  'English records only.',
  'Trained on High Court orders; tested on one real trial file so far.',
  'It does not yet point to the paragraph it relied on.',
  'Twenty question types wait for review by counsel and are not trained.',
  'Telling “in person with counsel” from “without counsel” is not reliable yet (47%).',
] as const;

export const SPECS = [
  ['Size', '4B parameters'],
  ['Built on', 'Qwen3.5-4B, through Tura-S1-4B'],
  ['Memory', 'About 9 GB (bf16)'],
  ['Speed', '64 ms median, 194 ms p95 on one L40S'],
  ['Answers per pass', 'Up to 16'],
  ['Licence', 'Apache-2.0, open weights'],
] as const;

export const CODE = [
  {
    id: 'serve',
    label: 'Serve',
    code: `pip install git+https://github.com/allebee/jevk5
jevk5-serve --model ${MODEL_ID} --port 8090`,
  },
  {
    id: 'python',
    label: 'Python',
    code: `from jevk5 import JevK5

model = JevK5("${MODEL_ID}")
model.decide(
    "Cheque returned unpaid on 22.05.2025. Notice received on 30.05.2025. "
    "Complaint presented on 10.06.2025.",
    {"type": "choice", "instructions": "Was the complaint filed in time?",
     "criteria": ["in_time", "premature", "late", "cannot_tell"]},
)
# {'choice': 'premature', 'probabilities': {...}}`,
  },
  {
    id: 'request',
    label: 'Request',
    code: `curl -s localhost:8090/v1/systemone -d '{
  "state": "Present: Ld. APP for the State. Accused in person.",
  "questions": {"appearance": {"type": "choice",
    "instructions": "How did the accused appear?",
    "criteria": ["in_person", "through_counsel_only", "cannot_tell"]}}}'`,
  },
] as const;
