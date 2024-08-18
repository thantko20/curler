export namespace request {
	
	export class NameValuePair {
	    name: string;
	    value: string;
	
	    static createFrom(source: any = {}) {
	        return new NameValuePair(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.name = source["name"];
	        this.value = source["value"];
	    }
	}
	export class Request {
	    method: string;
	    headers: NameValuePair[];
	    formattedHeaders: {[key: string]: string};
	    url: string;
	    body: any;
	    queryParams: NameValuePair[];
	
	    static createFrom(source: any = {}) {
	        return new Request(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.method = source["method"];
	        this.headers = this.convertValues(source["headers"], NameValuePair);
	        this.formattedHeaders = source["formattedHeaders"];
	        this.url = source["url"];
	        this.body = source["body"];
	        this.queryParams = this.convertValues(source["queryParams"], NameValuePair);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response {
	    body: string;
	    contentType: string;
	    statusCode: number;
	    size: number;
	    headers: {[key: string]: string[]};
	    durationMs: number;
	
	    static createFrom(source: any = {}) {
	        return new Response(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.body = source["body"];
	        this.contentType = source["contentType"];
	        this.statusCode = source["statusCode"];
	        this.size = source["size"];
	        this.headers = source["headers"];
	        this.durationMs = source["durationMs"];
	    }
	}

}

