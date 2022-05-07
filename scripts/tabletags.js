Hooks.on('renderRollTableConfig', (rollTableConfig, html, rollTable) => {
    const injectAfterDescription = html.find('[class="form-group stacked"]');
    let content = `
        <div class="tabletags-container">
            <div class="tabletag-container">    
            <div class="tabletag"><span><strong><i class="fas fa-tags"></i></strong></span></div>
                <input class="tabletag-container input" />
            </div>
        </div>
    `;
    injectAfterDescription.append(content);

    const tableTagContainer = html[0].querySelector('.tabletag-container');
    const input = html[0].querySelector('.tabletag-container input');
    var tableTags =  rollTableConfig.object.getFlag("tabletags", "tags");

    if (tableTags === undefined) {
        tableTags = []
        tableTags.push("[HEADER]");
    }

    addTableTags();

    html.on('keydown', '.tabletag-container input', (event) => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            if (input.value != '') {
                tableTags.push(input.value);
                addTableTags();
                input.value = '';
            }
        }
    });

    html.on('click','.delete-tabletag', (event) => {
        const value = event.target.getAttribute('data-item');
        const index = tableTags.indexOf(value);
        tableTags = [...tableTags.slice(0, index), ...tableTags.slice(index + 1)]
        addTableTags();
    });

    function addTableTags() {
        resetTableTags();
        tableTags.slice().reverse().forEach(function(tag) {
            const content = createTableTagHTML(tag);
            tableTagContainer.prepend(content);
        });
        rollTableConfig.object.setFlag("tabletags", "tags", tableTags);
    }

    function createTableTagHTML(label) {
        const div = document.createElement('div');
        div.setAttribute('class', 'tabletag');
        const span = document.createElement('span');
        var close = "";

        if (label === '[HEADER]') {
            close = document.createElement('i');
            close.setAttribute('class', 'fas fa-tags');
            close.setAttribute('title', 'Add Table Tags to Group Tables');
        }
        else {
            span.innerHTML = label;
            close = document.createElement('i');
            close.setAttribute('class', 'fas fa-times delete-tabletag');
            close.setAttribute('data-item', label);
        }
        div.appendChild(span);
        div.appendChild(close);

        return div;
    }

    function resetTableTags() {
        html[0].querySelectorAll('.tabletag').forEach(function(tag) {
            tag.parentElement.removeChild(tag);
        })
    }
});

class TableTags {
    // preload the Compendium to have access to the RollTables
    static async initialize() {
        await game.packs.forEach( pack => {
            pack?.getDocuments();
        });
    }

    static async TableTagRoller(tableTag, skipCompendium = true) {

        let tablesByTag = [];
        
        game.tables.forEach( table => {
            table.data.flags.tabletags.tags.forEach ( tag => {
                if (tag === tableTag) tablesByTag.push(table);
            });
        });

        if (!skipCompendium) {
            game.packs.forEach( pack => {
                if (pack.documentName === "RollTable") {
                    pack.forEach (table => {
                        table.data.flags.tabletags.tags.forEach ( tag => {
                            if (tag === tableTag) tablesByTag.push(table);
                        });
                    });
                }
            });
        }
        
        let table = await tablesByTag[Math.floor(Math.random() * tablesByTag.length)];
        let roll = table.roll();
       
        table.draw(roll);
    }
}

Hooks.once('ready', async () => {
    await TableTags.initialize();
});

class TableTagsMacroAPI {
    static tableTagsRoller = TableTags.TableTagRoller;
}

globalThis.tableTagsRoller = TableTagsMacroAPI.tableTagsRoller;