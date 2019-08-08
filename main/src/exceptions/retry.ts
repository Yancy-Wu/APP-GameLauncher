import EXCEPTIONS from './define';
import Task from '../base/task';

export default class RetryTask extends Task{
    private retryNum = 0;
    private exec: (() => Promise<void>) | Task;
    private exceptions: string[];

    constructor(exec: (() => Promise<void>) | Task, exceptions: string[]){
        super();
        this.exec = exec;
        this.exceptions = exceptions;
    }

    public async logic(): Promise<boolean>{
        try {
            if(this.exec instanceof Task) await this.exec.run();
            else await this.exec();
            return true;
        }
        catch (err) {
            if (!(err.message in this.exceptions)) throw err;
            let res = true;
            if(this.onRetry) res = res && await this.onRetry(err.message, ++this.retryNum);
            if(res) return false;
            else throw new Error(EXCEPTIONS.retryFailed);
        }
    }

    public async run() {
        let done = false;
        while(!done){
            done = await this.logic();
        }
    }

    public pause(){if(this.exec instanceof Task) this.exec.pause();}
    public resume(){if(this.exec instanceof Task) this.exec.resume();}
    public cancel(){if(this.exec instanceof Task) this.exec.cancel();}
    public onRetry: (exception: string, triedNum: number) => Promise<boolean>
}