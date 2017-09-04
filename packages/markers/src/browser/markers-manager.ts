/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable } from "inversify";
import URI from "@theia/core/lib/common/uri";
import { Disposable, Event, Emitter } from "@theia/core/lib/common";

export interface Marker {
    uri: URI;
    kind: string;
    owner: string;
}

export interface MarkerFile {
    counter: number;
    uri: URI
}

export class MarkerCollection implements Disposable {

    constructor(
        public readonly owner: string,
        protected readonly manager: MarkersManager
    ) { }

    dispose(): void {
        this.manager.deleteCollection(this.owner);
    }

    setMarkers(markers: Marker[]): void {
        this.manager.setMarkersByOwner(this.owner, markers);
    }

}

@injectable()
export class MarkersManager {

    protected readonly markers = new Map<string, Marker[]>();
    protected readonly owners = new Map<string, MarkerCollection>();
    protected readonly onDidChangeMarkersEmitter = new Emitter<void>();

    get onDidChangeMarkers(): Event<void> {
        return this.onDidChangeMarkersEmitter.event;
    }
    protected fireOnDidChangeMarkers(): void {
        this.onDidChangeMarkersEmitter.fire(undefined);
    }

    createCollection(owner: string): MarkerCollection {
        if (this.owners.has(owner)) {
            throw new Error('marker collection for the given owner already exists, owner: ' + owner);
        }
        const collection = new MarkerCollection(owner, this);
        this.owners.set(owner, collection);
        return collection;
    }

    deleteCollection(owner: string): void {
        this.owners.delete(owner);
    }

    forEach(cb: (marker: Marker) => void): void {
        for (const markers of this.markers.values()) {
            for (const marker of markers) {
                cb(marker);
            }
        }
    }

    forEachByKind(kind: string, cb: (marker: Marker) => void): void {
        this.forEach(marker => {
            if (marker.kind === kind) {
                cb(marker);
            }
        });
    }

    getMarkerFilessByKind(kind: string): MarkerFile[] {
        const markerFiles: MarkerFile[] = [];
        this.forEachByKind(kind, (marker: Marker) => {
            const markerFile = markerFiles.find(mf => mf.uri.toString() === marker.uri.toString());
            if (!markerFile) {
                markerFiles.push({
                    uri: marker.uri,
                    counter: 1
                });
            } else {
                markerFile.counter++;
            }
        });
        return markerFiles;
    }

    getMarkersByUriAndKind(uri: URI, kind: string): Marker[] {
        const markers: Marker[] = [];
        this.forEachByKind(kind, marker => {
            if (uri.toString() === marker.uri.toString()) {
                markers.push(marker);
            }
        });
        return markers;
    }

    setMarkersByOwner(owner: string, markers: Marker[]): void {
        this.markers.set(owner, markers);
        this.fireOnDidChangeMarkers();
    }
}
