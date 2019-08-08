import { ChildProcess } from 'child_process';
import Task from '../base/task';

export default class Caller extends Task{
    private child: ChildProcess;
    private resolve!: (value?: void) => void;
    private handleData(data: any): any{
        data = data.toString();
        if (this.dataFilter) data = this.dataFilter(data);
        else data = JSON.parse(data);
        if (this.onInfo) this.onInfo(data);
    }

    private handleClose(code: number): void{
        const exception = this.exceptions[code];
        if (exception) throw new Error(exception);
        else this.resolve();
    }

    protected createChild: () => ChildProcess;
    protected dataFilter?: (data: any) => any;
    protected exceptions: any;
    public async run(): Promise<void>{
        return new Promise(resolve => {
            this.resolve = resolve;
            this.child = this.createChild();
            this.child.stdout.on('data', this.handleData.bind(this));
            this.child.on('close', this.handleClose.bind(this));
        });
    }
    public pause(){}
    public resume(){}
    public cancel(){}
    public onInfo?: (info: any) => void;
}