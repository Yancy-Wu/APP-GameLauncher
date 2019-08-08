import crypto from 'crypto';
import fs from 'fs';
import Task from '../base/task';
import EXCEPTIONS from '../exceptions/define';
import { Progress } from '../base/task';

export default class Md5Check extends Task {
    private md5: string;
    private size: number;
    private md5sum: crypto.Hash;
    private stream: fs.ReadStream;
    private resolve!: (value?: void) => void;
    constructor(filePath: string, md5: string) {
        super();
        this.md5 = md5;
        this.size = fs.statSync(filePath).size;
        this.md5sum = crypto.createHash('md5');
        this.stream = fs.createReadStream(filePath);
    }

    private handleData(chunk: any) {
        if (this.onInfo) this.onInfo({
            progress: (this.stream.bytesRead / this.size) * 100
        });
        this.md5sum.update(chunk);
    }

    private handleEnd() {
        const str = this.md5sum.digest('hex').toUpperCase();
        this.stream.close();
        if (str !== this.md5.toUpperCase()) throw new Error(EXCEPTIONS.md5CheckFailed);
        this.resolve();
    }

    private handleError(){
        this.stream.close();
        throw new Error(EXCEPTIONS.unknow);
    }

    public async run() : Promise<void> {
        return new Promise(resolve => {
            this.resolve = resolve;
            this.stream.on('data', this.handleData.bind(this));
            this.stream.on('end', this.handleEnd.bind(this));
            this.stream.on('error', this.handleError.bind(this));
        })
    }
    public pause() { }
    public resume() { }
    public cancel() { }
    public onInfo?: (info: Progress) => void;
}