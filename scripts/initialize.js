import { TableTags, injectTableTags, TableTagsMacroAPI } from "./tabletags.js"

Hooks.on('renderRollTableConfig', (rollTableConfig, html, rollTable) => {
    injectTableTags(rollTableConfig, html);
});

Hooks.once('ready', async () => {
    await TableTags.initialize();
    globalThis.tableTagsRoller = TableTagsMacroAPI.tableTagsRoller;
    globalThis.TableTagsAPI = TableTagsMacroAPI.TableTagsAPI;
});

