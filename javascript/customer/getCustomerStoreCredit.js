import {customerApi} from '../api.js';
import {CustomerFunctions} from './customerFunctions.js';

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
    static async execute() {
        try {
            // create a customer
            const customerOid = await CustomerFunctions.insertSampleCustomer();

            // add some store credit.
            const firstAddRequest = {
                description: "First credit add",
                vesting_days: 10,
                expiration_days: 20, // that's not a lot of time!
                amount: 20
            };
            await new Promise((resolve, reject) => {
                customerApi.addCustomerStoreCredit(customerOid, firstAddRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            // add more store credit.
            const secondAddRequest = {
                description: "Second credit add",
                vesting_days: 0, // immediately available.
                expiration_days: 90,
                amount: 40
            };
            await new Promise((resolve, reject) => {
                customerApi.addCustomerStoreCredit(customerOid, secondAddRequest, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });

            const apiResponse = await new Promise((resolve, reject) => {
                customerApi.getCustomerStoreCredit(customerOid, function (error, data, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data, response);
                    }
                });
            });
            const storeCredit = apiResponse.customer_store_credit;

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