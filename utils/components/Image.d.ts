interface ImageZipOptions {
    imgSrc: string,
    width?: number,
    height?: number,
    quality?: number,
    fileType?: string,
    done?: (base64: string) => {},
}

interface ImageGrayOptions {
    imgSrc: string,
    done?: (base64: string) => {},
}

declare class Image {
    private initImage(img: ImageData | CanvasImageSource | any): { canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D };
    private drawImage(ctx: CanvasRenderingContext2D, img: ImageData | CanvasImageSource | any): void;
    private getImageData(ctx: CanvasRenderingContext2D, img: ImageData | CanvasImageSource | any): ImageData | any;
    private resetPixel(data: Iterable<number> | Iterable<string> | any): Uint8ClampedArray | any;
    private updateImageData(ctx: CanvasRenderingContext2D, px: Uint8ClampedArray, width: number, height: number): void;

    constructor();

    zipImage(opt: ImageZipOptions): void;
    toFileBlob(dataURI: string, type?: number): File | Blob;
    Gray2ColorImage(opt: ImageGrayOptions): void;
}

export default Image;