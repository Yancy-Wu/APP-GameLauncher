import { Progress } from '../types';
import { WebContents } from 'electron';

export interface BaseInfo {
    type: string,
    what?: string,
    msg?: string
}

export interface ErrorInfo extends BaseInfo {
    type: 'error'
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
        this.logic('Connecting');
    }

    protected send = (val: any) => this.sender.send(this.replyEvent, val);
    protected done = () => this.send({ type: 'done' });
    abstract connecting(done: () => void): void;
    abstract indexing(done: () => void): void;
    abstract logic(action: any): void;

    public progressDisplay(what: string, msg: string, weight: number, progress: Progress, done: () => void) {
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
                done();
            }
        }, 500);
    }
}