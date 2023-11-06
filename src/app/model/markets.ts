export class MarketsUnit {
    id: number;
    headline: string;
    mainImgSrc: string;
    imgAlt: string;
    carouselImgSrc1: string;
    carouselImgSrc2: string;
    carouselImgSrc3: string;
    carouselImgSrc4: string;
    carouselImgSrc5: string;
    carouselImgSrc6: string;
    address: string;
    telephone: string;
    eMail: string;
    workingHours: string;
    workingHoursSundayHoliday: string;
    mapSrc: string;
    mapAlt: string;
    iframeSrc: string;
    aboutText: string [];

    constructor(obj?: any) {
        this.id = obj && obj.id || 0;
        this.headline = obj && obj.headline || "";
        this.mainImgSrc = obj && obj.mainImgSrc || "";
        this.imgAlt = obj && obj.imgAlt || "";
        this.carouselImgSrc1 = obj && obj.carouselImgSrc1 || "";
        this.carouselImgSrc2 = obj && obj.carouselImgSrc2 || "";
        this.carouselImgSrc3 = obj && obj.carouselImgSrc3 || "";
        this.carouselImgSrc4 = obj && obj.carouselImgSrc4 || "";
        this.carouselImgSrc5 = obj && obj.carouselImgSrc5 || "";
        this.carouselImgSrc6 = obj && obj.carouselImgSrc6 || "";
        this.address = obj && obj.address || "";
        this.telephone = obj && obj.telephone || "";
        this.eMail = obj && obj.eMail || "";
        this.workingHours = obj && obj.workingHours || "";
        this.workingHoursSundayHoliday = obj && obj.workingHoursSundayHoliday || "";
        this.mapSrc = obj && obj.mapSrc|| "";
        this.mapAlt = obj && obj.mapAlt || "";
        this.iframeSrc = obj && obj.iframeSrc || "";
        this.aboutText = obj && obj.aboutText || [];
    }
}





