interface HttpRequestCommonObject {
    nodeEnv: boolean
}

interface HttpRequestOptions {
    url?: string,
    type?: string,
    dataType?: string,
    data?: object,
    headers?: object,
    protocol?: string,
    hostname?: string,
    port?: number,
    path?: string,
    method?: string,
}

declare class HttpRequest {
    private common: HttpRequestCommonObject;
    private req: ActiveXObject | XMLHttpRequest | "http" | any;

    private contentTypeAdapter(type: string): string;
    private requestOptionsAdapter(opts: HttpRequestOptions): HttpRequestOptions;
    private dataTypeFilter(data: string | Blob | ArrayBuffer | object | any, type?: string): string | Blob | ArrayBuffer | object | any;

    constructor();

    public request(opts: HttpRequestOptions): Promise<string | Blob | ArrayBuffer | object | any>;
}

export default HttpRequest;