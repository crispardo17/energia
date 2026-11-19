import {a1ExamItems} from './a1-assessments.js';
import {advancedEvaluations} from './english-evaluations.js';
import {addExamItems} from './assessment.js';
addExamItems([...a1ExamItems(),...advancedEvaluations]);
