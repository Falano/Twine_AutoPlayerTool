# Twine_AutoPlayerTool
an auto-player tool for Interarctive Fiction editor Twine, for editing and debugging purposes
expanded from base code by juipor on reddit

## USES:
- check if your narration is fluid
(by exporting all the text shown when playing one random run)
- quickly check if you have loops or unreachable passages 
(by counting how many times we go to each passage over several randomized games)

## LIMITATIONS:
Only for pretty linear narrative games.
Does not work with puzzle games, probably, 
or anything that requires input from the player.
Basically just clicks stuff at random and writes down what happens.

## HOW TO:
**short version:**
AutoPlayer.run() or AutoPlayer.run(SomeNumberHere) in the browser's console
**long version:**
put the code below in the 'Story Javascript' window in twine
then start the game ('play' button)
then in the browser open the inspector (F12), go to the console
and type:
AutoPlayer.run()
if you want one file with one (randomly chosen) path, 
all titles and narrative text shown in a linear way like a player will
or:
AutoPlayer.run(5)
if you want one file with the stats on which passages were visited during those
5 random runs. (only contains titles and number of visits, 
does not contain the narrative text)
works for more or less than 5 too.
Imo it gives more interesting information if you run it at least 100 times,
but the first time you do run it you should try a low number
to get a feel for how long it'll be
