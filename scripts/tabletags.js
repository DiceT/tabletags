export async function injectTableTags(rollTableConfig, html) {
    // create the TableTags container and inject it into the RolLTable application
    const injectAfterDescription = html.find('[class="form-group stacked"]');
    let content = `
        <div class="tabletags-container"><div class="tabletag-container">    
            <div class="tabletag"><span><strong><i class="fas fa-tags"></i></strong></span></div>
            <input class="tabletag-container input" />
        </div></div>`;
    injectAfterDescription.append(content);
    
    // identify the TableTag container, get the TableTags from the RolLTable
    const tableTagContainer = html[0].querySelector('.tabletag-container');
    const input = html[0].querySelector('.tabletag-container input');
    var tableTags =  rollTableConfig.object.getFlag("tabletags", "tags");

    // if there are no TableTags (first time opening the RollTable), create a TableTag header
    if (tableTags === undefined) {
        tableTags = []
        tableTags.push("[HEADER]");
    }
    
    // populate the TableTag container
    addTableTags();
    
    // if ENTER or TAB is pressed, add a new TableTag and create it
    html.on('keydown', '.tabletag-container input', (event) => {
        if (event.key === 'Enter' || event.key === 'Tab') {
            if (input.value != '') {
                tableTags.push(input.value);
                addTableTags();
                input.value = '';
            }
        }
    });

    // if the X is clicked, delete the TableTag
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

    function resetTableTags() {
        html[0].querySelectorAll('.tabletag').forEach(function(tag) {
            tag.parentElement.removeChild(tag);
        })
    }

    // this generates the HTML for a single TableTag
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
}

export class TableTags {
    // preload the Compendium to have access to the RollTables
    static async initialize() {
        await game.packs.forEach( pack => {
            pack?.getDocuments();
        });
    }

    // This handles searching for all shared TableTags and rolling on one of those tables
    static async TableTagRoller(tableTag, skipCompendium = true) {

        let tablesByTag = [];
        
        game.tables.forEach( table => {
            if (table.getFlag("tabletags", "tags") != undefined) {
                table.data.flags.tabletags.tags.forEach ( tag => {
                    if (tag === tableTag) tablesByTag.push(table);
                });
            }
        });

        if (!skipCompendium) {
            game.packs.forEach( pack => {
                if (pack.documentName === "RollTable") {
                    pack.forEach (table => {
                        if (table.getFlag("tabletags", "tags") != undefined) {
                            table.data.flags.tabletags.tags.forEach ( tag => {
                                if (tag === tableTag) tablesByTag.push(table);
                            });
                        }
                    });
                }
            });
        }
        
        let table = await tablesByTag[Math.floor(Math.random() * tablesByTag.length)];
        let roll = table.roll();
       
        table.draw(roll);
    }
}

// Export the TableTag Roller so macros can use the TableTagRoller function
export class TableTagsMacroAPI {
    static tableTagsRoller = TableTags.TableTagRoller;
}
