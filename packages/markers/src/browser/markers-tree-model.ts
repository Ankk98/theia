/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { injectable, inject } from "inversify";
import { TreeModel, TreeServices } from "@theia/core/lib/browser";
import { MarkersTree } from './markers-tree';
import { MarkersManager } from './markers-manager';

@injectable()
export class MarkersTreeServices extends TreeServices {
    @inject(MarkersManager) readonly markersManager: MarkersManager;
}

@injectable()
export class MarkersTreeModel extends TreeModel {

    protected readonly markersManager: MarkersManager;

    constructor(
        @inject(MarkersTree) protected readonly markersTree: MarkersTree,
        @inject(MarkersTreeServices) readonly services: MarkersTreeServices
    ) {
        super(markersTree, services);
    }
}
