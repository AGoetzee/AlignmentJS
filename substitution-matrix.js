
async function fetchSubMat(option='BLOSUM62') {
    const url = `https://www.ncbi.nlm.nih.gov/IEB/ToolBox/C_DOC/lxr/source/data/${option}`
    const parser = new DOMParser()

    let response = await fetch(url)
    let raw_html = await response.text()
    let doc = parser.parseFromString(raw_html, 'text/html')

    return doc.querySelector('.filecontent-src').innerHTML
}

async function parse(text) {

    let subMat = {};

    // Clean a bit
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

export function getSubMat(option='BLOSUM62') {
    if (option === 'BLOSUM62') {
        return loadBLOSUM62()
    } else if (option === 'PAM250') {
        return loadPAM250()
    } else {
        console.error('Invalid substitution matrix selected')
    }
}

async function loadBLOSUM62() {
    let subMat = await fetchSubMat('BLOSUM62')
    return parse(subMat);
}

async function loadPAM250() {
    let subMat = await fetchSubMat('PAM250')
    return parse(subMat);
}