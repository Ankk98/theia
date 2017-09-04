/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { injectable, inject } from 'inversify';
import { MarkersManager } from './markers-manager';
import { MarkerFileNode, MarkerNode } from './markers-tree';
import { TreeWidget, TreeProps, TreeModel, ContextMenuRenderer, ITreeNode, NodeProps } from "@theia/core/lib/browser";
import { h } from "@phosphor/virtualdom/lib";
import { DiagnosticSeverity } from "vscode-languageserver-types";

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
        this.addClass('markers-container');
    }

    protected decorateCaption(node: ITreeNode, caption: h.Child, props: NodeProps): h.Child {
        if (MarkerFileNode.is(node)) {
            return super.decorateExpandableCaption(node, this.decorateMarkerFileNode(node, caption), props);
        } else if (MarkerNode.is(node)) {
            return super.decorateCaption(node, this.decorateMarkerNode(node, caption), props);
        }
        return h.div({}, caption);
    }

    protected decorateMarkerNode(node: MarkerNode, caption: h.Child): h.Child {
        let severityClass: string = '';
        if (node.diagnostic.severity) {
            severityClass = this.getSeverityClass(node.diagnostic.severity);
        }
        const severityDiv = h.div({}, h.i({ className: severityClass }));
        const ownerDiv = h.div({ className: 'owner' }, '[' + node.owner + ']');
        const messageDiv = h.div({}, node.diagnostic.message);
        const startingPointDiv = h.div({ className: 'position' }, '(' + node.diagnostic.range.start.line + ', ' + node.diagnostic.range.start.character + ')');
        return h.div({ className: 'markerNode' }, severityDiv, ownerDiv, messageDiv, startingPointDiv);
    }

    protected getSeverityClass(severity: DiagnosticSeverity): string {
        switch (severity) {
            case 1: return 'fa fa-times-circle error';
            case 2: return 'fa fa-exclamation-circle warning';
            case 3: return 'fa fa-info-circle information';
            case 4: return 'fa fa-hand-o-up hint';
            default: return '';
        }
    }

    protected decorateMarkerFileNode(node: MarkerFileNode, caption: h.Child): h.Child {
        const filenameDiv = h.div({}, node.uri.displayName);
        const pathDiv = h.div({ className: 'path' }, node.uri.path.toString());
        const counterDiv = h.div({ className: 'counter' }, node.numberOfMarkers.toString());
        return h.div({ className: 'markerFileNode' }, filenameDiv, pathDiv, counterDiv);
    }
}
