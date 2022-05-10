A Foundry module for adding tags to RollTables to roll on.

Currently, you can roll by tag and all tables that share that tag will be considered. One will be randomly chosen to be rolled upon. You can optionally include RollTables in the Compendium. There is a macro included, but only one line is needed.

await TableTagsAPI.TableTagRoller(["Trading Post", "Specialty"]);

- See below for all properties

0.1.4
- Added the ability to look for multiple TableTags. All TableTags must be matched in order for the table to qualify. See new method below.
- If a table result is designated as "Roll Twice" the table will continue to be rolled on until two unique results are returned.
- Added the ability to roll on other tables when the [ROLL|tabletag1,tabletag2] is included.
- Added the ability to roll "quietly." No effects are accompanied with the table roll. See new method below.

TableTags.tableTagRoller(tableTag, quietMode = false, includeCompendium = true)

tableTag can be a single TableTag or an array of TableTags. ["TableTag1","TableTag2"]. All TableTags must be matched in order for the table to qualify.
quietMode = true | dice effects will not be played (sounds and Dice So Nice). This is effective when you have scripts generating content requiring more than one roll on tables. Default is false.
includeCompendium = false | Tables in the compendium will be ignored. Default is true.

A future update will monitor all rolls on all tables and review if there are tags present. If so, it will look for RollTables with shared tags and randomly choose one. In the case of a RollTable having multiple tags, a dialog box will be presented for the user to choose which tag to roll with.

![image](https://user-images.githubusercontent.com/84727873/167242361-2b306e93-d3bb-4a84-9d54-bcb1d6befd50.png)
