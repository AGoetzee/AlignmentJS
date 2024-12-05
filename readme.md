# AlignmentJS

This is a javascript implementation of the [Needleman-Wunsch algorithm](https://en.wikipedia.org/wiki/Needleman–Wunsch_algorithm) for global sequence alignment. It is a simple implementation that I made to get a better understanding of javascript and web development, as such you may encounter some beginner mistakes. The code is not optimized for performance, but it should work fine for small sequences. Feel free to give feedback or suggestions for improvements in the issues section.

## Web version

A live web version of the script can be found [here](). _Note that not all functionality is implemented yet._

## Offline usage

The script can also be used offline. You can download the repository and run the script with node.js.
Currently you need to hardcode the sequences and parameters in the script. The variables you need to change are:

-   `seq1` and `seq2`: the sequences to align
-   `GAP_PENALTY`, `MISMATCH_PENALTY` and `MATCH_SCORE`: the scoring parameters

Then you can run the script in a browser, or with node.js:

```bash
node alignment.js
```

The results will be printed to the console.

## Example

Currently, the script is set up to align the sequences `AGCT` and `AGCT`. The output should be:

```bash
>>> node alignment.js

***** Alignment Report *******
----Parameters----
Gap penalty: -2
Mismatch penalty: -1
Match Score: 2
------Input-------
Sequence 1: AGCT
Length: 4

Sequence 2: AGCT
Length: 4

------Results------
Alignment score: 6
A  G  C  T
|  |  |  |
A  G  C  T
```
