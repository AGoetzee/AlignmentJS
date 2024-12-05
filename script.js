import { runAlignment } from "./alignment.js";

document.getElementById("run").addEventListener("click", function () {
    const seq1 = document.getElementById("seq1").value.toUpperCase();
    const seq2 = document.getElementById("seq2").value.toUpperCase();

    if (!seq1 || !seq2) {
        document.getElementById("results").textContent =
            "Please enter both sequences.";
        return;
    }

    if (!/^[a-zA-Z]+$/.test(seq1) || !/^[a-zA-Z]+$/.test(seq2)) {
        document.getElementById("results").textContent =
            "Please enter alphabetic characters only.";
        return;
    }

    const results = runAlignment(seq1, seq2);

    document.getElementById("results").textContent = results;
});

document.getElementById("copyButton").addEventListener("click", function () {
    const copyText = document.getElementById("results").textContent;
    navigator.clipboard.writeText(copyText);
    document.getElementById("copyAlert").textContent = "Copied!";

    setTimeout(function () {
        document.getElementById("copyAlert").textContent = "";
    }, 1000);
});
