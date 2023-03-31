export const API_PROVIDER = {
    "OPEN_AI":"OPEN_AI",
};

export const API_MODAL = {
    "ChatGPT3": "gpt-3.5-turbo",
};

export const ApiConnectorFactory = {
    createApiConnector(optionObj) {
      switch (optionObj.apiProvider) {
        case API_PROVIDER.OPEN_AI:
            return new ChatGPTApiConnector(optionObj);
          break;
      }
      throw new Error(`Unknown apiProvider "${apiProvider}" or apiModel "${apiModel}"`);
    }
}

class ChatGPTApiConnector {
    constructor(optionObj) {
        this.apiModel = optionObj.apiModel;
        this.apiKey = optionObj.apiKey;
        this.apiClient = new ChatGPTApiClient(optionObj);
    }

    async callAPI(msg) {
        try {
            var responseObj = await this.apiClient.chatCompletionRequest([{role: 'user', content: msg}]);
            return responseObj.choices[0].message.content;
        }
        catch(error) {
            console.log(error)
        }
        
    }
}


export class ChatGPTApiClient {
    constructor(optionObj) {
        this.apiModel = optionObj.apiModel;
        this.apiKey = optionObj.apiKey;
    }

    async chatCompletionRequest(messages) {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        };

        const data = {
          model: this.apiModel,
          messages: messages,
        };

        try {
            var response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
            });

            var responseData = await response.json();
            return responseData;
        }
        catch(e) {
            console.error(e);
        }
    }
}