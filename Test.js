// Importing the input (JSON Format)
const data = require("./input.json");

function parseBigIntInBase(s, base) {
    s = String(s).trim().toLowerCase();
    if (s.length === 0) return 0n;
    let neg = false;
    if (s[0] === '-') { 
        neg = true;
        s = s.slice(1);
    }
    const b = BigInt(base);
    let acc = 0n;
    for (const ch of s) {
        let digit;
        if (ch >= '0' && ch <= '9') digit = ch.charCodeAt(0) - 48;
        else if (ch >= 'a' && ch <= 'z') digit = ch.charCodeAt(0) - 87;
        else throw new Error(`Invalid character '${ch}' in value '${s}'`);
        if (digit < 0 || digit >= base) throw new Error(`Digit '${ch}' out of range for base ${base}`);
        acc = acc * b + BigInt(digit);
    }
    return neg ? -acc : acc;
}

function computeConstantFromJson(jsonObj) {
    const n = jsonObj.keys?.n ?? 0;
    let product = 1n;

    for (const key of Object.keys(jsonObj)) {
        if (key === "keys") continue;
        const node = jsonObj[key];
        if (node?.base !== undefined && node?.value !== undefined) {
            const base = Number(node.base);
            const val = parseBigIntInBase(node.value, base);
            product *= val;
        }
    }

    if (n % 2 !== 0) product = -product;
    return product;
}

const C = computeConstantFromJson(data);
console.log(C.toString());
