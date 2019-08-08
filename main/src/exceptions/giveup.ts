export default async function (code: () => Promise<void>, exceptions?: string[]): Promise<string | undefined> {
    try {
        await code();
        return undefined;
    }
    catch (err) {
        if (!exceptions) return err.message;
        if (!(err.message in exceptions)) throw err;
        return err.message;
    }
}