import { API_PROVIDER, API_MODAL, ApiAgentFactory } from '../lib/aiAgent.js';
//import Dexie from 'dexie';
import Dexie from  '../vender/dexie-3.2.3/dexie.min.mjs';
//import {myUtil} from '../lib/testModule.js';
//import { PI, add, Person } from '../lib/testModule.js';

//console.log(myUtil());

(async function() {
	const db = new Dexie('AiAgent');

	db.version(1).stores({
	  topicThread: '++id, apiProvider, apiModal, topic, question, answer, askTime'
	});

    $(document).ready(async function() {
        initDom();
        registerEvent();
    });
    
    var initDom = function() {
    };

    var registerEvent = function() {
        $('.navbar-nav a').click(function(e) {
              var target = $(this).attr('href'); // Get ID of div to show
            if(target!=='' && target!=='#') {
                e.preventDefault(); // Prevent page from scrolling to top
                $(target).show().siblings().hide(); // Show target div and hide siblings
            }
        });

        initDarkmode();

        document.getElementById('btnSaveApiKey').addEventListener('click', eventHandleHub.onClickBtnSaveApiKey);
        document.getElementById('inputMsg').addEventListener('keydown', eventHandleHub.onEnterInputMsg);
    };

    var eventHandleHub = {
        onClickBtnSaveApiKey: function() {
            localStorage.setItem('ApiKeyOpenAI', $('#inputConfigApiKeyOpenAI').val());
        },
        onEnterInputMsg: async function(event) {
            if (event.key !== "Enter") {
                return;
            }

            topicThreadService.queryNewResult();
        }
    };

    var initDarkmode = function() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            $('body').attr('data-bs-theme','dark');
        } else {
            $('body').attr('data-bs-theme','');
        }

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                  $('body').attr('data-bs-theme','dark');
            } else {
                  $('body').attr('data-bs-theme','');
            }
        });
    };

    
    var topicThreadDao = {
        tableName: 'topicThread',
        MAX_RECORDS: 100,
        getRecords: async function() {
            return await db.table(this.tableName).orderBy('askTime').toArray();
        },
        addRecord: async function(record) {
            const table = db.table(this.tableName);
            await table.add(record);
            const count = await table.count();
            if (count > this.MAX_RECORDS) {
              const oldestRecord = await table.orderBy('askTime').first();
              await table.delete(oldestRecord.id);
            }
        },
		clear: async function() {
			db.table(this.tableName).clear();
		}
    };

    // create a new MarkdownIt instance with hljs plugin
    const md = new markdownit({
        highlight: function (str, lang) {
            try {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(lang, str).value;
                }      
                else {
                    return hljs.highlightAuto(str).value;
                }
            } catch (__) {}
            return ''; // use external default escaping
        }
    });

    var topicThreadService = {
        displayResults: async function() {
            var answerTemplateStr = document.getElementById('answerTemplate').innerHTML;
            var answerTemplate = Handlebars.compile(answerTemplateStr);
            
            var topicThreadRecords = await topicThreadDao.getRecords();
            for (let topicThreadRecord of topicThreadRecords) {
                //topicThreadRecord.answerHtml = marked.parse(topicThreadRecord.answer);
                console.log(topicThreadRecord.answer);
                topicThreadRecord.answerHtml =  md.render(topicThreadRecord.answer);
                console.log(topicThreadRecord.answerHtml);
            }
            
            var rendered = answerTemplate(topicThreadRecords);
            
            document.getElementById('divQuestionThread').innerHTML = rendered;
        },
        queryNewResult: async function() {
            var optionObj = {apiProvider:document.getElementById('selectAiProvicer').value, 
            apiModel: document.getElementById('selectAiModal').value,
            apiKey:localStorage.getItem('ApiKeyOpenAI')};

            var aiAgent = ApiAgentFactory.createApiAgent(optionObj);
            var question = document.getElementById('inputMsg').value;
            //console.log(aiAgent.callAPI('Hello world'))

            document.getElementById('spinnerLoading').style.display = "";
            var response = await aiAgent.callAPI(question);
            document.getElementById('spinnerLoading').style.display = "none";

            console.log(response);
            topicThreadDao.addRecord({apiProvider:optionObj.apiProvider, 
                                 apiModal:optionObj.apiModel, 
                                 topic:'default', 
                                 question:question, 
                                 answer:response, 
                                 askTime: Date.now()});
            
            topicThreadService.displayResults();
        }
    }

	topicThreadService.displayResults();
	window.topicThreadDao = topicThreadDao;

    
    
    //取得Notification的權限
    if (Notification.permission === "granted") {
      
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            console.log(permission);
        });
    }

    window.commonUtil = {
        showInfo:function(content) {
            var template_str = $('#toastTemplate').html();
            var template_obj = Handlebars.compile(template_str);
            var rendered = template_obj({msg:content});
            var toast$ = $(rendered);
            var toastDom = toast$[0];
            var toast = new bootstrap.Toast(toastDom);
            $(document.getElementById('toastPlacement')).append(toastDom);
            toast.show();
            toastDom.addEventListener('hidden.bs.toast', function (e) {
                e.target.parentNode.removeChild(e.target);
            });
        }
    };

})();