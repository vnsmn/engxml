var DEBUG = false;

function printDebug(title,message) {
	if (DEBUG) {
		console.log(title + ": " + message);
	}
}

function Murphy(elementaryJson, intermediaJson) {
	this.book = localStorage.murphybook
	this.unit = localStorage.murphyunit;
	this.elementaryJson = elementaryJson;
	this.intermediaJson = intermediaJson;
	this.sources = [];
	this.accordionID = null;
	this.playUnitsButton = Murphy.createPlayButton();
}

Murphy.prototype.reset = function() {
	this.sources = [];
	this.playUnitsButton.empty();
	this.playUnitsButton.removeData("sound_sources");
	$("#" + this.accordionID).empty();
	$("#" + this.accordionID).removeAttr("role");
	$("#" + this.accordionID).removeClass();
	$("#" + this.accordionID).removeData();	
}

Murphy.createPlayButton = function() {
	return $("<img style='cursor:pointer;' src=\"css/images/media-playback-start.png\" height='35'/>");
}

Murphy.prototype.createControl = function(accordionID) {
	this.accordionID = accordionID;
	var json = this.elementaryJson;
	var INSTANCE = this;
	var tbody = $("#tableID").find('tbody');
	var i = 0;
	var tr = $('<tr>');
	tbody.append(tr);
	var td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);
	var elementary = $('<a>').attr('href', '#').text("elementary");
	$(elementary).createElementaryClick(this);
	td.append(elementary);
	td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);
	var intermedia = $('<a>').attr('href', '#').text("intermedia");
	$(intermedia).createIntermediaClick(this);
	td.append(intermedia);
	var selWaitOpt = isNullAndUndef(localStorage.murphywaiting) ? 0 : localStorage.murphywaiting;
	var waitSelect = $("<select id='waitID'>")
		.append(createOption(0,selWaitOpt))
		.append(createOption(1,selWaitOpt))
		.append(createOption(2,selWaitOpt))
		.append(createOption(3,selWaitOpt))
		.append(createOption(4,selWaitOpt))
		.append(createOption(5,selWaitOpt))
		.bind("change", function() { localStorage.murphywaiting = $(this).val(); });
	td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);	
	td.text("delay: ").append(waitSelect);
	
	// speed
	var selSpeedOpt = isNullAndUndef(localStorage.murphyspeed) ? 1.0 : localStorage.murphyspeed;
	var speedSelect = $("<select id='speedID'>")
		.append(createOption(0.5,selSpeedOpt))
		.append(createOption(0.6,selSpeedOpt))
		.append(createOption(0.7,selSpeedOpt))
		.append(createOption(0.8,selSpeedOpt))
		.append(createOption(0.9,selSpeedOpt))
		.append(createOption(1.0,selSpeedOpt))
		.append(createOption(1.1,selSpeedOpt))
		.append(createOption(1.2,selSpeedOpt))
		.append(createOption(1.3,selSpeedOpt))
		.append(createOption(1.4,selSpeedOpt))
		.append(createOption(1.5,selSpeedOpt))
		.append(createOption(2.0,selSpeedOpt))
		.bind("change", function() { localStorage.murphyspeed = $(this).val(); });	
	td = $('<td>').attr("style", "width:150px").attr("align", "center");
	tr.append(td);
	td.text("speed: ").append(speedSelect);
	
	var phraseCheckBox = $("<input type=\"checkbox\" id=\"sndPhraseID\">");
	if (!isNullAndUndef(localStorage.murphyphrase) && ""+localStorage.murphyphrase=="true") { 
		phraseCheckBox.prop("checked", "checked");
	}
	phraseCheckBox.change(function() {
		localStorage.murphyphrase = $(this).prop("checked");
	});
	td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);
	td.text("phrase: ").append(phraseCheckBox);
	
	var wordCheckBox = $("<input type=\"checkbox\" id=\"sndWordID\">");
	if (!isNullAndUndef(localStorage.murphyword) && ""+localStorage.murphyword=="true") { 
		wordCheckBox.prop("checked", "checked");
	}
	wordCheckBox.change(function() {
		localStorage.murphyword = $(this).prop("checked");
	});	
	td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);
	td.text("words: ").append(wordCheckBox);
		
	var partCheckBox = $("<input type=\"checkbox\" id=\"sndPartID\">");
	if (!isNullAndUndef(localStorage.murphypart) && ""+localStorage.murphypart=="true") { 
		partCheckBox.prop("checked", "checked");
	}
	partCheckBox.change(function() {
		localStorage.murphypart = $(this).prop("checked");
	});
	td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);
	td.text("parts: ").append(partCheckBox);

	if (!isNullAndUndef(localStorage.murphybook)) {
		if (localStorage.murphybook == "elementary") {
			$(elementary).get(0).click();
		} else if (localStorage.murphybook == "intermedia") {
			$(intermedia).get(0).click();
		}
	}

	td = $('<td>').attr("style", "width:100px").attr("align", "center");
	tr.append(td);
	td.append(this.playUnitsButton);
	$(this.playUnitsButton).audioUnitClick();
	
	function createOption(val,selVal) {
		return (val == selVal) ? $("<option selected=\"selected\"/>").text(val) : $("<option/>").text(val);
	}
}

