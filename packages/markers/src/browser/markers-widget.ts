/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { injectable, inject } from 'inversify';
import { MarkersManager } from './markers-manager';
import { MarkerFileNode } from './markers-tree';
import { TreeWidget, TreeProps, TreeModel, ContextMenuRenderer, ITreeNode, NodeProps } from "@theia/core/lib/browser";
import { h } from "@phosphor/virtualdom/lib";

@injectable()
export class MarkersWidget extends TreeWidget {

    constructor(
        @inject(MarkersManager) protected readonly markerManager: MarkersManager,
        @inject(TreeProps) readonly treeProps: TreeProps,
        @inject(TreeModel) readonly markerTreeModel: TreeModel,
        @inject(ContextMenuRenderer) readonly contextMenuRenderer: ContextMenuRenderer
    ) {
        super(treeProps, markerTreeModel, contextMenuRenderer);

        this.id = 'markers';
        this.title.label = 'Markers';
        this.title.closable = true;
        this.title.iconClass = ' fa fa-table';
        this.addClass('markers-container');
    }

    protected decorateCaption(node: ITreeNode, caption: h.Child, props: NodeProps): h.Child {
        if (MarkerFileNode.is(node)) {
            return super.decorateExpandableCaption(node, h.div({}, 'FILE: ' + caption), props);
        }
        return h.div({}, caption);
    }
}
