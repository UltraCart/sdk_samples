/* 
 * UltraCart Rest API V2
 *
 * This is the next generation UltraCart REST API...
 *
 * OpenAPI spec version: 2.0.0
 * Contact: support@ultracart.com
 * Generated by: https://github.com/swagger-api/swagger-codegen.git
 */

using System;
using System.IO;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;
using RestSharp;
using NUnit.Framework;

using com.ultracart.admin.v2.Client;
using com.ultracart.admin.v2.Api;
using com.ultracart.admin.v2.Model;

namespace com.ultracart.admin.v2.Test
{
    /// <summary>
    ///  Class for testing CustomerApi
    /// </summary>
    /// <remarks>
    /// This file is automatically generated by Swagger Codegen.
    /// Please update the test case below to test the API endpoint.
    /// </remarks>
    [TestFixture]
    public class CustomerApiTests
    {
        private CustomerApi instance;

        /// <summary>
        /// Setup before each unit test
        /// </summary>
        [SetUp]
        public void Init()
        {
            instance = new CustomerApi();
        }

        /// <summary>
        /// Clean up after each unit test
        /// </summary>
        [TearDown]
        public void Cleanup()
        {

        }

        /// <summary>
        /// Test an instance of CustomerApi
        /// </summary>
        [Test]
        public void InstanceTest()
        {
            // TODO uncomment below to test 'IsInstanceOfType' CustomerApi
            //Assert.IsInstanceOfType(typeof(CustomerApi), instance, "instance is a CustomerApi");
        }

        
        /// <summary>
        /// Test DeleteCustomer
        /// </summary>
        [Test]
        public void DeleteCustomerTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //int? customerProfileOid = null;
            //var response = instance.DeleteCustomer(customerProfileOid);
            //Assert.IsInstanceOf<CustomerResponse> (response, "response is CustomerResponse");
        }
        
        /// <summary>
        /// Test GetCustomer
        /// </summary>
        [Test]
        public void GetCustomerTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //int? customerProfileOid = null;
            //string expand = null;
            //var response = instance.GetCustomer(customerProfileOid, expand);
            //Assert.IsInstanceOf<CustomerResponse> (response, "response is CustomerResponse");
        }
        
        /// <summary>
        /// Test GetCustomers
        /// </summary>
        [Test]
        public void GetCustomersTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //string email = null;
            //string qbClass = null;
            //string quickbooksCode = null;
            //string lastModifiedDtsStart = null;
            //string lastModifiedDtsEnd = null;
            //string signupDtsStart = null;
            //string signupDtsEnd = null;
            //string billingFirstName = null;
            //string billingLastName = null;
            //string billingCompany = null;
            //string billingCity = null;
            //string billingState = null;
            //string billingPostalCode = null;
            //string billingCountryCode = null;
            //string billingDayPhone = null;
            //string billingEveningPhone = null;
            //string shippingFirstName = null;
            //string shippingLastName = null;
            //string shippingCompany = null;
            //string shippingCity = null;
            //string shippingState = null;
            //string shippingPostalCode = null;
            //string shippingCountryCode = null;
            //string shippingDayPhone = null;
            //string shippingEveningPhone = null;
            //int? pricingTierOid = null;
            //string pricingTierName = null;
            //int? limit = null;
            //int? offset = null;
            //string since = null;
            //string sort = null;
            //string expand = null;
            //var response = instance.GetCustomers(email, qbClass, quickbooksCode, lastModifiedDtsStart, lastModifiedDtsEnd, signupDtsStart, signupDtsEnd, billingFirstName, billingLastName, billingCompany, billingCity, billingState, billingPostalCode, billingCountryCode, billingDayPhone, billingEveningPhone, shippingFirstName, shippingLastName, shippingCompany, shippingCity, shippingState, shippingPostalCode, shippingCountryCode, shippingDayPhone, shippingEveningPhone, pricingTierOid, pricingTierName, limit, offset, since, sort, expand);
            //Assert.IsInstanceOf<CustomersResponse> (response, "response is CustomersResponse");
        }
        
        /// <summary>
        /// Test GetCustomersByQuery
        /// </summary>
        [Test]
        public void GetCustomersByQueryTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //CustomerQuery customerQuery = null;
            //int? limit = null;
            //int? offset = null;
            //string since = null;
            //string sort = null;
            //string expand = null;
            //var response = instance.GetCustomersByQuery(customerQuery, limit, offset, since, sort, expand);
            //Assert.IsInstanceOf<CustomersResponse> (response, "response is CustomersResponse");
        }
        
        /// <summary>
        /// Test GetEditorValues
        /// </summary>
        [Test]
        public void GetEditorValuesTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //var response = instance.GetEditorValues();
            //Assert.IsInstanceOf<CustomerEditorValues> (response, "response is CustomerEditorValues");
        }
        
        /// <summary>
        /// Test InsertCustomer
        /// </summary>
        [Test]
        public void InsertCustomerTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Customer customer = null;
            //string expand = null;
            //var response = instance.InsertCustomer(customer, expand);
            //Assert.IsInstanceOf<CustomerResponse> (response, "response is CustomerResponse");
        }
        
        /// <summary>
        /// Test UpdateCustomer
        /// </summary>
        [Test]
        public void UpdateCustomerTest()
        {
            // TODO uncomment below to test the method and replace null with proper value
            //Customer customer = null;
            //int? customerProfileOid = null;
            //string expand = null;
            //var response = instance.UpdateCustomer(customer, customerProfileOid, expand);
            //Assert.IsInstanceOf<CustomerResponse> (response, "response is CustomerResponse");
        }
        
    }

}