Murphy.prototype.fillAccordion = function(json) {
	var INSTANCE = $("#" + this.accordionID);
	var MURPHY = this;
	this.sources = [];
	$.each(json, function(key, val) {
		var uid = key.charAt(0).toUpperCase() + key.substring(1).toLowerCase();
		var row = $('<h1>').attr("id", "h" + key).text(uid + ": " + val.name);
		INSTANCE.append(row);
		var div = $('<div>').attr("id", "div" + uid);
		INSTANCE.append(div);
		MURPHY.fillUnit(div, key, val);
	});
	this.playUnitsButton.data("sound_sources", this.sources);
	if (DEBUG) {
		printDebug("fillAccordion:length1", this.sources.length);
		printDebug("fillAccordion:length2", this.playUnitsButton.data("sound_sources").length);
	}	
}

var jumpIndex = 0;
function nextJumpId() {
	jumpIndex++;
	return "jumpID" + jumpIndex;
}

Murphy.prototype.fillUnit = function(el, key, data) {
	var INSTANCE = el;
	var MURPHY = this;
	var table = $("<table/>").attr("style", "width:100%").attr("align",
			"center").attr("bgcolor", "#ffcc00").attr("bordercolor", "#0000ff")
			.attr("cellspacing", "0").attr("border", "1").attr("cellpadding",
					"1");
	var tbody = $("<tbody/>");
	table.append(tbody);
	el.append(table);
	var jumpID;
	$.each(data.data, function(index, val) {
		var tr = $("<tr style='visibility:hidden;'>");
		tbody.append(tr);
		var td1 = $('<td>').attr("style", "width:100%;").attr("align", "left")
				.attr("valign", "top");
		tr.append(td1);
		jumpID = nextJumpId();
		td1.append($("<a href=\"#\" id='" + jumpID + "' name='" + jumpID
				+ "'/>"));

		tr = $('<tr>');
		tbody.append(tr);
		var row = $('<span>').attr("style", "font-size:300%;font-weight:bold;")
				.text(val.phrase);
		td1 = $('<td>').attr("style", "width:100%;").attr("align", "left")
				.attr("valign", "top");
		var td2 = $('<td>').attr("style", "width:50px").attr("align", "left");
		var playPhraseButton = Murphy.createPlayButton();
		var playUnitButton = Murphy.createPlayButton();
		tr.append(td1);
		tr.append(td2);
		td2.append(playPhraseButton);
		td2.append(playUnitButton);
		td1.append(row);
		var phraseSources = [];
		var unitSources = [];
		var source = new SoundSource(data.phrase_path + "" + val.source, 1,
				jumpID);
		MURPHY.sources.push(source);
		phraseSources.push(source);
		unitSources.push(source);
		playPhraseButton.data("sound_sources", phraseSources);
		$(playPhraseButton).audioClick(1);
		jumpID = nextJumpId();
		td2.append($("<a href=\"#\" id='" + jumpID + "' name='" + jumpID
				+ "'/>"));

		// word
		tr = $('<tr>').attr("bgcolor", "#9AC39A");
		tbody.append(tr);
		td1 = $('<td>').attr("style", "width:100%").attr("align", "left");
		tr.append(td1);
		var ctxWords = [];
		var s = "";
		var wordsSources = [];
		$.each(val.words, function(index1, val1) {
			td1.text(td1.text() + s + val1);
			s = ",";
			var source = new SoundSource(data.words_path + "" + val1 + ".mp3",
					2, jumpID);
			var ctx = {
				text : val1,
				snd : source
			}
			ctxWords.push(ctx);
			MURPHY.sources.push(source);
			wordsSources.push(source);
			unitSources.push(source);
		});
		createDownPanel(td1, ctxWords);
		td2 = $('<td>').attr("style", "width:50px").attr("align", "left");
		tr.append(td2);
		var playWordsButton = Murphy.createPlayButton();
		td2.append(playWordsButton);
		playWordsButton.data("sound_sources", wordsSources);
		$(playWordsButton).audioClick(2);

		// parts
		var s = "";
		jumpID = nextJumpId();
		td2.append($("<a href=\"#\" id='" + jumpID + "' name='" + jumpID
				+ "'/>"));
		$.each(val.others, function(index1, val1) {
			tr = $('<tr>').attr("bgcolor", "#B0C0C0");
			tbody.append(tr);
			td1 = $('<td>').attr("style", "width:100%").attr("align", "left");
			tr.append(td1);
			td1.text(td1.text() + s + val1.split(".mp3")[0]);
			td2 = $('<td>').attr("style", "width:50px").attr("align", "left");
			tr.append(td2);
			var playPartButton = Murphy.createPlayButton();
			td2.append(playPartButton);
			var source = new SoundSource(data.phrase_path + "" + val1, 4,
					jumpID);
			MURPHY.sources.push(source);
			unitSources.push(source);
			playPartButton.data("sound_sources", [ source ]);
			$(playPartButton).audioClick(4);
			jumpID = nextJumpId();
			td2.append($("<a href=\"#\" id='" + jumpID + "' name='" + jumpID
					+ "'/>"));
		});

		playUnitButton.data("sound_sources", unitSources);
		$(playUnitButton).audioUnitClick();
	});

	function createDownPanel(parent, ctx) {
		var table = $("<table><tbody></tbody></table>").attr("class",
				"embedded");
		$.each(ctx, function(index, val) {
			var bt = Murphy.createPlayButton();
			var items = [];
			items.push(val.snd);
			bt.data("sound_sources", items);
			$(bt).audioClick(2);
			var td2 = $("<td/>").text(val.text);
			var td1 = $("<td/>").append(bt);
			var tr = $("<tr/>").append(td1).append(td2);
			table.find("tbody").append(tr);
		});
		var showButton = $("<img style='cursor:pointer;' src=\"css/images/arrow-down.png\" height='15'/>");
		$(showButton).showPanel(table);
		$(showButton).click();
		var headPanel = $("<div style='width:100%;display:inline'/>").append(
				showButton).append(table);
		parent.append(headPanel)
	}
}

