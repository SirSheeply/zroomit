var wpmDelayMS = 300;
var zroomIntervalId = null;
var zroomIndex = 0;
var zroomText = "";
var scrollWordsLimit = 2;

function startRun() {
    //var zroomDisplayText = document.getElementById("zroom-display-text");
    var zroomScrollWord = document.getElementById("zroom-scroll-current-word");
    var zroomScrollPast = document.getElementById("zroom-scroll-past-word");
    var zroomScrollPost = document.getElementById("zroom-scroll-post-word");
    var readTimeRemaining = document.getElementById("read-time-remaining");
    var zroomPauseButton = document.getElementById("zroom-pause-button");
    var zroomResumeButton = document.getElementById("zroom-resume-button");

    if (zroomIndex >= zroomText.length) {
        zroomPauseButton.disabled = true;
        zroomResumeButton.disabled = true;
        zroomResumeButton.hidden = false;
        zroomPauseButton.hidden = true;
        stopRun();
    } else {
        // Caculate the amount of time in minutes it would take to zroom
        var readTime = (zroomText.length-zroomIndex) / (60000 / wpmDelayMS) * 1.00;
        var readTimeText = generateReadTimeText(readTime);
        readTimeRemaining.innerHTML = readTimeText;

        var pasttext = "";
        var posttext = "";
        for (let i=1; i <= scrollWordsLimit; i++) {
            if (zroomIndex-i >= 0) {
                pasttext = zroomText[zroomIndex-i] + " " + pasttext;
            }
            if (zroomIndex+i < zroomText.length-1) {
                posttext += " " + zroomText[zroomIndex+i];
            }
        }
        zroomScrollPast.innerHTML = pasttext;
        zroomScrollPost.innerHTML = posttext;

        //zroomDisplayText.innerHTML = zroomText[zroomIndex];
        zroomScrollWord.innerHTML = zroomText[zroomIndex];

        zroomIndex += 1;
    }
}

function stopRun() {
    if (zroomIntervalId != null) {
        clearInterval(zroomIntervalId);
        zroomIntervalId = null;
    }
}

function countWords() {
    var zroomPaste = document.getElementById("zroom-paste");
    var zroomWPMBox = document.getElementById("wpm-box");
    var wordCountSpan = document.getElementById("word-count");
    var readTimeRemaining = document.getElementById("read-time-remaining");

    // Collect wrods from text area and split into words
    var zroomWordCount = processtext(zroomPaste.value).length-1;

    // Caculate the amount of time in minutes it would take to zroom
    var readTime = zroomWordCount / zroomWPMBox.value * 1.00;
    var readTimeText = generateReadTimeText(readTime);

    // Set the text on the page
    wordCountSpan.innerHTML = zroomWordCount.toLocaleString() + " (" + readTimeText + ")";
    readTimeRemaining.innerHTML = " (" + readTimeText + ")";
}

function generateReadTimeText(readTime) {
    var readTimeText = Math.round(readTime) + " Minutes";
    if (Math.round(readTime%1*60) > 0) {
        readTimeText += ", and " + Math.round(readTime%1*60) + " Seconds";
    }

    // If the amount of time is less than a minute, we should only display in seconds
    if (readTime < 1) {
        readTimeText = (Math.round(readTime*60)) + " Seconds";
    }
    // If the amount of time is greater than 59 minutes, we should only display in hours
    else if (readTime >= 60) {
        var readTimeHours = Math.round(readTime/60);
        var readTimeMinutes = Math.round(((readTime/60)%1)*60);
        var readTimeSeconds = Math.round(((((readTime/60)%1)*60)%1)*60);

        readTimeText = readTimeHours + " Hours";
        if (readTimeMinutes > 0) {
            if (readTimeSeconds > 0) {
                readTimeText += ", " + readTimeMinutes + " Minutes";
                readTimeText += ", and " + readTimeSeconds + " Seconds";
            } else {
                readTimeText += ", and " + readTimeMinutes + " Minutes";
            }
        } else if (readTimeSeconds > 0) {
            readTimeText += ", and " + readTimeSeconds + " Seconds";
        }
    }
    return readTimeText
}

