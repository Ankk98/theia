/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { ContainerModule } from "inversify";
import { MarkersWidget } from './markers-widget';
import { MarkersContribution } from './markers-contribution';
import { MarkersManager } from './markers-manager';
import { createMarkerWidget } from './markers-container';
import { ProblemMarker } from './problem-marker';
import { CommandContribution, MenuContribution, KeybindingContribution } from "@theia/core/lib/common";
import URI from "@theia/core/lib/common/uri";

export default new ContainerModule(bind => {
    bind(MarkersManager).toSelf().inSingletonScope().onActivation((ctx, manager) => {
        const testCollection = manager.createCollection('test');
        const testMarker1: ProblemMarker = {
            kind: 'problem',
            uri: new URI('/the/path/to/problem.ts'),
            diagnostic: {
                message: 'this is a dangerous problem',
                range: {
                    start: {
                        line: 1,
                        character: 2
                    },
                    end: {
                        line: 1,
                        character: 16
                    }
                }
            },
            owner: testCollection.owner
        };
        const testMarker2: ProblemMarker = {
            kind: 'problem',
            uri: new URI('/the/path/to/problem.ts'),
            diagnostic: {
                message: 'this is also a dangerous problem',
                range: {
                    start: {
                        line: 4,
                        character: 23
                    },
                    end: {
                        line: 4,
                        character: 26
                    }
                }
            },
            owner: testCollection.owner
        };
        const testMarker3: ProblemMarker = {
            kind: 'problem',
            uri: new URI('/the/path/to/anotherproblem.ts'),
            diagnostic: {
                message: 'serious! very, very serious!',
                range: {
                    start: {
                        line: 13,
                        character: 7
                    },
                    end: {
                        line: 23,
                        character: 3
                    }
                }
            },
            owner: testCollection.owner
        };


        testCollection.setMarkers([
            testMarker1, testMarker2, testMarker3
        ]);

        return manager;
    });
    bind(MarkersWidget).toDynamicValue(ctx =>
        createMarkerWidget(ctx.container)
    ).inSingletonScope();
    bind(MarkersContribution).toSelf().inSingletonScope();
    for (const identifier of [CommandContribution, MenuContribution, KeybindingContribution]) {
        bind(identifier).toDynamicValue(ctx =>
            ctx.container.get(MarkersContribution)
        ).inSingletonScope();
    }
});
