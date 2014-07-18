// The interval at which the reminding notifications are displayed
REMINDER_INTERVAL = 10;

$currentMode = $('.pager .selected');
console.log("current mode: " + $currentMode.attr('val'));


mode = new Mode();
mode.setMode();

timer = new Timer();
timer.init(mode.work, updateClock, startReminder);
setTheme('initLayout');

notId = 0;

/* Mode carousel functions */
$('#prevMode').click(function(e) {
    var $prevMode = $currentMode.prev('.item');
    if ($prevMode.size() == 0){
            $prevMode = $('.pager li.item').last();
        }
    $currentMode.removeClass('selected');
    $prevMode.addClass('selected');
    $currentMode = $prevMode;
    mode.setMode();
    timer.init(mode.work, updateClock, startReminder);
/*    console.log("prev mode: " + $prevMode.val());*/
});
$('#nextMode').click(function(e) {
    var $nextMode = $currentMode.next('.item');
    if ($nextMode.size() == 0){
        $nextMode = $('.pager li.item').first();
    }
    $currentMode.removeClass('selected');
    $nextMode.addClass('selected');
    $currentMode = $nextMode;
    mode.setMode();
    timer.init(mode.work, updateClock, startReminder);
/*    console.log("next mode: " + $nextMode.val());*/
});


$('#btnStart').click(function(e) { timer.start(); });
$('#btnReset').click(function(e) {
    timer.init(mode.work, updateClock, startReminder);
    updateClock(mode.work);
    setTheme('initLayout');
});

$('#btnBreak').click(function(e) { startRest(); });
$('#btnSkip').click(function(e) { startWork(); });
$('#btnRemind2').click(function(e) { startReminder(120); });
$('#btnRemind5').click(function(e) { startReminder(300); });




/*======== Modes ========*/
function Mode(){
	this.work = 2;
	this.rest = 1;

	this.setMode = function(){
		var m = $currentMode.val();

		if (m == 0){
			this.work = 5;
			this.rest = 5;
		} else if (m == 201){
			this.work = 1200;
			this.rest = 60;
		} else if (m == 303) {
			this.work = 1800;
			this.rest = 180;
		} else if (m == 605) {
            this.work = 3600;
            this.rest = 300;
		} else {
		    console.log("ERROR! Unknown mode " + m);
            this.work = 60;
            this.rest = 60;
		}

		updateClock(mode.work);
	};

};

/*=========================*/


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

    $('#tClock').html(dHours + "h : " + dMinutes + "m : " + dSeconds + "s");
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

/*===== Work, Rest, Reminder functions =====*/

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