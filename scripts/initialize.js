import { TableTags, injectTableTags, TableTagsMacroAPI } from "./tabletags.js"
import { TableTagsTable } from "./tabletagstable.js";

Hooks.on('renderRollTableConfig', (rollTableConfig, html, rollTable) => {
    injectTableTags(rollTableConfig, html);
});

Hooks.on('init', async() => {
    // RollTables.unregisterSheet("base", RollTable);
    // RollTables.registerSheet("tabletags", TableTagsTable, { types: ["base"], makeDefault: true });
});

Hooks.once('ready', async () => {
    await TableTags.initialize();
    globalThis.tableTagsRoller = TableTagsMacroAPI.tableTagsRoller;
    globalThis.TableTagsAPI = TableTagsMacroAPI.TableTagsAPI;
});

Hooks.on('ironswornOracles', async (...args) => {
    console.log(...args);
});

