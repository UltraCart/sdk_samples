from customer_functions import insert_sample_customer, delete_sample_customer

def main():
    try:
        customer_oid = insert_sample_customer()
        delete_sample_customer(customer_oid)
    except Exception as e:
        print('An exception occurred. Please review the following error:')
        print(e)
        import sys
        sys.exit(1)

if __name__ == "__main__":
    main()