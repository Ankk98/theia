/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { interfaces, Container } from "inversify";
import { MarkersTree } from './markers-tree';
import { MarkersWidget } from './markers-widget';
import { createTreeContainer, Tree, ITree, TreeWidget } from "@theia/core/lib/browser";

export function createMarkerContainer(parent: interfaces.Container): Container {
    const child = createTreeContainer(parent);

    child.unbind(Tree);
    child.bind(MarkersTree).toSelf();
    child.rebind(ITree).toDynamicValue(ctx => ctx.container.get(MarkersTree));

    child.unbind(TreeWidget);
    child.bind(MarkersWidget).toSelf();

    return child;
}

export function createMarkerWidget(parent: interfaces.Container): MarkersWidget {
    return createMarkerContainer(parent).get(MarkersWidget);
}

