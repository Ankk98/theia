/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { injectable, inject } from 'inversify';
import { DataGrid, JSONModel, TextRenderer } from '@phosphor/datagrid';
import { MarkersManager } from './markers-manager';
import { ProblemMarker, ProblemMarkerScheme } from './problem-marker';

@injectable()
export class MarkersWidget extends DataGrid {

    constructor( @inject(MarkersManager) protected readonly markerManager: MarkersManager) {
        super({
            style: {
                headerBackgroundColor: '#2E2E2E',
                gridLineColor: '#2E2E2E'
            }
        });

        this.model = new JSONModel({
            'data': this.getData(),
            'schema': {
                fields: [
                    {
                        name: 'filename',
                        title: 'Filename',
                        type: 'string'
                    },
                    {
                        name: 'path',
                        title: 'Path',
                        type: 'string'
                    },
                    {
                        name: 'message',
                        title: 'Message',
                        type: 'string'
                    },
                    {
                        name: 'position',
                        title: 'Position',
                        type: 'string'
                    },

                ]
            }
        });

        this.defaultRenderer = new TextRenderer({
            textColor: '#D4D4D4',
            font: '14px sans-serif'
        });

        this.id = 'markerWidget';
        this.title.label = 'Markers';
        this.title.closable = true;
        this.title.iconClass = ' fa fa-table';
        this.addClass('markers-container');
    }

    protected getData(): ProblemMarkerScheme[] {
        const data: ProblemMarkerScheme[] = [];

        this.markerManager.forEachByKind('problem', (marker: ProblemMarker) => {
            data.push({
                filename: marker.uri.displayName,
                path: marker.uri.path.dir.toString(),
                message: marker.diagnostic.message,
                position: marker.diagnostic.range.start.line + ", " + marker.diagnostic.range.start.character
            });
        });

        return data;
    }

}