function startZroom() {
    //var zroomDisplayText = document.getElementById("zroom-display-text");
    var zroomDisplay = document.getElementById("zroom-display");
    var zroomPaste = document.getElementById("zroom-paste");
    var zroomButtonStart = document.getElementById("zroom-start-button");
    var zroomButtonStop = document.getElementById("zroom-stop-button");
    var zroomWPMBox = document.getElementById("wpm-box");
    var zroomPauseButton = document.getElementById("zroom-pause-button");
    var zroomResumeButton = document.getElementById("zroom-resume-button");

    zroomDisplay.style.display = "block";
    zroomButtonStop.style.display = "block";

    zroomPaste.style.display = "none";
    zroomButtonStart.style.display = "none";

    zroomWPMBox.disabled = true;
    zroomPauseButton.disabled = false;
    zroomResumeButton.disabled = true;
    zroomResumeButton.hidden = true;
    zroomPauseButton.hidden = false;

    // Stop the previous run and reset
    stopRun();
    zroomIndex = 0;

    // Collect wrods from text area and split into words
    zroomText = processtext(zroomPaste.value);
    countWords();

    // Get WPM and Start the run
    wpmDelayMS = 60000 / zroomWPMBox.value; // Milliseconds in a minute / words per minute = rate of delay in milliseconds
    //zroomDisplayText.innerHTML = zroomText[zroomIndex]; // Set the first word to be displayed
    zroomIntervalId = window.setInterval(startRun, wpmDelayMS);
}

function processtext(textToProcess) {
    var processedText = textToProcess;

    processedText = processedText.replace(/[\n]/g, " ").replace("\r", " ");
    processedText = processedText.replace(/[.]/g, " . . ");
    processedText = processedText.replace(/[;]/g, "; ");
    processedText = processedText.replace(/[,]/g, ", ");
    processedText = processedText.replace(/[/]/g, " ");
    //processedText = processedText.replace(/[-]/g, " - ");
    //processedText = processedText.replace(/[\"]/g, " \" ");
    processedText = processedText.split(" ");

    for(var i = processedText.length-1; i >= 0; i--) {
        processedText[i] = processedText[i].trim();
        if(processedText[i] == "") {
            processedText.splice(i, 1);
        }
    }
    return processedText;
}

function pauseZroom() {
    if (zroomIntervalId == null) {
        return;
    }

    var zroomWPMBox = document.getElementById("wpm-box");
    var zroomPauseButton = document.getElementById("zroom-pause-button");
    var zroomResumeButton = document.getElementById("zroom-resume-button");

    zroomWPMBox.disabled = false;
    zroomPauseButton.disabled = true;
    zroomResumeButton.disabled = false;
    zroomResumeButton.hidden = false;
    zroomPauseButton.hidden = true;

    stopRun();
}

function resumeZroom() {
    if (zroomIntervalId == null) {
        return;
    }

    var zroomWPMBox = document.getElementById("wpm-box");
    var zroomPauseButton = document.getElementById("zroom-pause-button");
    var zroomResumeButton = document.getElementById("zroom-resume-button");

    zroomWPMBox.disabled = true;
    zroomPauseButton.disabled = false;
    zroomResumeButton.disabled = true;
    zroomResumeButton.hidden = true;
    zroomPauseButton.hidden = false;

    wpmDelayMS = 60000 / zroomWPMBox.value; // Milliseconds in a minute / words per minute = rate of delay in milliseconds
    zroomIntervalId = window.setInterval(startRun, wpmDelayMS);
}

function stopZroom() {
    var zroomDisplay = document.getElementById("zroom-display");
    var zroomPaste = document.getElementById("zroom-paste");
    var zroomButtonStart = document.getElementById("zroom-start-button");
    var zroomButtonStop = document.getElementById("zroom-stop-button");
    var zroomWPMBox = document.getElementById("wpm-box");
    var zroomPauseButton = document.getElementById("zroom-pause-button");
    var zroomResumeButton = document.getElementById("zroom-resume-button");

    zroomDisplay.style.display = "none";
    zroomButtonStop.style.display = "none";

    zroomPaste.style.display = "block";
    zroomButtonStart.style.display = "block";
    zroomWPMBox.disabled = false;

    zroomPauseButton.disabled = true;
    zroomResumeButton.disabled = true;

    zroomResumeButton.hidden = false;
    zroomPauseButton.hidden = true;

    stopRun();
}

function darkmodeToggle() {
    if (document.body.className == "bodyDark")
    {
        document.body.className = "bodyLight";
    } else {
        document.body.className = "bodyDark";
    }
}