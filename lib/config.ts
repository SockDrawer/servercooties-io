import {Deserialize} from './helpers/deserialize';

export class CheckConfig {
    public static deserialize(input: Object): CheckConfig {
        const result = new CheckConfig();
        result.rootUri = Deserialize.string(input, 'rootUri');
        result.uriTemplate = Deserialize.string(input, 'uriTemplate');
        result.servers = Deserialize.list(input, 'servers');
        result.endpoints = Deserialize.list(input, 'endpoints');
        result.databaseTemplate = Deserialize.string(input, 'databaseTemplate', result.databaseTemplate);
        result.cootiesThreshold = Deserialize.number(input, 'cootiesThreshold', undefined, undefined, result.cootiesThreshold);
        result.pollDelay = Deserialize.number(input, 'cootiesThreshold', undefined, undefined, result.pollDelay);
        result.compression = Deserialize.boolean(input, 'compression', result.compression);
        result.requestTimeout = Deserialize.number(input, 'requestTimeout', undefined, undefined, result.requestTimeout);
        const status = Deserialize.byName(input, 'status');
        if (status !== undefined) {
            result.status = StatusList.deserialize(status);
        }
        return result;
    }
    public rootUri: string = '';
    public servers: string[] = [];
    public endpoints: string[] = [];
    public customHeaders: Map<string, string> = new Map<string, string>([
        ['accept', 'text/html'],
        ['User-Agent', 'Servercooties.io Crawler; https://github.com/SockDrawer/servercooties-io'],
        ['Servercooties-Target-Server', '%server%']
    ]);
    public uriTemplate: string = '%rootUri%/%endpoint%';
    public databaseTemplate: string = '%endpoint%';
    public cootiesThreshold: number = 50;
    public pollDelay: number = 3;
    public status: StatusList = new StatusList();
    public compression: boolean = true;
    public requestTimeout: number = 15;
}

export class StatusList {
    public static deserialize(input: Object): StatusList {
        const result = new StatusList();
        result.offline = StatusConfig.deserialize(Deserialize.byName(input, 'offline'), result.offline);
        result.terrible = StatusConfig.deserialize(Deserialize.byName(input, 'terrible'), result.terrible);
        result.bad = StatusConfig.deserialize(Deserialize.byName(input, 'bad'), result.bad);
        result.ok = StatusConfig.deserialize(Deserialize.byName(input, 'ok'), result.ok);
        result.good = StatusConfig.deserialize(Deserialize.byName(input, 'good'), result.good);
        result.great = StatusConfig.deserialize(Deserialize.byName(input, 'great'), result.great);
        result.awesome = StatusConfig.deserialize(Deserialize.byName(input, 'awesome'), result.awesome);
        return result;
    }
    public offline: StatusConfig = {
        display: 'Offline',
        maxWait: -1,
        baseSatisfaction: 0,
        flavors: ['The site appears to be offline.']
    };
    public terrible: StatusConfig = {
        display: 'Very Bad',
        maxWait: 3,
        baseSatisfaction: 20,
        flavors: ['The site is performing very poorly']
    };
    public bad: StatusConfig = {
        display: 'Bad',
        maxWait: 2,
        baseSatisfaction: 50,
        flavors: ['The site is performing poorly']
    };
    public ok: StatusConfig = {
        display: 'Ok',
        maxWait: 1.75,
        baseSatisfaction: 70,
        flavors: ['The site is performing okay']
    };
    public good: StatusConfig = {
        display: 'Good',
        maxWait: 1.5,
        baseSatisfaction: 80,
        flavors: ['The site is performing well.']
    };
    public great: StatusConfig = {
        display: 'Great',
        maxWait: 1,
        baseSatisfaction: 90,
        flavors: ['The site is performing great']
    };
    public awesome: StatusConfig = {
        display: 'Awesome',
        maxWait: 0,
        baseSatisfaction: 100,
        flavors: ['There are no issues detected']
    };
}

export class StatusConfig {
    public static deserialize(input: Object, defaults?: StatusConfig): StatusConfig {
        const result = new StatusConfig();
        if (!defaults) {
            defaults = new StatusConfig();
        }
        result.display = Deserialize.string(input, 'display', defaults.display);
        result.maxWait = Deserialize.number(input, 'maxWait', -1, 30, defaults.maxWait);
        result.baseSatisfaction = Deserialize.number(input, 'baseSatisfaction', 0, 100, defaults.baseSatisfaction);
        result.flavors = Deserialize.list(input, 'flavors', defaults.flavors);
        return result;
    };
    public display: string = '';
    public maxWait: number = 0;
    public baseSatisfaction: number = 0;
    public flavors: string[] = [''];
}

export interface ConfigData {
    database: string;
    pollDelay: number;
    checks: CheckConfig[];
    status: StatusConfig[];
};
