import fs from 'node:fs'


let parse = function (f) {

    let subMat = {};

    // Load file and clean a bit
    let text = fs.readFileSync(f, 'utf-8').toString();
    text = text.replace(/\r/g, '').split('\n');

    // In this structure, AA's for the target subs are always on the second line
    let aminoAcids = text[1].split(' ').filter(item => item !== '')

    // Parsing happens here. Clean each line, then zip it into an object
    // After zipping, add it to subMat
    text.filter(item => (!item.startsWith('#') && !item.startsWith(' ')))
        .forEach(item => {
            let line = item.split(' ');
            let from = line.shift();
            line = line.filter(item => item !== '');

            let line_dict;
            line_dict = Object.fromEntries(
                aminoAcids.map((key, i) => [key.toString(), Number(line[i])])
            );

            subMat[from] = line_dict;
        });
    return subMat
}

let getSubMat = function(option='BLOSUM62') {
    if (option === 'BLOSUM62') {
        return loadBLOSUM62()
    } else if (option === 'PAM250') {
        return loadPAM250()
    } else {
        console.error('Invalid substitution matrix selected')
    }
}

let loadBLOSUM62 = function () {
    return parse('BLOSUM62.txt');
};

let loadPAM250 = function () {
    return parse('PAM250.txt');
};