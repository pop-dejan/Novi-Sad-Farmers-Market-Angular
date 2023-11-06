export class Product {
    name: string;
    unitInput: string;
    unit: string;
    imgUrl: string;
    markets: Market[];

    constructor(obj?: any) {
        this.name = obj && obj.name || "";
        this.unitInput = obj && obj.unitInput || "";
        this.unit = obj && obj.unit || "";
        this.imgUrl = obj && obj.imgUrl || "";
        this.markets = obj && obj.markets && obj.markets.map((elem: any) => new Market(elem)) || [];
    }
}

export class Market {
    name: string;
    price: string;

    constructor(obj?:any) {
        this.name = obj && obj.name || "";
        this.price = obj && obj.price || "";
    }
}





