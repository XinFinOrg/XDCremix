declare const _default: {
    EXACT: {
        hasFalsePositives: boolean;
        hasFalseNegatives: boolean;
        id: string;
    };
    HEURISTIC: {
        hasFalsePositives: boolean;
        hasFalseNegatives: boolean;
        id: string;
    };
};
/**
  * Should be used to categorize different modules, main reason is to give users feedback if the modules
  * Produce exact results or have false positives and negatives in them
  * A further category could be approximate if some form of approximation is used
*/
export default _default;
