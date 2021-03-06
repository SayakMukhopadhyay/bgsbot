/*
 * KodeBlox Copyright 2019 Sayak Mukhopadhyay
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: //www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

import bugsnag, { Client } from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';
import { ProcessVars } from './processVars';
import { BugsnagSecrets } from './secrets';

export class BugsnagClient {
    private version;
    public client: Client;

    constructor() {
        this.version = ProcessVars.version;
        this.initialiseBugsnag();
    }

    initialiseBugsnag(): void {
        this.client = bugsnag.start({
            apiKey: BugsnagSecrets.token,
            enabledReleaseStages: ['development', 'production'],
            plugins: [bugsnagExpress],
            appVersion: this.version
        });
    }

    call(err, metaData?, logToConsole = true): void {
        if (BugsnagSecrets.use) {
            this.client.notify(err, event => {
                event.addMetadata('Custom', metaData);
            });
        }
        if (logToConsole) {
            console.log(err);
        }
    }
}
