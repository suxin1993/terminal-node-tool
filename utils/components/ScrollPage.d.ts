interface ScrollPageOptions {
    el: HTMLElement | any,
    scrollUp?: Function,
    scrollDown?: Function,
    scrolling?: Function,
}

declare class ScrollPage {
    constructor(opts: ScrollPageOptions);
}
export default ScrollPage;