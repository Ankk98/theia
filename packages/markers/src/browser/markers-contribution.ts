/*
* Copyright (C) 2017 TypeFox and others.
*
* Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
* You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
*/

import { MarkersWidget } from './markers-widget';
import { inject, injectable } from "inversify";
import {
    CommandContribution,
    MenuContribution,
    KeybindingContribution,
    KeybindingRegistry,
    MenuModelRegistry,
    CommandRegistry,
    Command,
    KeyCode,
    Key,
    Modifier,
    MAIN_MENU_BAR
} from "@theia/core/lib/common";
import { FrontendApplication } from "@theia/core/lib/browser";

export namespace MarkersCommands {
    export const OPEN: Command = {
        id: 'markers:open',
        label: 'Markers'
    }
}

@injectable()
export class MarkersContribution implements CommandContribution, MenuContribution, KeybindingContribution {

    constructor(
        @inject(MarkersWidget) protected readonly markerWidget: MarkersWidget,
        @inject(FrontendApplication) protected readonly app: FrontendApplication) {

    }

    registerKeyBindings(keybindings: KeybindingRegistry): void {
        keybindings.registerKeyBinding({
            commandId: MarkersCommands.OPEN.id,
            keyCode: KeyCode.createKeyCode({
                first: Key.KEY_M, modifiers: [Modifier.M2, Modifier.M1]
            })
        });
    }

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerSubmenu([MAIN_MENU_BAR], 'view', 'View');
        menus.registerMenuAction([MAIN_MENU_BAR, 'view'], {
            commandId: MarkersCommands.OPEN.id
        });
    }

    registerCommands(commands: CommandRegistry): void {
        commands.registerCommand(MarkersCommands.OPEN, {
            isEnabled: () => true,
            execute: () => this.newMarkerView()
        });
    }

    protected newMarkerView(): void {
        this.app.shell.addToMainArea(this.markerWidget);
        this.app.shell.activateMain(this.markerWidget.id);
    }
}