// Helper functions
$ = function(selector) { return document.querySelector(selector); }


mode = new Mode();
mode.setMode();

timer = new Timer();
timer.init(mode.work);


$('#btnStart').onclick = function(e) { timer.start() };
$('#btnStop').onclick = function(e) { timer.stop() };
$('#btnPause').onclick = function(e) { timer.pause() };
$('#btnReset').onclick = function(e) { timer.init(mode.work) };
$('#selMode').onchange = function(e) { mode.setMode(); timer.init(mode.work); };




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



/*===== Interface utils =====*/
function setTheme(layoutClass) {
    $('body').className = layoutClass;
}

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
