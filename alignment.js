// JavaScript implementation of global alignment
// Arthur G. Goetzee 2024-11-27

// Alignment parameters
const GAP_PENALTY = -2;
const MISMATCH_PENALTY = -1;
const MATCH_SCORE = 2;

function constructMatrix(seq1, seq2) {
    let matrix = [];
    for (let i = 0; i < seq1.length; i++) {
        matrix.push([]); // row
        for (let j = 0; j < seq2.length; j++) {
            matrix[i].push(0); // columns
        }
    }

    return matrix;
}

function initializeScoreMatrix(matrix, seq1, seq2) {
    for (let i = 1; i < seq1.length; i++) {
        matrix[i][0] = matrix[i - 1][0] + GAP_PENALTY;
    }

    for (let j = 1; j < seq2.length; j++) {
        matrix[0][j] = matrix[0][j - 1] + GAP_PENALTY;
    }

    return matrix;
}

function initializeTracebackMatrix(matrix, seq1, seq2) {
    for (let i = 1; i < seq1.length; i++) {
        matrix[i][0] = "U";
    }

    for (let j = 1; j < seq2.length; j++) {
        matrix[0][j] = "L";
    }
    matrix[0][0] = "D";

    return matrix;
}

function isMatch(aa1, aa2) {
    if (aa1 === aa2) {
        return MATCH_SCORE;
    } else {
        return MISMATCH_PENALTY;
    }
}

function calculateScores(scoreMatrix, tracebackMatrix, seq1, seq2) {
    for (let i = 1; i < seq1.length; i++) {
        for (let j = 1; j < seq2.length; j++) {
            const choices = {
                U: scoreMatrix[i - 1][j] + GAP_PENALTY,
                L: scoreMatrix[i][j - 1] + GAP_PENALTY,
                D: scoreMatrix[i - 1][j - 1] + isMatch(seq1[i], seq2[j]),
            };
            scoreMatrix[i][j] = Math.max(...Object.values(choices));
            tracebackMatrix[i][j] = Object.entries(choices).reduce(
                (max, current) => (current[1] > max[1] ? current : max)
            )[0];
        }
    }
    return scoreMatrix, tracebackMatrix;
}

function traceback(tracebackMatrix, seq1, seq2) {
    let alignment = "";
    let alignmentComplement = "";

    let i = seq1.length - 1;
    let j = seq2.length - 1;

    while (i >= 0 && j >= 0) {
        switch (tracebackMatrix[i][j]) {
            case "D":
                alignment = `${seq1[i]}${alignment}`; //seq1
                alignmentComplement = `${seq2[j]}${alignmentComplement}`; //seq2
                i--;
                j--;
                break;
            case "U": //go a row Up
                alignment = `${seq1[i]}${alignment}`;
                alignmentComplement = `-${alignmentComplement}`;
                i--;
                break;
            case "L": //go a column Left
                alignment = `-${alignment}`;
                alignmentComplement = `${seq2[j]}${alignmentComplement}`;
                j--;
                break;
        }
    }
    return { alignment, alignmentComplement };
}

function prettyPrintMatrix(matrix, seq1, seq2) {
    const header = " ";
    for (let char of seq2) {
        header += `   ${char}`;
    }
    console.log(header);

    for (let i = 0; i < seq1.length; i++) {
        let row = `${seq1[i]}  `;
        for (let j = 0; j < seq2.length; j++) {
            row += `${matrix[i][j]}`.padEnd(4, " ");
        }
        console.log(row);
    }
}

function prettyPrintAlignment(alignment, alignmentComplement) {
    const alignedMatch = (aa1, aa2) => (aa1 === aa2 ? "|" : " ");

    let topAlignmentRow = "";
    let matchAlignmentRow = "";
    let bottomAlignmentRow = "";

    for (let i = 0; i < alignment.length; i++) {
        topAlignmentRow += `${alignment[i]}  `;
        matchAlignmentRow += `${alignedMatch(
            alignment[i],
            alignmentComplement[i]
        )}  `;
        bottomAlignmentRow += `${alignmentComplement[i]}  `;
    }

    let result = `
    ${topAlignmentRow}
    ${matchAlignmentRow}
    ${bottomAlignmentRow}`;

    return result;
}

function printResults(alignment, alignmentComplement, scoreMatrix) {
    const result = `
    ***** Alignment Report *******

    ----Parameters----
    Gap penalty: ${GAP_PENALTY}
    Mismatch penalty: ${MISMATCH_PENALTY}
    Match Score: ${MATCH_SCORE}

    ------Input-------
    Sequence 1: ${seq1}
    Length: ${seq1.length}
    Sequence 2: ${seq2}
    Length: ${seq2.length}

    ------Results------
    Alignment score: ${scoreMatrix[seq1.length - 1][seq2.length - 1]}
    ${prettyPrintAlignment(alignment, alignmentComplement)}`;

    return result;
}

function validateSequences(seq1, seq2) {
    if (seq1.length === 0 || seq2.length === 0) {
        throw new Error("Sequences cannot be empty!");
    }

    if (typeof seq1 != "string" || typeof seq2 != "string") {
        throw new Error("Sequences must be strings!");
    }
}

export function runAlignment(seq1, seq2) {
    // step 1, initialization
    let scoreMatrix = constructMatrix(seq1, seq2);
    let tracebackMatrix = constructMatrix(seq1, seq2);

    scoreMatrix = initializeScoreMatrix(scoreMatrix, seq1, seq2);
    tracebackMatrix = initializeTracebackMatrix(tracebackMatrix, seq1, seq2)[
        // step 2, calculation
        (scoreMatrix, tracebackMatrix)
    ] = calculateScores(scoreMatrix, tracebackMatrix, seq1, seq2);

    //step 3, traceback
    const { alignment, alignmentComplement } = traceback(
        tracebackMatrix,
        seq1,
        seq2
    );

    //step 4, print the results!
    return printResults(alignment, alignmentComplement, scoreMatrix);
}

// Input variables
let seq1 = "AGCT"; //rows or i
let seq2 = "AGCT"; //columns or j
validateSequences(seq1, seq2);

console.log(runAlignment(seq1, seq2));
