<?php

namespace NF_FU_LIB;

// This file was auto-generated from sdk-root/src/data/route53/2013-04-01/paginators-1.json
return ['pagination' => ['ListHealthChecks' => ['input_token' => 'Marker', 'limit_key' => 'MaxItems', 'more_results' => 'IsTruncated', 'output_token' => 'NextMarker', 'result_key' => 'HealthChecks'], 'ListHostedZones' => ['input_token' => 'Marker', 'limit_key' => 'MaxItems', 'more_results' => 'IsTruncated', 'output_token' => 'NextMarker', 'result_key' => 'HostedZones'], 'ListResourceRecordSets' => ['input_token' => ['StartRecordName', 'StartRecordType', 'StartRecordIdentifier'], 'limit_key' => 'MaxItems', 'more_results' => 'IsTruncated', 'output_token' => ['NextRecordName', 'NextRecordType', 'NextRecordIdentifier'], 'result_key' => 'ResourceRecordSets']]];
