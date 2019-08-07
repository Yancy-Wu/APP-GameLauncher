import { Progress } from '../types';
import { WebContents } from 'electron';
import { clearMeta } from '../modules/clear';

export interface BaseInfo {
    type: string,
    what?: string,
    msg?: string
}

export interface ErrorInfo extends BaseInfo {
    type: 'error'
}

export interface WarningInfo extends BaseInfo {
    type: 'warning'
}

export interface SummaryInfo extends BaseInfo {
    type: 'abstract'
}

export interface DoneInfo extends BaseInfo {
    type: 'done'
}

export interface ProgressInfo extends BaseInfo {
    type: 'info',
    progressCur: number,
    progressTotal: number,
    done: boolean
}

export abstract class Pipeline {

    private sender: WebContents;
    private timeId!: NodeJS.Timeout;
    private progressTotal: number;
    private replyEvent: string;

    constructor(sender: WebContents, name: string) {
        this.progressTotal = 0;
        this.sender = sender;
        this.replyEvent = `${name}.reply`;
        clearMeta().then(this.loop.bind(this));
    }

    protected send = (val: any) => this.sender.send(this.replyEvent, val);
    protected done = () => this.send({ type: 'done' });
    abstract async connecting(): Promise<void>;
    abstract async indexing(): Promise<void>;
    abstract async logic(action: string | undefined) : Promise<[boolean, string]>;

    public async loop(){
        let action: string = undefined;
        let res: boolean = true;
        while(res){
            [res, action] = await this.logic(action);
        }
        this.done();
    }

    public progressDisplay(what: string, msg: string, weight: number, progress: Progress) :Promise<void>{
        return new Promise(resolve => {
            this.timeId = setInterval(() => {
                this.progressTotal += progress.progress * weight;
                const REPLY: ProgressInfo = {
                    type: 'info',
                    what: what,
                    msg: msg,
                    done: progress.done,
                    progressCur: progress.progress,
                    progressTotal: this.progressTotal,
                }
                this.send(REPLY);
                if (progress.done) {
                    clearInterval(this.timeId);
                    resolve();
                }
            }, 500);
        });
    }
}