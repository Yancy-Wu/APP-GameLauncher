function integer(n: number){
    return Number.parseInt(n.toString());
}

export function secondToTimeStr(n: number){
    if(Number.isNaN(n) || !Number.isFinite(n))return '99:99:99';
    const sec = integer(n % 60).toString().padStart(2,'0');
    const min = integer(((n % 3600) / 60)).toString().padStart(2,'0');
    const hour = integer((n / 3600)).toString().padStart(2,'0');
    return hour + ':' + min + ':' + sec;
}

export function bytesToStr(b: number) {
    let neg = b < 0 ? true : false;
    b = Math.abs(b);
    let i = -1;
    let v = b % 1024;
    if (b === 0) i = 0;
    while (b !== 0) {
        b = Math.floor(b / 1024);
        ++i;
    }
    return (neg ? '-' : '') + v.toString() + ['B', 'KB', 'MB', 'GB', 'TB'][i];
}