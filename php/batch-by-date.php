<?php
	
include('../inc/ez_sql.php');

include 'batch_functions/config.php'; // setup the connectors to UC
include 'batch_functions/functions.php';
include('batch_functions/query_add_coupons.php'); // coupon sql function
include('batch_functions/query_add_order.php'); // coupon sql function	
include('batch_functions/query_add_items.php'); // coupon sql function	
$timer_start = microtime_float();


$doquery=1;
$debug=1;
$search='';
$exception_die = 0;

$month = 1;
$toyear=$year=2009;
$range=1;
$_limit = 200; // (Maximum 200)

///
///
$tomonth = $month+$range;
if($tomonth>12) { $toyear++; $tomonth = $tomonth-12; }
if($month<10) $month = '0'.$month;
if($tomonth<10) $tomonth = '0'.$tomonth;

if($begin=='') $begin = "$year-$month-01T00:00:00-00:00";
if($end=='') $end = "$toyear-$tomonth-01T00:00:00-00:00";

$fails='';
$calls=0;
/*
$begin = "2017-11-07T00:00:00-05:00";
$end = "2017-11-08T00:00:00-05:00";
*/



$order_query->setCreationDateBegin($begin);
$order_query->setCreationDateEnd($end);


$_offset = 0; // int | Pagination of the record set.  Offset is a zero based index.
$_sort = "order_id";


echo "\nRunning from $begin  to  $end \n\n";


for ($_offset = 0; ; $_offset += $_limit) {
	
    echo "\nPulling offset $_offset ($exception_order_date) (api calls: $calls)\n";
    $calls++;
    try {
        $result = $api_instance->getOrdersByQuery($order_query, $_limit, $_offset, $_sort, $_expand);

        if ($result->getSuccess()) {
            echo 'Retrieved ' . count($result->getOrders()) . PHP_EOL;

            for ($i = 0; $i < count($result->getOrders()); $i++) {
                //echo $result->getOrders()[$i]->getOrderId() . PHP_EOL;
                
                $order = $result->getOrders()[$i];
                $jsonobj = $order->__toString();
                $order_data = json_decode($jsonobj, TRUE);
                $exception_order_id = $order_data['order_id'];
                $exception_order_date = $order_data['creation_dts'];
				$is_hea_sale=0; // check for hearing aid sku in the ORDER ITEM, push unit count into this var for order
				$is_hea_family=''; // catch the hea family same as the unit count
				
				
				echo "\n=== $exception_order_id ===\n";
				$sqA = add_items($order_data);
				//if($debug) echo "$sqA\n===\n";
				
				$sq = add_order($order_data);
				//if($debug) echo "$sq\n===\n";

				$sqC = add_coupon($order_data);
				//if($debug) echo "$sqC\n===\n";
				
                if($search!='') {
	                if(stristr($jsonobj, $search)) {
		                echo "\n\n found search \n\n";
		                print_r($order_data);
		                echo "$sq\n";
		                echo "\n\n found search \n\n";
		                exit;
	                }
                }

            }

            // Are we done?
            if (count( $result->getOrders() ) < $_limit) {
                echo 'Finished' . PHP_EOL;
                break;
            }
            
        } else {
            echo 'Failed to retrieve orders' . PHP_EOL;
            break;
        }
    } catch (Exception $e) {
	    $msg=$e->getMessage();
        echo "Exception when calling OrderApi->getOrdersByQuery: $exception_order_id\n$msg". PHP_EOL;
        $buf .= "\n---\n$exception_order_id\n$msg";
        $exceptions++;
        if($exception_die==2) {echo $buf ; exit;}
        if($exception_die==1) {echo $buf ; $mailfail=1;}
    }
    
    //if($_offset>= $_limit) break;
    //if($_offset > 400) break;
}



echo "\n\nExceptions: $exceptions\n\n$buf\n\n";

if($mailfail==1) { mail('sjw@mdhearingaid.com', 'CRON: API: ULTRACART FAIL', "Exceptions: $exceptions\n\n$buf\n\n"); }

echo "\n\n\nRan from $begin  to  $end \n\n";

$timer_end = microtime_float();
$run_time = number_format($timer_end - $timer_start);

echo "program ran for $run_time seconds with $calls API calls\n\n";
?>