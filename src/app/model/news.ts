export class NewsUnit {
    id: number;
    headline: string;
    date: string;
    imgSrc: string;
    imgAlt: string;
    imgSrc2: string;
    imgAlt2: string;
    text: string;
    text2: string[];

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.headline = obj && obj.headline || "";
        this.date = obj && obj.date || "";
        this.imgSrc = obj && obj.imgSrc || "";
        this.imgAlt = obj && obj.imgAlt || "";
        this.imgSrc2 = obj && obj.imgSrc2 || "";
        this.imgAlt2 = obj && obj.imgAlt2 || "";
        this.text = obj && obj.text || "";
        this.text2 = obj && obj.text2 || [];
    }
}



