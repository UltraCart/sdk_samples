<?php
$begin_dts = date('Y-m-d', strtotime('-180 days')) . "T00:00:00+00:00";
$end_dts = date('Y-m-d', time()) . "T00:00:00+00:00";
error_log($begin_dts);
error_log($end_dts);
