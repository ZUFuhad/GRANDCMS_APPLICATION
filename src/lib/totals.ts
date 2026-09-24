export type Line={quantity:number;unitPrice:number;discount?:number;taxRate?:number};
export function calculateTotals(lines:Line[],commissionRate=0,taxRate=0){const subtotal=lines.reduce((s,l)=>s+l.quantity*l.unitPrice-(l.discount||0),0);const commission=subtotal*commissionRate/100;const tax=(subtotal+commission)*taxRate/100;return {subtotal,commission,tax,total:subtotal+commission+tax};}