function SoundManager() {
	this.name = "soundmanager";
	this.audio = $("<audio preload=\"none\"/>");
	this.sources = [];
	this.sourceCurrentIndex = -1;
	this.element = null;
	this.label = null;
	this.speed = 1.0;

	this.play = function(el, label, delay, speed) {
		this.audio.unbind();
		if (!this.audio.get(0).paused) {
			this.audio.get(0).pause();
		}
		this.sourceCurrentIndex = -1;
		this.sources = $(el).data("sound_sources");
		if (DEBUG) printDebug("play",this.sources.length);
		this.label = null;
		this.speed = speed;
		if (!isNullAndUndef(this.element)) {
			$(this.element).showPlay(true);
		}
		if (this.element == el || isNullAndUndef(this.sources)) {
			this.element = null;
			return;
		}
		$(el).showPlay(false);
		this.element = el;
		this.label = label;
		var INSTANCE = this;
		this.audio.bind("ended", function() {
			setTimeout(function() {
				loopPlay(INSTANCE);
			}, delay);
		});
		loopPlay(this);
	}

	var loopPlay = function(soundManager) {
		if (DEBUG) {
			console.log("loopPlay1: " + soundManager.sources.length)
		}
		var index = 0;
		var limit = isNullAndUndef(soundManager.sources) ? 0
				: soundManager.sources.length;		
		var sound_source = null;
		if (DEBUG) {
			console.log("loopPlay:limit: " + limit)
		}
		while (index < limit) {
			sound_source = next(soundManager);
			if (sound_source == null) {
				if (DEBUG) {
					console.log("loopPlay:sound_source is empty")
				}
				return null;
			}
			if (DEBUG) {
				console.log("loopPlay:instance.label: " + soundManager.label);
				console.log("loopPlay:sound_source.label: "
						+ sound_source.label);
			}
			if ((soundManager.label & sound_source.label) == sound_source.label) {
				break;
			} else {
				sound_source = null;
			}
			index++;
		}
		if (sound_source == null) {
			return null;
		}

		jumpToAnchor(sound_source.jumpID);
		soundManager.audio.attr("src", sound_source.src);

		soundManager.audio.get(0).load();
		soundManager.audio.get(0).playbackRate = soundManager.speed;
		soundManager.audio.get(0).play();
		if (DEBUG) {
			console.log("loopPlay2: " + sound_source.src)
		}
	}

	var next = function(instance) {
		var items = instance.sources;
		var index = instance.sourceCurrentIndex;
		if (isNullAndUndef(items)) {
			return null;
		}
		if (items.length == 0) {
			return null;
		}
		if (index < 0 || index > items.length - 1) {
			index = 0;
		}
		var result = items[index];
		index++;
		instance.sourceCurrentIndex = index;
		if (DEBUG)
			console.log("next: " + result.src);
		return isNullAndUndef(result) ? null
				: (result instanceof SoundSource ? result : null);
	}

	var jumpToAnchor = function(label) {
		if (isNullAndUndef(label)) {
			return;
		}
		var target_top = $('a[name="' + label + '"]').offset().top;
		$('html, body').animate({
			scrollTop : target_top
		}, 'slow');
	}
}

