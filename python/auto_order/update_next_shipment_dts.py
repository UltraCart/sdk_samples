#!/usr/bin/env python3
import csv
import sys
import argparse
from datetime import datetime

import ultracart
from ultracart import ApiClient
from ultracart.apis import AutoOrderApi


def api_client(api_key):
    config = ultracart.Configuration()

    # Create a Simple Key: https://ultracart.atlassian.net/wiki/spaces/ucdoc/pages/38688545/API+Simple+Key
    config.api_key['x-ultracart-simple-key'] = api_key
    config.debug = False
    config.verify_ssl = True  # Development only.  Set to True for production.

    client = ApiClient(configuration=config, header_name='X-UltraCart-Api-Version', header_value='2017-03-01')
    return client


def main():
    # Set up command line argument parsing
    parser = argparse.ArgumentParser(description='Process CSV file with specific column requirements')
    parser.add_argument('csv_file', help='Path to the CSV file')
    parser.add_argument('--api_key', required=True, help='API key (required)')
    parser.add_argument('--do_work', action='store_true', default=False,
                        help='Enable work processing (optional, defaults to False)')
    args = parser.parse_args()

    # Store command line arguments in variables
    api_key = args.api_key
    do_work = args.do_work

    auto_order_api = AutoOrderApi(api_client(api_key))

    # Expected column headers for the first three columns
    expected_headers = ['auto_order_code', 'next_shipment_dts', 'next_preshipment_notice_dts']

    try:
        with open(args.csv_file, 'r', newline='') as file:
            reader = csv.reader(file)

            # Read the header row
            try:
                headers = next(reader)
            except StopIteration:
                print("Error: CSV file is empty", file=sys.stderr)
                sys.exit(1)

            # Check if we have at least 3 columns
            if len(headers) < 3:
                print("Error: CSV file must have at least 3 columns", file=sys.stderr)
                sys.exit(1)

            # Validate the first three column headers
            first_three_headers = headers[:3]
            if first_three_headers != expected_headers:
                print(f"Error: First three column headers must be {expected_headers}", file=sys.stderr)
                print(f"Found: {first_three_headers}", file=sys.stderr)
                sys.exit(1)

            print("Column headers validated successfully!")
            print(f"API Key: {'*' * (len(api_key) - 4) + api_key[-4:] if len(api_key) > 4 else '***'}")
            print(f"Do Work: {do_work}")
            print(f"Processing rows with columns: {', '.join(expected_headers)}")
            print("-" * 50)

            # Loop through each data row and print the first three column values
            row_count = 0
            current_date = datetime.now()

            # Read all rows into an array first
            errors = []
            rows = []
            for row in reader:
                rows.append(row)

            for row_index, row in enumerate(rows, start=1):
                row_count += 1
                if len(row) < 3:
                    errors.append(f"Error: Row {row_count} has fewer than 3 columns, skipping...")
                    continue

                auto_order_code = row[0]
                next_shipment_dts_str = row[1]
                next_preshipment_notice_dts_str = row[2]

                try:
                    # Parse date strings into datetime objects
                    next_shipment_dt = datetime.strptime(next_shipment_dts_str, "%m/%d/%Y")
                    next_preshipment_notice_dt = datetime.strptime(next_preshipment_notice_dts_str, "%m/%d/%Y")

                    # Validate that both dates are in the future
                    if next_shipment_dt <= current_date:
                        errors.append(
                            f"Error: Row {row_count} - Next shipment date ({next_shipment_dts_str}) must be in the future")
                        continue

                    if next_preshipment_notice_dt <= current_date:
                        errors.append(
                            f"Error: Row {row_count} - Next preshipment notice date ({next_preshipment_notice_dts_str}) must be in the future")
                        continue

                    # Validate that preshipment date comes before shipment date
                    if next_preshipment_notice_dt >= next_shipment_dt:
                        errors.append(
                            f"Error: Row {row_count} - Preshipment notice date ({next_preshipment_notice_dts_str}) must be before shipment date ({next_shipment_dts_str})")
                        continue

                    # Convert to ISO8601 formatted strings
                    next_shipment_iso = next_shipment_dt.astimezone().isoformat('T', 'milliseconds')
                    next_preshipment_notice_iso = next_preshipment_notice_dt.astimezone().isoformat('T', 'milliseconds')


                    print(f"Row {row_count}: {auto_order_code} | {next_shipment_iso} | {next_preshipment_notice_iso}")

                except ValueError as e:
                    errors.append(f"Error: Row {row_count} - Invalid date format: {e}")
                    continue

            print("-" * 50)
            print("-" * 50)

            if len(errors)>0:
                for error in errors:
                    print(error)
                print("-" * 50)
                print(f"OPERATION DID NOT COMPLETE: There are {len(errors)} errors you must fix first.")
                print("-" * 50)
                sys.exit(1)

            row_count = 0
            for row_index, row in enumerate(rows, start=1):
                row_count += 1
                if len(row) < 3:
                    print(f"Warning: Row {row_count} has fewer than 3 columns, skipping...")
                    continue

                auto_order_code = row[0]
                next_shipment_dts_str = row[1]
                next_preshipment_notice_dts_str = row[2]

                try:
                    # Parse date strings into datetime objects
                    next_shipment_dt = datetime.strptime(next_shipment_dts_str, "%m/%d/%Y")
                    next_preshipment_notice_dt = datetime.strptime(next_preshipment_notice_dts_str, "%m/%d/%Y")

                    # Validate that both dates are in the future
                    if next_shipment_dt <= current_date:
                        print(
                            f"Error: Row {row_count} - Next shipment date ({next_shipment_dts_str}) must be in the future")
                        continue

                    if next_preshipment_notice_dt <= current_date:
                        print(
                            f"Error: Row {row_count} - Next preshipment notice date ({next_preshipment_notice_dts_str}) must be in the future")
                        continue

                    # Validate that preshipment date comes before shipment date
                    if next_preshipment_notice_dt >= next_shipment_dt:
                        print(
                            f"Error: Row {row_count} - Preshipment notice date ({next_preshipment_notice_dts_str}) must be before shipment date ({next_shipment_dts_str})")
                        continue

                    # Convert to ISO8601 formatted strings
                    next_shipment_iso = next_shipment_dt.astimezone().isoformat('T', 'milliseconds')
                    next_preshipment_notice_iso = next_preshipment_notice_dt.astimezone().isoformat('T', 'milliseconds')


                    # print(f"Row {row_count}: {auto_order_code} | {next_shipment_iso} | {next_preshipment_notice_iso}")

                    # Your additional logic will go here
                    # Variables available:
                    # - auto_order_code (string)
                    # - next_shipment_iso (ISO8601 date string)
                    # - next_preshipment_notice_iso (ISO8601 date string)
                    # - next_shipment_dt (datetime object)
                    # - next_preshipment_notice_dt (datetime object)

                    expand = "items"
                    api_response = auto_order_api.get_auto_order_by_code(auto_order_code, expand=expand)
                    auto_order = api_response.auto_order


                    if auto_order is not None:
                        # print(auto_order)
                        # print(f"Row {row_count} - Found Auto Order for AutoOrderCode={auto_order_code}")

                        prior_shipment_dts = None
                        prior_shipment_notice_dts = None

                        items = auto_order['items']
                        for item in items:
                            prior_shipment_dts = item['next_shipment_dts'] if 'next_shipment_dts' in item else 'MissingNextShipmentDts'
                            prior_shipment_notice_dts = item['next_preshipment_notice_dts'] if 'next_preshipment_notice_dts' in item else 'MissingNextPreshipmentNoticeDts'
                            item['next_shipment_dts'] = next_shipment_iso
                            item['next_preshipment_notice_dts'] = next_preshipment_notice_iso

                        if prior_shipment_dts == 'MissingNextShipmentDts':
                            print(
                                f"Row {row_count} - [MissingNextShipmentDts]: Not updating AutoOrderCode={auto_order_code}, NextShipmentDts={prior_shipment_dts} -> {next_shipment_iso}, NextPreshipmentDts={prior_shipment_notice_dts} -> {next_preshipment_notice_iso}")
                        elif prior_shipment_notice_dts == 'MissingNextPreshipmentNoticeDts':
                            print(
                                f"Row {row_count} - [MissingNextPreshipmentNoticeDts]: Not updating AutoOrderCode={auto_order_code}, NextShipmentDts={prior_shipment_dts} -> {next_shipment_iso}, NextPreshipmentDts={prior_shipment_notice_dts} -> {next_preshipment_notice_iso}")
                        elif do_work:
                            api_response = auto_order_api.update_auto_order(auto_order['auto_order_oid'], auto_order, expand=expand)
                            print(
                                f"Row {row_count} - Updated AutoOrderCode={auto_order_code}, NextShipmentDts={prior_shipment_dts} -> {next_shipment_iso}, NextPreshipmentDts={prior_shipment_notice_dts} -> {next_preshipment_notice_iso}")
                            print(api_response)
                        else:
                            print(
                                f"Row {row_count} - DRY RUN, Will update AutoOrderCode={auto_order_code}, NextShipmentDts={prior_shipment_dts} -> {next_shipment_iso}, NextPreshipmentDts={prior_shipment_notice_dts} -> {next_preshipment_notice_iso}")

                    else:
                        print( f"Error: Row {row_count} - Auto Order was not found for AutoOrderCode={auto_order_code}" )
                        continue


                except ValueError as e:
                    print(f"Error: Row {row_count} - Invalid date format: {e}")
                    continue

            print(f"\nProcessed {row_count} rows successfully.")

    except FileNotFoundError:
        print(f"Error: File '{args.csv_file}' not found", file=sys.stderr)
        sys.exit(1)
    except PermissionError:
        print(f"Error: Permission denied accessing file '{args.csv_file}'", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error reading CSV file: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()