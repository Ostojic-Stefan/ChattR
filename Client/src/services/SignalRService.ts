import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default class SignalRService {
    private _connection: HubConnection;
    constructor() {
        this._connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/api/chathub")
            .configureLogging(LogLevel.Information)
            .build();
    }

    public async startConnection(): Promise<void> {
        await this._connection.start();
        console.log('SignalR connection started successfully');
    }

    public async stopConnection(): Promise<void> {
        await this._connection.stop();
        console.log('SignalR connection stopped successfully');
    }

    public getConnection(): HubConnection {
        return this._connection;
    }
}