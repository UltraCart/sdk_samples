<?php
$begin_dts = date('Y-m-d', strtotime('-2000 days')) . "T00:00:00+00:00"; // yes, that 2,000 days.
$end_dts = date('Y-m-d', time()) . "T00:00:00+00:00";
error_log($begin_dts);
error_log($end_dts);
