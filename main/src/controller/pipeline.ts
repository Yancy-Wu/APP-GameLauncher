import { WebContents } from 'electron';
import Task, { TaskPool, Progress } from '../base/task';
import * as Msg from './msg';
import RetryTask from '../exceptions/retry';
import giveup from '../exceptions/giveup';

type LogicFunc = (action: string | undefined) => Promise<[boolean, string]>;
export default abstract class Pipeline extends Task {

    private sender: WebContents;
    private progressTotal: number;
    private replyEvent: string;
    protected tasks: TaskPool = new TaskPool();

    constructor(sender: WebContents, name: string) {
        super();
        this.progressTotal = 0;
        this.sender = sender;
        this.replyEvent = `${name}.reply`;
    }

    abstract logic: LogicFunc;
    protected send = (val: any) => this.sender.send(this.replyEvent, val);

    protected async loop(code: LogicFunc) {
        let action: string = undefined;
        let res: boolean = true;
        while (res) {
            [res, action] = await code(action);
        }
    }

    public async run() {
        await this.loop(this.logic.bind(this));
    };

    public cancel() {
        this.tasks.cancel();
    }

    public pause() {
        this.tasks.pause();
    }

    public resume() {
        this.tasks.resume();
    }

    protected sendDone = () => this.send({ type: 'done' });

    protected sendRetryDebug(exception: string, num: number) {
        let REPLY: Msg.BaseMsg = {
            type: 'debug',
            msg: Msg.debugMsg[exception] + num.toString()
        }
        this.send(REPLY);
    }

    protected sendDebug(exception: string) {
        let REPLY: Msg.BaseMsg = {
            type: 'debug',
            msg: Msg.debugMsg[exception]
        }
        this.send(REPLY);
    }

    protected sendError(exception: string) {
        let REPLY: Msg.BaseMsg = {
            type: 'error',
            msg: Msg.errorMsg[exception]
        }
        this.send(REPLY);
    }

    protected sendInfo(msg: string) {
        let REPLY: Msg.BaseMsg = {
            type: 'info',
            msg: msg
        }
        this.send(REPLY);
    }

    protected sendProgress(msg: string, weight: number, progress: Progress) {
        this.progressTotal += progress.progress * weight;
        const REPLY: Msg.ProgressMsg = {
            type: 'info',
            msg: msg,
            progressCur: progress.progress,
            progressTotal: this.progressTotal,
        }
        this.send(REPLY);
    }

    protected async retryTask(task: Task | (() => Promise<void>), retryExceptions: string[]):
        Promise<string | undefined> {
        return await giveup(async () => {
            let retryTask = new RetryTask(task, retryExceptions);
            retryTask.onRetry = this.sendRetryDebug.bind(this);
            await this.tasks.addAndRun(retryTask);
        });
    }
}