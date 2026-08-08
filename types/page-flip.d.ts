declare module "page-flip" {
  export class PageFlip {
    constructor(
      element: HTMLElement,
      settings: Record<string, unknown>,
    );
    flip(page: number): void;
    flipNext(): void;
    flipPrev(): void;
    destroy(): void;
    on(event: string, callback: (event: { data: number | string }) => void): void;
    loadFromHTML(items: NodeListOf<HTMLElement>): void;
  }
}
