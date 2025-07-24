define(['pipAPI','https://cdn.jsdelivr.net/gh/baranan/minno-tasks@0.*/IAT/iat10.js'], function(APIConstructor, iatExtension){
    let API = new APIConstructor();
    let global = API.getGlobal();

    // ✅ Logger setup for Qualtrics text entry (CSV format)
    API.addSettings('logger', {
        onRow: function(logName, log, settings, ctx){
            if (!ctx.logs) ctx.logs = [];
            ctx.logs.push(log);
        },
        onEnd: function(name, settings, ctx){
            return ctx.logs;
        },
        serialize: function(name, logs){
            const headers = ['alias', 'latency', 'block', 'stimulus', 'correct'];
            const content = logs.map(log => [
                log.data.alias || '',
                log.latency || '',
                log.data.block || '',
                log.data.stimulus || '',
                log.data.correct || ''
            ]);
            content.unshift(headers);
            return content.map(row => row.join(',')).join('\n');
        },
        send: function(name, serialized){
            window.minnoJS.logger(serialized); // writes to Qualtrics text box
        }
    });

    // ✅ Advance to next question after task
    API.addSettings('onEnd', window.minnoJS.onEnd);

    // ✅ Your IAT config below (unchanged logic)
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
        isTouch : global.$isTouch
    });
});
