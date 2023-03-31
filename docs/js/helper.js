Handlebars.registerHelper('eq', function(v1, v2, opts) {
    if(v1 === v2) {
        return opts.fn(this);
    }
    else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('neq', function(v1, v2, opts) {
    if(v1 !== v2) {
        return opts.fn(this);
    }
    else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('isToday', function(v1, opts) {
    if(v1 === commonUtil.today()) {
        return opts.fn(this);
    }
    else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('isEmpty', function(v1, opts) {
    if(v1 === '' || v1 === undefined || v1 === null) {
        return opts.fn(this);
    }
    else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('isNotEmpty', function(v1, opts) {
    if(v1 !== '' && v1 !== undefined && v1 !== null) {
        return opts.fn(this);
    }
    else {
        return opts.inverse(this);
    }
});

Handlebars.registerHelper('pomoArr', function(taskInfo, opts) {
    var result = "";
    for (let pomoIdx = 0; pomoIdx < taskInfo.pomoArr.length; pomoIdx++) {
        const pomo = taskInfo.pomoArr[pomoIdx];
        var passRatio = 100 * pomo.timePassed / pomo.ttlTaskTime;
        var iconClass = "";
        if(passRatio >= 100) {
            iconClass = "/img/ori/task-pomo-actual.png";
        }
        else if(passRatio >= 80) {
            iconClass = "/img/ori/task-pomo-actual80.png";
        }
        else if(passRatio >= 60) {
            iconClass = "/img/ori/task-pomo-actual60.png";
        }
        else if(passRatio >= 40) {
            iconClass = "/img/ori/task-pomo-actual40.png";
        }
        else if(passRatio >= 20) {
            iconClass = "/img/ori/task-pomo-actual20.png";
        }
        else {
            iconClass = "/img/ori/task-pomo-estimate.png";
        }

        result += `<span class="taskTimer"><img style="max-width: 100%; max-height: 100%;" src="${iconClass}"></img></span>\n`;
    }

    for (let pomoIdx = taskInfo.pomoArr.length; pomoIdx < taskInfo.estPomoNum; pomoIdx++) {
        iconClass = "/img/ori/task-pomo-estimate.png";
        result += `<span class="taskTimer"><img style="max-width: 100%; max-height: 100%;" src="${iconClass}"></img></span>\n`;
    }

    return result;
});

Handlebars.registerHelper('pomoArr2', function(taskInfo, opts) {
    var result = "";
    for (let pomoIdx = 0; pomoIdx < taskInfo.pomoArr.length; pomoIdx++) {
        const pomo = taskInfo.pomoArr[pomoIdx];
        //var passRatio = 25 * pomo.timePassed / pomo.ttlTaskTime;
        let passRatio = 15;

        var timerTemplate = `
    <span class="timer-container">
      <span class="timer-filler" style='height:${passRatio}px'></span>
    </span>    
    `;

        debugger;
        result += timerTemplate;
    }

    for (let pomoIdx = taskInfo.pomoArr.length; pomoIdx < taskInfo.estPomoNum; pomoIdx++) {
        iconClass = "/img/ori/task-pomo-estimate.png";
        result += `<span class="taskTimer"><img style="max-width: 100%; max-height: 100%;" src="${iconClass}"></img></span>\n`;
    }

    return result;
});