var SOUNDMANAGER = new SoundManager();

function SoundSource(srcPath, label, jumpID) {
	this.src = srcPath;
	this.label = label;
	this.jumpID = jumpID;
}

function frmtAudio(name, src) {
	return "<audio id=\"" + name
			+ "\" state=\"pause\"><source type=\"audio/mpeg\" src=\"" + src
			+ "\"</source></audio>";
}

(function($) {

	$.fn.accordionClick = function() {
		this.click();
		return this;
	};

	$.fn.audioClick = function(type) {
		this.bind("click", function() {
			SOUNDMANAGER.play(this, type, $("#waitID").val() * 1000, $(
					"#speedID").val() * 1.0);
		});
	};
	$.fn.audioUnitClick = function() {
		this.bind("click", function() {
			var label = 0;
			label = $("#sndPhraseID").prop("checked") ? 1 : 0;
			label |= $("#sndWordID").prop("checked") ? 2 : 0;
			label |= $("#sndPartID").prop("checked") ? 4 : 0;
			SOUNDMANAGER.play(this, label, $("#waitID").val() * 1000, $(
					"#speedID").val() * 1.0);
		});
	};
	$.fn.showPanel = function(el) {
		this.bind("click", function() {
			var b = $(this).attr("visible");
			if (!isNullAndUndef(b) && b == "0") {
				$(this).attr("visible", "1");
				$(this).attr("src", "css/images/arrow-up.png");
				el.show();
			} else {
				$(this).attr("visible", "0");
				$(this).attr("src", "css/images/arrow-down.png");
				el.hide();
			}
		});
	};
	$.fn.showPlay = function(b) {
		if (b) {
			$(this).attr("src", "css/images/media-playback-start.png");
		} else {
			$(this).attr("src", "css/images/media-playback-stop.png");
		}
	};
	$.fn.jumpToAnchor = function(label) {
		this.bind("click", function() {
			event.preventDefault();
			var target_top = $('a[name="' + label + '"]').offset().top;
			$('html, body').animate({
				scrollTop : target_top
			}, 'slow');
		});
	}
	$.fn.createElementaryClick = function(murphy) {
		this.bind("click", function() {
			event.preventDefault();
			murphy.reset();
			murphy.fillAccordion(murphy.elementaryJson);
			$("#" + murphy.accordionID).accordion();
			localStorage.murphybook = "elementary";
		});
	}
	$.fn.createIntermediaClick = function(murphy) {
		this.bind("click", function() {
			event.preventDefault();
			$("#" + murphy.accordionID).empty();
			$("#" + murphy.accordionID).removeAttr("role");
			$("#" + murphy.accordionID).removeClass();
			$("#" + murphy.accordionID).removeData();
			murphy.reset();
			murphy.fillAccordion(murphy.intermediaJson);
			$("#" + murphy.accordionID).accordion();
			localStorage.murphybook = "intermedia";
		});
	}
}(jQuery));

function isNullAndUndef(arg) {
	// return (variable !== null && variable !== undefined);
	return (arg === null || arg === void (0));
}