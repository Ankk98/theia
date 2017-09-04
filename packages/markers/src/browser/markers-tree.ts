/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { injectable, inject } from "inversify";
import { Tree, ICompositeTreeNode, ITreeNode, ISelectableTreeNode, IExpandableTreeNode } from "@theia/core/lib/browser";
import { MarkersManager } from './markers-manager';
import { ProblemMarker } from './problem-marker';
import { UriSelection } from "@theia/filesystem/lib/common";
import { Diagnostic } from "vscode-languageserver-types";

@injectable()
export class MarkersTree extends Tree {

    protected markerRoot: MarkerRootNode;

    constructor( @inject(MarkersManager) protected readonly markersManager: MarkersManager) {
        super();

        markersManager.onDidChangeMarkers(() => this.refresh());

        // TODO must be generalized
        this.markerRoot = {
            visible: false,
            id: 'markerTree',
            name: 'MarkerTree',
            kind: 'problem',
            children: [],
            parent: undefined
        };

        this.root = this.markerRoot;
    }

    resolveChildren(parent: ICompositeTreeNode): Promise<ITreeNode[]> {
        if (MarkerRootNode.is(parent)) {
            return this.getFileNodes((parent as MarkerRootNode));
        } else if (MarkerFileNode.is(parent)) {
            return this.getMarkerNodes(parent);
        }
        return super.resolveChildren(parent);
    }

    getFileNodes(parent: MarkerRootNode): Promise<MarkerFileNode[]> {
        const markerFiles = this.markersManager.getMarkerFilessByKind(this.markerRoot.kind);
        const uriNodes: MarkerFileNode[] = [];
        markerFiles.forEach(markerFile => {
            const markerFileNode: MarkerFileNode = {
                children: [],
                expanded: false,
                uri: markerFile.uri,
                visible: true,
                id: 'markerFile-' + markerFile.uri.displayName,
                name: markerFile.uri.displayName,
                parent,
                selected: false,
                numberOfMarkers: markerFile.counter
            };
            uriNodes.push(markerFileNode);
        });
        return Promise.resolve(uriNodes);
    }

    getMarkerNodes(parent: MarkerFileNode): Promise<MarkerNode[]> {
        const markers = this.markersManager.getMarkersByUriAndKind(parent.uri, parent.parent.kind);
        const markerNodes: MarkerNode[] = [];
        let counter: number = 0;
        markers.forEach((marker: ProblemMarker) => {
            counter++;
            const markerNode: MarkerNode = {
                id: 'marker-' + marker.uri.displayName + '-' + counter,
                name: marker.diagnostic.message,
                parent: parent,
                selected: false,
                uri: marker.uri,
                diagnostic: marker.diagnostic,
                owner: marker.owner
            };
            markerNodes.push(markerNode);
        });

        return Promise.resolve(markerNodes);
    }

}

// TODO must be generalized - diagnostic is problem view related
export interface MarkerNode extends UriSelection, ISelectableTreeNode {
    diagnostic: Diagnostic;
    owner: string;
}
export namespace MarkerNode {
    export function is(node: ITreeNode | undefined): node is MarkerNode {
        return UriSelection.is(node) && ISelectableTreeNode.is(node) && 'diagnostic' in node;
    }
}

export type MarkerFileNode = UriSelection & ISelectableTreeNode & IExpandableTreeNode & { parent: MarkerRootNode, numberOfMarkers: number };
export namespace MarkerFileNode {
    export function is(node: ITreeNode | undefined): node is MarkerFileNode {
        return IExpandableTreeNode.is(node) && UriSelection.is(node);
    }
}

export interface MarkerRootNode extends ICompositeTreeNode {
    kind: string;
}
export namespace MarkerRootNode {
    export function is(node: ITreeNode | undefined): node is MarkerRootNode {
        return ICompositeTreeNode.is(node) && 'kind' in node;
    }
}
