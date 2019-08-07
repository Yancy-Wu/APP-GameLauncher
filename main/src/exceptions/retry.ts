export default function retry(code: () => void, exceptions: string[],
    onRetry: (exception: string, triedNum: number) => boolean, onSuccess: () => void) {
    let num = 1;
    const loop = () => {
        try {
            code();
        }
        catch (err) {
            if (!(err.message in exceptions)) throw err;
            if (!onRetry(err.message, num++)) loop();
        }
    }
    loop();
    onSuccess();
}