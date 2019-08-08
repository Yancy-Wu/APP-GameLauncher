export interface Progress {
    progress: number
}

type OnInfoType = (info: any) => void;
type State = 'ready' | 'pause' | 'running';
export default abstract class Task {
    protected state: State = 'ready';
    abstract pause(): void;
    abstract resume(): void;
    abstract run(): Promise<any>;
    abstract cancel(): void;
    public onInfo?: OnInfoType;
    public getState = () => this.state;
}

class Mutex{
    private avail = true;
    private suspendResolve: ((value?: void) => void)[];
    public take(){
        this.avail = false;
    }
    public release(){
        for(let resolve of this.suspendResolve){
            resolve();
        }
        this.suspendResolve = [];
        this.avail = true;
    }
    public async available(){
        if(this.avail) return;
        await new Promise(resolve => {
            this.suspendResolve.push(resolve);
        });
    }
}

export class TaskPool {
    private id = 0;
    private pool = new Map<number, Task>();
    private mutex = new Mutex();
    public get = (id: number) => this.pool.get(id);
    public addTask(task: Task): number {
        this.pool.set(this.id, task);
        return this.id++;
    }
    public async run(id: number){
        await this.mutex.available();
        await this.get(id).run();
        this.pool.delete(id);
    }
    public async addAndRun(task: Task){
        const id = this.addTask(task);
        await this.run(id);
    }
    public cancel(){
        for(const task of this.pool.values()) task.cancel();
    }
    public pause(){
        for(const task of this.pool.values()) task.pause();
        this.mutex.take();
    }
    public resume(){
        for(const task of this.pool.values()) task.resume();
        this.mutex.release();
    }
}