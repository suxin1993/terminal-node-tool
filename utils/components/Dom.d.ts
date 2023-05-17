interface BulletDOMAttribute {
    name: string,
    value: string | boolean | number | object | function | any,
}

interface BulletDOMObject {
    tagName?: string,
    attr?: BulletDOMAttribute[],
    html?: string,
    children?: BulletDOMObject[],
}

declare class Dom {
    private Dom2Json(el: HTMLElement | any): BulletDOMObject;
    private Json2Dom(el: BulletDOMObject | any): HTMLElement;
    constructor();

    public async toJson(el: HTMLElement | any): BulletDOMObject;
    public async toHtml(obj: BulletDOMObject | any): HTMLElement;
    public async createDom(obj: BulletDOMObject | any, el?: HTMLElement): void;
}

export default Dom;