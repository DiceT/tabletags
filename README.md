A Foundry module for adding tags to RollTables to roll on.

Currently, you can roll by tag and all tables that share that tag will be considered. One will be randomly chosen to be rolled upon. You can optionally include RollTables in the Compendium. There is a macro included, but only one line is needed.

tableTagsRoller("TableTag", false);

// The first property is the name of the tag.
// The second property is whether you want to skip the tables in the Compendium or not. true to skip, false to include.

A future update will monitor all rolls on all tables and review if there are tags present. If so, it will look for RollTables with shared tags and randomly choose one. In the case of a RollTable having multiple tags, a dialog box will be presented for the user to choose which tag to roll with.

![image](https://user-images.githubusercontent.com/84727873/167242361-2b306e93-d3bb-4a84-9d54-bcb1d6befd50.png)
