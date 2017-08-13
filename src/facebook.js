'use strict';

const Provider    = require('koa-signin').Provider;
const axios       = require('axios');

class Facebook extends Provider {
	constructor(params, userMapping){
		super("facebook", params, userMapping);

		if(!params.clientId) throw new Error("Facebook Provider requires clientId");
		if(!params.callbackUrl) throw new Error("Facebook Provider requires callbackUrl");
		if(!params.clientSecret) throw new Error("Facebook Provider requires clientSecret");
	}

	getHelpers(){
		return {
      login: ({ clientId, callbackUrl }) => () => `https://www.facebook.com/dialog/oauth?client_id=${clientId}&redirect_uri=${callbackUrl}&response_type=code&scope=email`,
      token: ({ clientId, callbackUrl, clientSecret }) => (code) => `https://graph.facebook.com/oauth/access_token?client_id=${clientId}&redirect_uri=${callbackUrl}&client_secret=${clientSecret}&code=${code}`,
      profile: () => (access_token) => `https://graph.facebook.com/me?fields=name,email,picture&access_token=${access_token}`,
    }
	}

	async login(){
		return this.login();
	}

	async token(code){
		return axios.get(this.token(code)).then(res => res.data);
	}

	async profile(access_token){
		return axios.get(this.profile(access_token)).then(res => res.data);
	}
}

module.exports = Facebook;