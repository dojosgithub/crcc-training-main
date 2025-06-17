import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';

export class CMethodHelper {
	
	__methodName: string;
	__methodNameObject: object;
	__methodData: object | string;
	__methodRequest: object;
	__methodResponse: any;
	__publication: string;

	get methodName(): string {
		return this.__methodName;
	}

	get methodNameObject(): object {
		return this.__methodNameObject;
	}

	get methodData(): object | string {
		return this.__methodData;
	}

	get methodRequest(): object | boolean {
		return this.__methodRequest;
	}

	get methodResponse(): any {
		return this.__methodResponse;
	}	

	get publication(): string {
		return this.__publication;
	}

	public getMethod(methodNameObject: string | object, methodData: object) {
		
		this.__methodName = null; //-- method is based on Meteor.call(METHOD_NAME...)
		this.__methodNameObject = null; //-- method is based on METHOD_NAME.call(...)

		if(typeof methodNameObject === 'object') {
			this.__methodNameObject = methodNameObject
		}
		else if(typeof methodNameObject === 'string') {
			this.__methodName = methodNameObject;
		}

		this.__methodData = methodData;

		return this;
	}

	//-- Client-side initial method call
	public call(callback: (methodResponse: object) => void): any {

		if(this.__methodName) {
			Meteor.call(this.__methodData, (err, res) => {
				// console.log(err, res)
				this.__methodResponse = res || {};
				callback(this.__methodResponse)
				return res;
			})
		} 
		else if(this.__methodNameObject) {
			this.__methodNameObject.call(this.__methodData, (err, res) => {
				// console.log(err, res)
				this.__methodResponse = res || {};
				callback(this.__methodResponse)
				// console.log(res)
				// return res;
			})
		}	

		return this;
	}

	//-- publication wrapper
	public subscribe(publication: string, ...args?: any[]): any {
		this.__publication = publication;
		let _params = null;
		if(args && args.length > 0) {
			_params = args.join(",");
		}

		if(_params) {
			Meteor.subscribe(this.__publication, _params);
		} else {
			Meteor.subscribe(this.__publication);
		}		

		return this;
	}

}
