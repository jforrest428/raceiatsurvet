define(['pipAPI','https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/iat10.js'], function(APIConstructor, iatExtension){
    let API = new APIConstructor();
    let global = API.getGlobal();

    return iatExtension({
        category1 : {
            name : global.blackLabels,
            title : {
                media : {word : global.blackLabels},
                css : {color:'#31940F','font-size':'1.8em'},
                height : 4
            }, 
            stimulusMedia : [
                {image: 'bm1_nc.jpg'},
                {image: 'bm2_nc.jpg'},
                {image: 'bm3_nc.jpg'},
                {image: 'bf1_nc.jpg'},
                {image: 'bf2_nc.jpg'},                 
                {image: 'bf3_nc.jpg'}     
            ],
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },    
        category2 : {
            name : global.whiteLabels,
            title : {
                media : {word : global.whiteLabels},
                css : {color:'#31940F','font-size':'1.8em'},
                height : 4
            }, 
            stimulusMedia : [
                {image: 'wm1_nc.jpg'},
                {image: 'wm2_nc.jpg'},
                {image: 'wm3_nc.jpg'},
                {image: 'wf1_nc.jpg'},
                {image: 'wf2_nc.jpg'},
                {image: 'wf3_nc.jpg'}
            ],
            stimulusCss : {color:'#31940F','font-size':'2.3em'}
        },
        attribute1 : {
            name : 'Bad words',
            title : {
                media : {word : 'Bad words'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : global.negWords.map(word => ({word})),
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        attribute2 : {
            name : 'Good words',
            title : {
                media : {word : 'Good words'},
                css : {color:'#0000FF','font-size':'1.8em'},
                height : 4
            },
            stimulusMedia : global.posWords.map(word => ({word})),
            stimulusCss : {color:'#0000FF','font-size':'2.3em'}
        },
        base_url : {
            image : global.baseURL
        },
        isTouch : global.$isTouch,

        logger: function(info) {
            return {
                latency: info.latency,
                score: info.score,
                condition: info.blockCongruent ? 'congruent' : 'incongruent',
                stimulus: info.stimulus
            };
        },

        onEnd: function(){
            try {
                const scoreObj = global.scorerObj.computeD(global.scorerObj);
                const feedbackMsg = global.feedbackerObj.getFeedback({
                    DScoreObj: scoreObj,
                    fb: global.feedbackerObj.fb
                });

                const dScore = scoreObj.D ?? null;
                const feedback = feedbackMsg ?? "No feedback generated.";

                console.log("📤 Sending IAT results to parent:", dScore, feedback);

                window.parent.postMessage({
                    iat_score: dScore,
                    iat_feedback: feedback
                }, "*");
            } catch (err) {
                console.error("❌ Error during onEnd result transmission:", err);
            }
        }
    });
});
