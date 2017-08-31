/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable } from "inversify";
import { DataGrid, JSONModel, TextRenderer } from '@phosphor/datagrid';

@injectable()
export class MarkersWidget extends DataGrid {

    constructor() {
        super({
            style: {
                headerBackgroundColor: '#2E2E2E',
                gridLineColor: '#2E2E2E'
            }
        });

        this.model = new JSONModel({
            'data': [
                {
                    'testcol': 'bla',
                    'blacol': 'blubb'
                }
            ],
            'schema': {
                fields: [
                    {
                        name: 'testcol',
                        type: 'string'
                    },
                    {
                        name: 'blacol',
                        type: 'string'
                    }
                ]
            }
        });

        this.defaultRenderer = new TextRenderer({
            textColor: '#D4D4D4',
            font: '16px sans-serif'
        });

        this.id = 'markerWidget';
        this.title.label = 'Markers';
        this.title.closable = true;
        this.title.iconClass = ' fa fa-table';
        this.addClass('markers-container');
    }
};