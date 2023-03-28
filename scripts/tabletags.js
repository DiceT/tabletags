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
    static async TableTagRoller( tableTags, quietMode = false, includeCompendium = true, asAnd = true ) {

        let tablesByTag = [];
        let tableTagArray = [];
        
        if ( Array.isArray(tableTags) ) {
            tableTagArray = tableTags;
        }
        else {
            tableTagArray.push(tableTags);
        }

        game.tables.forEach( table => {
            if (table.getFlag("tabletags", "tags") != undefined) {
                if ( asAnd ) {
                    if ( table.data.flags.tabletags.tags.filter(element => tableTagArray.includes(element)).length === tableTagArray.length ) {
                        tablesByTag.push(table);
                    };
                }
                if ( table.data.flags.tabletags.tags.filter(element => tableTagArray.includes(element)).length > 0 ) {
                    tablesByTag.push(table);
                };
            }
        })

        if ( includeCompendium ) {
            game.packs.forEach( pack => {
                if (pack.documentName === "RollTable") {
                    pack.forEach (table => {
                        if (table.getFlag("tabletags", "tags") != undefined) {
                            if ( asAnd ) {
                                if ( table.data.flags.tabletags.tags.filter(element => tableTagArray.includes(element)).length === tableTagArray.length ) {
                                    tablesByTag.push(table);
                                };
                            }
                            if ( table.data.flags.tabletags.tags.filter(element => tableTagArray.includes(element)).length > 0 ) {
                                tablesByTag.push(table);
                            };
                        }
                    });
                }
            });            
        }

        let table = await tablesByTag[Math.floor(Math.random() * tablesByTag.length)];
        let roll;
        let result;

        if ( quietMode ) {
            roll = await table.roll();
            result = roll.results[0].data.text;
        }
        else {
            roll = await table.draw();
            result = roll.results[0].text;
        }

        // Handle "Roll Twice" results.
        if ( result.toLowerCase() === "roll twice" ) {
            if ( quietMode ) {
                while ( result.toLowerCase() === "roll twice") {
                    roll = await table.roll();
                    result = roll.results[0].data.text;
                }
                roll = await table.roll();
                let resultB = roll.results[0].data.text;
                while ( resultB.toLowerCase() === "roll twice") {
                    roll = await table.roll();
                    resultB = roll.results[0].data.text;
                }
                result += " | " + resultB
            }
            else {
                while ( result.toLowerCase() === "roll twice") {
                    roll = await table.draw();
                    result = roll.results[0].text;
                }
                roll = await table.draw();
                let resultB = roll.results[0].text;
                while ( resultB.toLowerCase() === "roll twice") {
                    roll = await table.draw();
                    resultB = roll.results[0].text;
                }
                result += " | " + resultB
            }
        }

        // BADGES: 
        // [TAGS|tabletag1,tabletag2] - Roll on the provided TableTags
        // [TABLE|table] - Roll on the provided table
        // [ROLL|2d6+1] - Roll the provided dice
        let regEx = new RegExp('\\[(.*?)\\]');
        if ( regEx.test(result)) {
            let badge = regEx.exec(result)[1];
            let split = badge.split('|');
            let replace;
            switch ( split[0] ) {
                case "TAGS": 
                    replace = await this.TableTagRoller(split[1].split(","), true);
                    result = result.replace(regEx, replace);
                    break;
                case "TABLE":
                    break;
                case "ROLL":
                    let diceRoll = new Roll(split[1]);
                    await diceRoll.evaluate({async: true});
                    replace = (diceRoll.total);
                    result = result.replace(regEx, replace);
                    break;
            }
        }
        return result;
    }
}

// Export the TableTag Roller so macros can use the TableTagRoller function
export class TableTagsMacroAPI {
    static TableTagsAPI = TableTags;
    static tableTagsRoller = TableTags.TableTagRoller;
}
