import { customerApi } from '../api';
import { CustomerStoreCreditAddRequest, CustomerStoreCreditResponse, CustomerStoreCredit } from 'ultracart_rest_api_v2_typescript';
import { CustomerFunctions } from './CustomerFunctions';

export class GetCustomerStoreCredit {
   /*
       getCustomerStoreCredit returns back the store credit for a customer, which includes:
       total - lifetime credit
       available - currently available store credit
       vesting - amount of store credit vesting
       expiring - amount of store credit expiring within 30 days
       pastLedgers - transaction history
       futureLedgers - future transactions including expiring entries
    */
   public static async execute(): Promise<void> {
       try {
           // create a customer
           const customerOid: number = await CustomerFunctions.insertSampleCustomer();

           // add some store credit.
           const firstAddRequest: CustomerStoreCreditAddRequest = {
               description: "First credit add",
               vesting_days: 10,
               expiration_days: 20, // that's not a lot of time!
               amount: 20
           };
           await customerApi.addCustomerStoreCredit({
               customerProfileOid: customerOid,
               storeCreditRequest: firstAddRequest
           });

           // add more store credit.
           const secondAddRequest: CustomerStoreCreditAddRequest = {
               description: "Second credit add",
               vesting_days: 0, // immediately available.
               expiration_days: 90,
               amount: 40
           };
           await customerApi.addCustomerStoreCredit({
               customerProfileOid: customerOid,
               storeCreditRequest: secondAddRequest
           });

           const apiResponse: CustomerStoreCreditResponse = await customerApi.getCustomerStoreCredit({
               customerProfileOid: customerOid
           });
           const storeCredit: CustomerStoreCredit|undefined = apiResponse.customer_store_credit;

           console.log(storeCredit); // <-- There's a lot of information inside this object.

           // clean up this sample.
           await CustomerFunctions.deleteSampleCustomer(customerOid);
       } catch (e) {
           console.log("An Exception occurred. Please review the following error:");
           console.log(e); // <-- change_me: handle gracefully
           process.exit(1);
       }
   }
}