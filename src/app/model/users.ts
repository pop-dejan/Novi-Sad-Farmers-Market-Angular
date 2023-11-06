export class User {
    id: string;
    username: string;
    email: string;
    buyProducts: BuyProduct[];
    orders: Order[];

    constructor(obj?: any) {
        this.id = obj && obj.id || "";
        this.username = obj && obj.username || "";
        this.email = obj && obj.email || "";
        this.buyProducts = obj && obj.buyProducts && obj.buyProducts.map((elem: any) => new BuyProduct(elem)) || [];
        this.orders = obj && obj.orders && obj.orders.map((elem: any) => new Order(elem)) || [];
    }
}

export class BuyProduct {
    name: string;
    unitInput: string;
    unit: string;
    imgUrl: string;
    markets: Market[];
    amount: number;
    price: number;
    option: number;

    constructor(obj?: any) {
        this.name = obj && obj.name || "";
        this.unitInput = obj && obj.unitInput || "";
        this.unit = obj && obj.unit || "";
        this.imgUrl = obj && obj.imgUrl || "";
        this.markets = obj && obj.markets && obj.markets.map((elem: any) => new Market(elem)) || [];
        this.amount = obj && obj.amount || 0;
        this.price = obj && obj.price || 0;
        this.option = obj && obj.option || 0;
    }
}

export class Market {
    name: string;
    price: string;

    constructor(obj?: any) {
        this.name = obj && obj.name || "";
        this.price = obj && obj.price || "";
    }
}

export class Order {
    nameAndSurname: string;
    email: string;
    deliveryAddress: string;
    telephone: string;
    note: string;
    finalPrice: number;
    orderProducts: OrderProduct[];

    constructor(obj?: any) {
        this.nameAndSurname = obj && obj.nameAndSurname || "";
        this.email = obj && obj.email || "";
        this.deliveryAddress = obj && obj.deliveryAddress || "";
        this.telephone = obj && obj.telephone || "";
        this.note = obj && obj.note || "";
        this.finalPrice = obj && obj.finalPrice || 0;
        this.orderProducts = obj && obj.orderProducts && obj.orderProducts.map((elem: any) => new OrderProduct(elem)) || [];
    }
}

export class OrderProduct {
    name: string;
    amount: number;
    price: number;
    totalPrice: number;

    constructor(obj?: any) {
        this.name = obj && obj.name || "";
        this.amount = obj && obj.amount || 0;
        this.price = obj && obj.price || 0;
        this.totalPrice = obj && obj.totalPrice || 0;

    }
}

