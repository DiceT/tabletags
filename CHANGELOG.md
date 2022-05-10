0.1.4
- Added the ability to look for multiple TableTags. All TableTags must be matched in order for the table to qualify. See new method below.
- If a table result is designated as "Roll Twice" the table will continue to be rolled on until two unique results are returned.
- Added the ability to roll on other tables when the [ROLL|tabletag1,tabletag2] is included.
- Added the ability to roll "quietly." No effects are accompanied with the table roll. See new method below.

TableTags.tableTagRoller(tableTag, quietMode = false, includeCompendium = true)

tableTag can be a single TableTag or an array of TableTags. ["TableTag1","TableTag2"]. All TableTags must be matched in order for the table to qualify.
quietMode = true | dice effects will not be played (sounds and Dice So Nice). This is effective when you have scripts generating content requiring more than one roll on tables. Default is false.
includeCompendium = false | Tables in the compendium will be ignored. Default is true.

0.1.3
- Added a check to skip tables that do not have TableTags.

0.1.2
- Refactored the module.
- Relocated tabletags into its own script, created initialize.js to handle the flow.