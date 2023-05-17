declare class UrlUtil {
    private Params: {};
    constructor() { }

    getParams(path?: string): any;
    toUrl(KVobject?: any): string;
}
export default UrlUtil;