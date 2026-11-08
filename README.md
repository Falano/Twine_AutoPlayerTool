# Autoplayer
an auto-player tool for Interarctive Fiction editor Twine, for editing and debugging purposes;

expanded from base code by juipor on reddit

## USES
- check if your narration is fluid (by exporting all the text shown when playing one random run)
- quickly check if you have loops or unreachable passages (by counting how many times we go to each passage over several randomized games)

## LIMITATIONS
- SugarCube-only (for now?)
- Only for pretty linear narrative games.
- Does not work with puzzle games, probably, or anything that requires input from the player.
- Basically just clicks stuff at random and writes down what happens.

## HOW TO
### short version
AutoPlayer.run() or AutoPlayer.run(SomeNumberHere) in the browser's console
### long version
put the code below in the 'Story Javascript' window in twine then start the game ('play' button); then in the browser open the inspector (F12), go to the console and type:

AutoPlayer.run()

if you want one file with one (randomly chosen) path, all titles and narrative text shown in a linear way like a player will

or:

AutoPlayer.run(5)

if you want one file with the stats on which passages were visited during those 5 random runs. Only contains titles and number of visits, does not contain the narrative text; works for more or less than 5 too.

Imo it gives more interesting information if you run it at least 100 times, but the first time you do run it you should try a low number to get a feel for how long it'll be

## VARIABLES TO SET BEFORE RUNNING
- endpoint variable: write your own endpoints there (game stops when it reaches it)
- tagsToIgnore variable: write your own ignorable tags (in counting mode, is not shown if worth 0)
- maxPassages: write here the number of passages after which it will consider the game done and stop so you can avoid infinite loops (so this should be higher than the longest run you'd want a player to be able to play) (in multiple runs mode, it signals the end of the current run, and then starts the next one)

## NOTES
### includes
if you have includes, it should in most cases count the include towards its parent.

So if passage B is included in passage A, it should count A twice and B not at all.

(in my tests, it did this for full-sized passages (whether triggered by a click or shown automatically) but not for automatic one-word changes in the middle of a bigger paragraph (which counted A once and B not at all); I guess it depends on passage length, and maybe on whether you need to click a link to show the include)

### non-passage links / non-story-relevant links
if you have a stats setter screen or similar, where you can change your mind and lower your stats and as such you don't easily reach a state where the "next" button is the only one active, then code a switch that you turn on when testing that deactivates the stats buttons and sets the stats at random instead. For example: a $isTesting var in your StoryInit that you manually set to true when testing, and using in your stats setter a two-part if depending on $isTesting to check which version (automated or manual) is used.

If you have a part where you can go somewhere a whole lot of times but only the first one is useful, consider making it a once-only link, at least for the testing version.

### start point
if you play a bit and only start the autoplayer when you're in the middle of the game, and use the "multiple games in a row" mode, then every game will start from the passage you were on when you ran it and not from the real start of the story
