window.AutoPlayer = {
  

	/*wait time between two choices, in milliseconds,
	to be sure that everything has time to load;
	could be lowered if necessary, but a too short one may cause issues.
	The <<done>> sugarcube macro triggers after 40 milliseconds*/
	delay: 50,
	/*an array of all links on page*/
	linkTarget : ".passage .link-internal",
	/*story ends if enters this passage*/
	endPoints: [/*add your own ending passages here, like so: "Ending Passage 1", "Ending Passage 2"*/],
	/*tags that will be counted only if they are passed through (no "0" state)*/
	tagsToIgnore: [/*add your own here, like so: "Tag to ignore 1", "Tag to ignore 2", "Tag to ignore 3"*/],
	/*quits and saves after having visited this many passages in one game
	to avoid infinite loops*/
	maxPassages: 100,
	/*is automatically set to maxPassages when game starts*/
	passagesLeft: 0,
	/*is automatically set to current passage when you run this script;
	it is the passage it goes back to when it restarts*/
	startPoint: "",
	/*whether we want to see all the debug messages*/
	debug: false,
  
  
	/*run through the story with random choices, till the end*/
	loop(once, num = 0) {
		if(this.debug){console.log("looping at " + passage())};
		
		if (once){
			/*add passage title and text to the array whose contents will be printed*/
			this.logPassageWNarr();
		} else{
			this.logPassageWTimes();
		}
		/*from the array of all links, choose one*/
		let target = this.getRandom();
		/*if there are no links or if reached the designated ending*/
		if (!target || this.endPoints.includes(passage()) || this.passagesLeft <= 0) {
			//if we think we've been stuck in a loop
			if(this.passagesLeft <= 0){
				/* please bear in mind maybe the loop is just hard, not impossible, to get out of,
				in which case maybe the current passage is not the loopy one. Check your stats on export*/
					this.passagesArray.push({title: "ERROR", 
					times: `WAS IN A LOOP!!!!!! HEEEEELP I CAN'T GET OUT OF ${passage()}!!!!`, 
					text: `\n\n\n\n\n\n\n\n\nWAS IN A LOOP!!!!!! HEEEEELP I CAN'T GET OUT OF ${passage()}!!!!`});
				};
			/* if we just wanted to run it once to get narrative text, then*/
			/*format and export all text gathered in array till now*/
			if (once){
				return this.exportTitlesAndNarration();
				/*but if we wanted to run it a bunch of times, then*/
				/*check whether we've ran the whole bunch*/
				/*and run it some more if we haven't*/
			} else{
				num--;
				console.log(`Restarting a new game after ${this.maxPassages-this.passagesLeft} turns. Games left to play before exporting results: ${num}`)
				this.passagesLeft = this.maxPassages;
				/*if didn't finish the number of games asked for, restart and reloop*/
				if(num>0){
					/* I tried Engine.restart() but it complained about permissions,
					and clicking buttons with click() wouldn't work either*/
					$.wiki("<<goto 'StoryInit'>>");
					$.wiki("<<goto '" + this.startPoint + "' >>");
					/*waiting a bit more than usual 
					before starting the new game, just in case*/
					setTimeout(() => {
						this.loop(once, num);
						}, this.delay*2);
						return;
				/*if did as many games as asked, save and stop*/
				} else{
					return this.exportTitlesAndTimes();
				};
			};
    	};
		/*click on the random link chosen earlier, to go forth with the story*/
		target.click();
		/*count how many passages you can still cross before we stop
		for loop-avoiding reasons*/
		this.passagesLeft--;
		/*wait, then do all this again (we are now in next passage)*/
		setTimeout(() => {
			this.loop(once, num);
			}, this.delay);
	},


	/*add passage title and text to the array whose contents we'll print*/
	logPassageWNarr() {
		if(this.debug){console.log("logging passage with narration ")};
		this.passagesArray.push({
		title: passage(),
		text: $(".passage").html()
		});
	},
	
	
	/*increment (in the array whose contents we'll print) how many times we've read this passage */
	logPassageWTimes() {
		if(this.debug){console.log("logging passage with times ")};
		// if we decided to ignore passages with a tag that we can actually get into,
		// then we add them to the array now
		if(this.passagesArray.find((obj) => obj.title === passage())){
			this.passagesArray.find((obj) => obj.title === passage()).times += 1;
		}else{
			this.passagesArray.push({title: passage(), times:1});
		};
    },
  
  
	/*get a list of all passages with their title and a "times" stat equaling 0*/
	/*you can ignore those with one specific tag*/
	getAllPassagesTitles(tagsToIgnore){
		if(this.debug){console.log("getting all passages' titles")};
		/*array who will then be formatted and printed*/
		this.passagesArray = [];
		/*grab all passages except those who have the wrong tag*/
		let allPassages = Story.filter(function(p) {return p});
		for (let tag of tagsToIgnore){
			allPassages = allPassages.filter(pass => !pass.tags.includes(tag));
		}
		/*save their title and a number initialized at 0 into the array of passages*/
		for (let i of allPassages){
			this.passagesArray.push({title: i.name, times: 0});
		};
	},
  

	/*format and export all text (titles and narration) gathered in array till now*/
	exportTitlesAndNarration() {
		if(this.debug){console.log("exporting titles and narration")};
		let preview = "";
		for (let { title, text } of this.passagesArray) {
			text = text.replaceAll("<br>", "\n").replace(/<.+?>/gs, ""); // scrub elements, turn <br> to new lines
			preview+= `\n\nPassage : ${title} \n\n${text}`;
		}
		this.exportFile(preview, `game-text.txt`);
	},
  
  
	/*format and export all text (titles and times) gathered in array till now*/
	exportTitlesAndTimes(){
		if(this.debug){console.log("exporting titles and times")};
		let preview = "";
		for (let {title, times} of this.passagesArray){
			if(times === 0){
				/*evidentiate passages that were never run*/
				preview += "!!!!!!!!!!!!!!!!!!!!!!"
			};
			preview += `${title} : ${times}\n`;
		};
		this.exportFile(preview, `game-titlesFrequency.txt`);
	},


	getRandom() {
		if(this.debug){console.log("getting random link")};
		return [...$(this.linkTarget)].random();
	},

    
	/*export data to file saved on the computer*/
	exportFile(data, title) {
		if(this.debug){console.log("exporting file")};
		data = new Blob([data], { type: "txt" });
		const href = URL.createObjectURL(data);
		$("<a>", {
			href,
			download: title
		})[0].click();
		setTimeout(() => URL.revokeObjectURL(url), 40);
	},


	/*plays once with random choices and prints the story text linearily*/
	runOncePrintNarr() {
		if(this.debug){console.log("running once to print narration")};
		/*array who will then be formatted and printed*/
		this.passagesArray = [];
		/*run through the story with random choices, till the end*/
		this.loop(true);
	},


	/*run the game a bunch of times and write down how many times each passage is read*/
	runLotsPrintTitles(num=100){
		if(this.debug){console.log("running lots of times to print titles and times")};
		this.getAllPassagesTitles(this.tagsToIgnore);
		this.loop(false, num);
	},
	
	
	/* use run() to write the text of the random path in a linear way; 
	use run(someNumber) to run it [someNumber] times 
	and write down how many times each passage was visited
	(only titles and times visible, not narrative text)*/
	run(num = 0){
		this.passagesLeft = this.maxPassages;
		if(this.debug){console.log("running")};
		if (num === 0){
			this.runOncePrintNarr()
		}else{
			this.startPoint = passage()
			this.runLotsPrintTitles(num)
		};
	}
};
