/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from 'inversify';
import { FrontendApplicationContribution, ContextMenuRenderer } from '../../browser';
import { ElectronMenuContribution, ElectronMainMenuFactory } from "./electron-menu-plugin";
import { KeybindingContribution, CommandContribution, KeybindingContext, MenuContribution } from "../../common";
import { ElectronKeybindingContribution } from "./core-keybindings";
import { MenuCommandHandlers } from "./core-menu-commands";
import { CoreMenuContribution } from "./core-menu-contribution"
import { ElectronContextMenuRenderer } from "./electron-context-menu-renderer";

export default new ContainerModule(bind => {
    bind(ElectronMainMenuFactory).toSelf().inSingletonScope();
    bind(ContextMenuRenderer).to(ElectronContextMenuRenderer).inSingletonScope();
    bind(FrontendApplicationContribution).to(ElectronMenuContribution).inSingletonScope();
    bind(KeybindingContext).toConstantValue({
        id: "theia.context",
        isEnabled: true
    });

    bind(KeybindingContribution).to(ElectronKeybindingContribution).inSingletonScope();
    bind(CommandContribution).to(MenuCommandHandlers).inSingletonScope();
    bind(MenuContribution).to(CoreMenuContribution).inSingletonScope();
});
