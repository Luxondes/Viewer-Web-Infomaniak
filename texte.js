let data = "{EmissionScan: {Component: [{ Name: [ 'ROHDE & SCHWARZ FPC 1500' ],Manufacturer: [ '' ], Notes: ['Mesure avec ScanPhone - Analyseur de Spectre de 106.7 MHZ à 108.0 MHZ']}]}}"

function addstr(data, char1, char2){
    let str = data.split(char1);
    let str2 = '';
    for (let index = 0; index < str.length; index++) {
        if (str[index].includes(char2)){
            str2 = str2.concat('', str[index]);
        }
    }
    return str2
}

let str = '';

str = addstr(data, '{', '[');
console.log(str);

str = addstr(str, '}', ']');
console.log(str);

console.log(str.split(','));




