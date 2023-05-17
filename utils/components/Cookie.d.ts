declare class Cookie {
    private Cookie: any;
    constructor();

    public toCookieString(): string;
    public getCookies(): any;
    public getCookie(name: string): string | any;
    public setCookie(key: string, value: any, exdays?: number): any;
    public deleteCookie(name: string): boolean | any;
}

export default Cookie;