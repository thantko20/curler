export namespace curler {
	
	export class RequestOptions {
	    method: string;
	    headers: {[key: string]: string};
	    url: string;
	    body: any;
	
	    static createFrom(source: any = {}) {
	        return new RequestOptions(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.headers = source["headers"];
	        this.url = source["url"];
	        this.body = source["body"];
	    }
	}
	export class Response {
	    body: any;
	    contentType: string;
	    statusCode: number;
	
	    static createFrom(source: any = {}) {
	        return new Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.body = source["body"];
	        this.contentType = source["contentType"];
	        this.statusCode = source["statusCode"];
	    }
	}

}

