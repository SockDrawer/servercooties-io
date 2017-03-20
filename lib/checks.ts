import {Resolver} from './helpers/promises';
import * as Request from 'request';
import {IncomingMessage} from 'http';

import {CheckConfig} from './config';

export class CheckResult {
    public url: string;
    public httpStatus: number;
    public completed: boolean;
    public startedAt: Date;
    public endedAt: Date;
};

export class CheckStatus {
    public static replaceValues (value: string, url: string, server: string, endpoint: string,
        config: CheckConfig): string {
            return value
                    .replace(/%url%/g, url)
                    .replace(/%server%/g, server)
                    .replace(/%endpoint%/g, endpoint)
                    .replace(/%rootUri%/g, config.rootUri)
                    .replace(/%name%/g, config.name);
    }

    public static checkHttp (server: string, endpoint: string, config: CheckConfig): Promise<CheckResult> {
        return new Promise((resolve: Resolver<CheckResult>): void => {
            const url = CheckStatus.replaceValues(config.uriTemplate, '', server, endpoint, config);
            const headers = {};
            for (let [key, value] of config.customHeaders) {
                headers[key] = CheckStatus.replaceValues(value, url, server, endpoint, config);
            }
            const start = new Date();
            Request.head({
                url: url,
                timeout: config.requestTimeout,
                gzip: config.compression,
                headers: headers
            }, (err: Error, result: IncomingMessage) => {
                if (err) {
                    return resolve({
                        url: url,
                        httpStatus: (result ? result.statusCode : null) || 599,
                        completed: true,
                        startedAt: start,
                        endedAt: new Date()
                    });
                }
                resolve({
                    url: url,
                    httpStatus: (result ? result.statusCode : null) || 599,
                    completed: true,
                    startedAt: start,
                    endedAt: new Date()
                });
            });
        });
    }

    public static checkStatus(config: CheckConfig): Promise<CheckResult[]> {
        const checks = [];
        for (let server of config.servers) {
            for (let endpoint of config.endpoints) {
                checks.push(CheckStatus.checkHttp(server, endpoint, config));
            }
        }
        return Promise.all(checks);
    }
}
