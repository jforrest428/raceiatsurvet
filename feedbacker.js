/**
 * The feedbacker determines the feedback message.
 */
 
function feedbacker_init(feedbackObj) {
    feedbackObj.fb = new feedbacker();
    
    //The two API functions
    feedbackObj.addSettings = feedbacker_addSettings;
    feedbackObj.getFeedback = feedbacker_getFeedback;
    //console.log("Set the two feedbacker functions");
}

// add settings different from default
function feedbacker_addSettings(feedbackObj, settingsObj){
    feedbackObj.fb.setObject(settingsObj);
}

/**
 * Determine the feedback
 * @return the feedback message
 **/
function feedbacker_getFeedback(feedbackerObj){

    //console.log('in getFeedback, DScoreObject', feedbackerObj.DScoreObj);
    //console.log('in getFeedback, feedbackerObj.fb', feedbackerObj.fb);

    let defaultErrMessage = "There was an error computing your score";

    if ((feedbackerObj.DScoreObj?.totalScoredTrials ?? 0) < (feedbackerObj.fb?.minTotalScoredTrials ?? 0)) {
        return feedbackerObj.fb?.notEnough ?? defaultErrMessage;
    } else if ((feedbackerObj.DScoreObj?.fastRate ?? 0) > (feedbackerObj.fb?.maxFastTrialsRate ?? 0)) {
        return feedbackerObj.fb?.tooFast ?? defaultErrMessage;
    } else if ((feedbackerObj.DScoreObj?.errRate ?? 0) > (feedbackerObj.fb?.maxErrorRate ?? 0)) {
        return feedbackerObj.fb?.manyErrors ?? defaultErrMessage;
    } else if (feedbackerObj.DScoreObj?.D === undefined || feedbackerObj.DScoreObj?.D === null) {
        return feedbackerObj.fb?.err ?? defaultErrMessage;
    }
    
    return feedbackerObj.fb.getScoreMsg(feedbackerObj.DScoreObj.D);
}


// A class to handle the feedback message
class feedbacker{

    constructor() {
        //Default parameters
        this.messageDef = [];
        this.manyErrors = "There were too many errors made to determine a result.";
        this.tooFast = "There were too many fast trials to determine a result.";
        this.notEnough = "There were not enough trials to determine a result.";
        this.err = "There was an error computing your score";
        this.maxErrorRate = 0.4;
        this.maxFastTrialsRate = 0.1;
        this.minTotalScoredTrials = 4;
    }

    setObject(settingsObj){
        //console.log('setting into the feedbacker:', settingsObj)
        // Loop through the keys of the updateObject
        for (const key in settingsObj) {
            // Check if the key exists in the messages object
            if (this.hasOwnProperty(key)) {
                // Update the field with the value from the updateObject
                this[key] = settingsObj[key];
            }
        }
    }

    // Determine the feedback message based on the score.
    getScoreMsg(score) {
        const array = this.messageDef;
        const scoreNum = parseFloat(score);
        //console.log('in getScoreMsg, the score is', scoreNum);
        //console.log('in getScoreMsg, the messageDef is', array);
        let rightMsg = "error: msg was not set";
        let set = false;

        // Find the first element in the array where the score is less than or equal to the cut value
        for (const val of array) {
            const cut = parseFloat(val.cut);
            const msg = val.message;

            if (scoreNum <= cut && !set) {
                rightMsg = msg;
                set = true;
                break; // Exit the loop once a match is found
            }
        }

        // If no match is found, use the last message in the array
        if (!set) {
            const obj = array[array.length - 1];
            rightMsg = obj.message;
        }

        return rightMsg;
    }
}



