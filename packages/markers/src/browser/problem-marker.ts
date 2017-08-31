/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { Marker } from "./markers-manager";
import { Diagnostic } from "vscode-languageserver-types";
import { ReadonlyJSONObject } from "@phosphor/coreutils/lib";

export interface ProblemMarkerScheme extends ReadonlyJSONObject {
    filename: string;
    path: string;
    message: string;
    position: string;
}

export interface ProblemMarker extends Marker {
    kind: 'problem';
    diagnostic: Diagnostic;
}
