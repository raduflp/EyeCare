// The interval at which the reminding notifications are displayed
/*REMINDER_INTERVAL = 45;*/
REMINDER_INTERVAL = 10;
soundsON = true;

$currentMode = $('.pager .selected');

var isMinimized;
mode = new Mode();
mode.setMode();

timer = new Timer();
timer.init(mode.work, updateClock, startReminder);
setTheme('initLayout');

notId = 1;


$('#btnMenuReset').click(function(e) {
    resetToInit();
    goToScreen('home');
});
$('#btnMenuSounds').click(function(e) {
    if (soundsON) {
      soundsON = false;
      $('.ec-sound-on').hide();
      $('.ec-sound-off').show();
    } else {
      soundsON = true;
      $('.ec-sound-off').hide();
      $('.ec-sound-on').show();
    }
});

$('#btnMenuHome').click(function(e) {
    goToScreen('home');
});
$('#btnMenuAbout').click(function(e) {
    goToScreen('about');
});
$('#btnAboutBack').click(function(e) {
    goToScreen('home');
});

$('#hrefMayo1').click(function(e) {
    window.open('http://www.mayoclinic.org/diseases-conditions/eyestrain/basics/prevention/con-20032649');
});

$('#hrefGithub1').click(function(e) {
    window.open('https://github.com/RaduFi');
});


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
});


$('#btnStart').click(function(e) {
    startWork();
});
$('#btnReset').click(function(e) {
    resetToInit();
});


$('#btnBreak').click(function(e) { startRest(); });
$('#btnSkip').click(function(e) { startWork(); });
$('#btnSkipRest').click(function(e) { stopRest(); });
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
		} else 
        
        if (m == 201){
			this.work = 1200;
			this.rest = 60;
		} else if (m == 303) {
			this.work = 1800;
			this.rest = 180;
		} else if (m == 605) {
            this.work = 3600;
            this.rest = 300;
		} else {
		    console.error("ERROR! Unknown mode " + m);
            this.work = 60;
            this.rest = 60;
		}

		updateClock(mode.work);
	};

};

/*=========================*/


/*===== Notifications =====*/
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
    
    chrome.notifications.clear('ec' + (notId - 1), clearCallback);
    chrome.notifications.create('ec' + notId++, opt, creationCallback);
    if (soundsON){ $('#audioNotif').trigger('play'); }
}

chrome.notifications.onButtonClicked.addListener(notificationBtnClick);

function notificationBtnClick(notID, btnID) {
/*	console.log("The notification '" + notID + "' had button " + btnID + " clicked");*/
	if (btnID == 0){
		startRest();
	} else if (btnID == 1){
		startReminder(120);
	}

}

function creationCallback(id) {
/*    console.log("Succesfully created " + id + " notification");*/
}

function clearCallback(wasCleared) {
/*    console.log("Previous Notification cleared? " + wasCleared);*/
}
/*===========================*/

/*===== Interface utils =====*/

function setTheme(layoutClass) {
    $('body').attr( "class", layoutClass );
};

function goToScreen(screen){
    $('.ec-scr-home').hide();
    $('.ec-scr-about').hide();
    $('.ec-scr-' + screen).show();
}

function updateClock(seconds) {
    var dSeconds = seconds % 60;
    var dMinutes = Math.floor(seconds/60) % 60;
    var dHours = Math.floor(seconds/3600);

    if (dHours < 10) { dHours = "0" + dHours; }
    if (dMinutes < 10) { dMinutes = "0" + dMinutes; }
    if (dSeconds < 10) { dSeconds = "0" + dSeconds; }

    $('#tClock').html(dHours + " : " + dMinutes + " : " + dSeconds + "s");
};
/*===========================*/

/*===== Work, Rest, Reminder functions =====*/

function resetToInit(){
    setTheme('initLayout');
    updateClock(mode.work);
    timer.init(mode.work, updateClock, startReminder);
}

function startWork(){
    setTheme('workLayout');
/*    console.log("Work Started! Duration: " + mode.work);*/
    updateClock(mode.work);
    timer.init(mode.work, updateClock, startReminder);
    timer.start();
};

function startRest(){
/*    console.log("Rest Started! Duration: " + mode.rest);*/
    goToScreen('home');
    isMinimized = chrome.app.window.current().isMinimized();
    chrome.app.window.current().focus();
    setTheme('restLayout');
    updateClock(mode.rest);
    timer.init(mode.rest, updateClock, stopRest);
    timer.start();
    chrome.app.window.current().fullscreen();
};

function stopRest(){
/*    console.log("Rest finished");*/
    startWork();
    chrome.app.window.current().restore();
    if (isMinimized){ chrome.app.window.current().minimize() }
    if (soundsON){ $('#audioResume').trigger('play'); }
};


function startReminder(duration){
    // case for the automatic reminder when a notification is ignored
    setTheme('reminderLayout');

    if (duration == null) {
        duration = REMINDER_INTERVAL;
        notify();
        timer.init(duration, null, startReminder);
    } else {
        updateClock(duration);
        timer.init(duration, updateClock, startReminder);
    }
/*    console.log("Reminder started for " + duration + " seconds");*/
    timer.start();
}

/*===========================*/