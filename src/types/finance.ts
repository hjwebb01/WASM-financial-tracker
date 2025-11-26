 export type Category = {
   id: string;
   name: string;
 };

 export type Transaction = {
   id: string;
   date: string;
   description: string;
   categoryId: string;
   amountCents: number;
 };

 export type Budget = {
   id: string;
   categoryId: string;
   monthlyLimit: number; // in cents
   notes?: string;
 };
