// Helper functions
$ = function(selector) { return document.querySelector(selector); }

REMINDER_INTERVAL = 10;

mode = new Mode();
mode.setMode();

timer = new Timer();
timer.init(mode.work, updateClock, startReminder);

notId = 0;

$('#selMode').onchange = function(e) { mode.setMode(); timer.init(mode.work, updateClock, startReminder); };
$('#btnStart').onclick = function(e) { timer.start(); };
/*$('#btnStop').onclick = function(e) { timer.stop(); };*/
/*$('#btnPause').onclick = function(e) { timer.pause(); };*/
$('#btnReset').onclick = function(e) { timer.init(mode.work, updateClock, startReminder); updateClock(mode.work);};

$('#btnBreak').onclick = function(e) { startRest(); };
$('#btnSkip').onclick = function(e) { startWork(); };
$('#btnRemind2').onclick = function(e) { startReminder(120); };
$('#btnRemind5').onclick = function(e) { startReminder(300); };




// Modes
function Mode(){
	this.work = 2;
	this.rest = 1;

	this.setMode = function(){
		var e = $("#selMode");
		var m = e.options[e.selectedIndex].value;

		if (m < 0 || m > 3){
			console.log("ERROR! Unknown mode " + m);
			m = 1;
		};

		if (m == 0){
			this.work = 5;
			this.rest = 5;
		} else if (m == 1){
			this.work = 1200;
			this.rest = 30;
		} else if (m == 2) {
			this.work = 3600;
			this.rest = 300;
		} else if (m == 3) {
			this.work = workPeriod;
			this.rest = restPeriod;
		};

		updateClock(mode.work);
	};

};


/*===== Notifications =====*/
chrome.notifications.onButtonClicked.addListener(notificationBtnClick);

function notify(){

    var opt = {
      type: "basic",
      title: "Your need a break",
      message: "Rest your eyes to stay healthy!",
      iconUrl: "images/coffee.png"
    }

	opt.buttons = [];
	opt.buttons.push({ title: 'Take a break' });
	opt.buttons.push({ title: 'In a few minutes' });

    chrome.notifications.create('id' + notId++, opt, creationCallback)
}

function notificationBtnClick(notID, btnID) {
	console.log("The notification '" + notID + "' had button " + btnID + " clicked");
	if (btnID == 0){
		startRest();
	} else if (btnID == 1){
		startReminder(10);
	}

}

function creationCallback(notID) {
    console.log("Succesfully created " + notID + " notification");
}
/*===========================*/

/*===== Interface utils =====*/
function setTheme(layoutClass) {
    $('body').className = layoutClass;
};

function updateClock(seconds) {
    var dSeconds = seconds % 60;
    var dMinutes = Math.floor(seconds/60) % 60;
    var dHours = Math.floor(seconds/3600);

    $('#tHrs').innerHTML = dHours;
    $('#tMin').innerHTML = dMinutes;
    $('#tSec').innerHTML = dSeconds;
};

function updateStartStopButtons(tMode){
	if (tMode == 'work'){
		$('#btnStart').style.visibility = 'hidden';
		$('#btnStop').style.visibility = 'visible';
	} else if (tMode == 'remind'){
		$('#btnStart').style.visibility = 'hidden';
		$('#btnStop').style.visibility = 'visible';
	} else {
		$('#btnStart').style.visibility = 'visible';
		$('#btnStop').style.visibility = 'hidden';
	}
}
/*===========================*/

/*===== Mode functions =====*/

function startWork(){
    console.log("Work Started! Duration: " + mode.work);
    timer.init(mode.work, updateClock, startReminder);
    timer.start();
};

function startRest(){
    console.log("Rest Started! Duration: " + mode.rest);
    setTheme('restLayout');
    updateClock(mode.rest);
    timer.init(mode.rest, updateClock, stopRest);
    timer.start();
    chrome.app.window.current().fullscreen();
};

function stopRest(){
    console.log("Rest finished");
    setTheme('workLayout');
    chrome.app.window.current().restore();
    startWork();
};


function startReminder(duration){
    // case for the automatic reminder when a notification is ignored
    if (duration == null) {
        duration = REMINDER_INTERVAL;
        notify();
    }
    console.log("Reminder started for " + duration + " seconds");
    setTheme('reminderLayout');
    updateClock(duration);
    timer.init(duration, updateClock, startReminder);
    timer.start();
}

/*===========================*/