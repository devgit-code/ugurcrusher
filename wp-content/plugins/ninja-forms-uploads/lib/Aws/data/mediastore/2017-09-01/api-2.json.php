<?php

namespace NF_FU_LIB;

// This file was auto-generated from sdk-root/src/data/mediastore/2017-09-01/api-2.json
return ['version' => '2.0', 'metadata' => ['apiVersion' => '2017-09-01', 'endpointPrefix' => 'mediastore', 'jsonVersion' => '1.1', 'protocol' => 'json', 'serviceAbbreviation' => 'MediaStore', 'serviceFullName' => 'AWS Elemental MediaStore', 'serviceId' => 'MediaStore', 'signatureVersion' => 'v4', 'signingName' => 'mediastore', 'targetPrefix' => 'MediaStore_20170901', 'uid' => 'mediastore-2017-09-01'], 'operations' => ['CreateContainer' => ['name' => 'CreateContainer', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'CreateContainerInput'], 'output' => ['shape' => 'CreateContainerOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'LimitExceededException'], ['shape' => 'InternalServerError']]], 'DeleteContainer' => ['name' => 'DeleteContainer', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'DeleteContainerInput'], 'output' => ['shape' => 'DeleteContainerOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'DeleteContainerPolicy' => ['name' => 'DeleteContainerPolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'DeleteContainerPolicyInput'], 'output' => ['shape' => 'DeleteContainerPolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'PolicyNotFoundException'], ['shape' => 'InternalServerError']]], 'DeleteCorsPolicy' => ['name' => 'DeleteCorsPolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'DeleteCorsPolicyInput'], 'output' => ['shape' => 'DeleteCorsPolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'CorsPolicyNotFoundException'], ['shape' => 'InternalServerError']]], 'DeleteLifecyclePolicy' => ['name' => 'DeleteLifecyclePolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'DeleteLifecyclePolicyInput'], 'output' => ['shape' => 'DeleteLifecyclePolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'PolicyNotFoundException'], ['shape' => 'InternalServerError']]], 'DescribeContainer' => ['name' => 'DescribeContainer', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'DescribeContainerInput'], 'output' => ['shape' => 'DescribeContainerOutput'], 'errors' => [['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'GetContainerPolicy' => ['name' => 'GetContainerPolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'GetContainerPolicyInput'], 'output' => ['shape' => 'GetContainerPolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'PolicyNotFoundException'], ['shape' => 'InternalServerError']]], 'GetCorsPolicy' => ['name' => 'GetCorsPolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'GetCorsPolicyInput'], 'output' => ['shape' => 'GetCorsPolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'CorsPolicyNotFoundException'], ['shape' => 'InternalServerError']]], 'GetLifecyclePolicy' => ['name' => 'GetLifecyclePolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'GetLifecyclePolicyInput'], 'output' => ['shape' => 'GetLifecyclePolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'PolicyNotFoundException'], ['shape' => 'InternalServerError']]], 'ListContainers' => ['name' => 'ListContainers', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'ListContainersInput'], 'output' => ['shape' => 'ListContainersOutput'], 'errors' => [['shape' => 'InternalServerError']]], 'ListTagsForResource' => ['name' => 'ListTagsForResource', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'ListTagsForResourceInput'], 'output' => ['shape' => 'ListTagsForResourceOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'PutContainerPolicy' => ['name' => 'PutContainerPolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'PutContainerPolicyInput'], 'output' => ['shape' => 'PutContainerPolicyOutput'], 'errors' => [['shape' => 'ContainerNotFoundException'], ['shape' => 'ContainerInUseException'], ['shape' => 'InternalServerError']]], 'PutCorsPolicy' => ['name' => 'PutCorsPolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'PutCorsPolicyInput'], 'output' => ['shape' => 'PutCorsPolicyOutput'], 'errors' => [['shape' => 'ContainerNotFoundException'], ['shape' => 'ContainerInUseException'], ['shape' => 'InternalServerError']]], 'PutLifecyclePolicy' => ['name' => 'PutLifecyclePolicy', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'PutLifecyclePolicyInput'], 'output' => ['shape' => 'PutLifecyclePolicyOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'StartAccessLogging' => ['name' => 'StartAccessLogging', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'StartAccessLoggingInput'], 'output' => ['shape' => 'StartAccessLoggingOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'StopAccessLogging' => ['name' => 'StopAccessLogging', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'StopAccessLoggingInput'], 'output' => ['shape' => 'StopAccessLoggingOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'TagResource' => ['name' => 'TagResource', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'TagResourceInput'], 'output' => ['shape' => 'TagResourceOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]], 'UntagResource' => ['name' => 'UntagResource', 'http' => ['method' => 'POST', 'requestUri' => '/'], 'input' => ['shape' => 'UntagResourceInput'], 'output' => ['shape' => 'UntagResourceOutput'], 'errors' => [['shape' => 'ContainerInUseException'], ['shape' => 'ContainerNotFoundException'], ['shape' => 'InternalServerError']]]], 'shapes' => ['AllowedHeaders' => ['type' => 'list', 'member' => ['shape' => 'Header'], 'max' => 100, 'min' => 0], 'AllowedMethods' => ['type' => 'list', 'member' => ['shape' => 'MethodName'], 'max' => 4, 'min' => 1], 'AllowedOrigins' => ['type' => 'list', 'member' => ['shape' => 'Origin'], 'max' => 100, 'min' => 1], 'Container' => ['type' => 'structure', 'members' => ['Endpoint' => ['shape' => 'Endpoint'], 'CreationTime' => ['shape' => 'TimeStamp'], 'ARN' => ['shape' => 'ContainerARN'], 'Name' => ['shape' => 'ContainerName'], 'Status' => ['shape' => 'ContainerStatus'], 'AccessLoggingEnabled' => ['shape' => 'ContainerAccessLoggingEnabled']]], 'ContainerARN' => ['type' => 'string', 'max' => 1024, 'min' => 1, 'pattern' => 'arn:aws:mediastore:[a-z]+-[a-z]+-\\d:\\d{12}:container/[\\w-]{1,255}'], 'ContainerAccessLoggingEnabled' => ['type' => 'boolean'], 'ContainerInUseException' => ['type' => 'structure', 'members' => ['Message' => ['shape' => 'ErrorMessage']], 'exception' => \true], 'ContainerList' => ['type' => 'list', 'member' => ['shape' => 'Container']], 'ContainerListLimit' => ['type' => 'integer', 'max' => 100, 'min' => 1], 'ContainerName' => ['type' => 'string', 'max' => 255, 'min' => 1, 'pattern' => '[\\w-]+'], 'ContainerNotFoundException' => ['type' => 'structure', 'members' => ['Message' => ['shape' => 'ErrorMessage']], 'exception' => \true], 'ContainerPolicy' => ['type' => 'string', 'max' => 8192, 'min' => 1, 'pattern' => '[\\x00-\\x7F]+'], 'ContainerStatus' => ['type' => 'string', 'enum' => ['ACTIVE', 'CREATING', 'DELETING'], 'max' => 16, 'min' => 1], 'CorsPolicy' => ['type' => 'list', 'member' => ['shape' => 'CorsRule'], 'max' => 100, 'min' => 1], 'CorsPolicyNotFoundException' => ['type' => 'structure', 'members' => ['Message' => ['shape' => 'ErrorMessage']], 'exception' => \true], 'CorsRule' => ['type' => 'structure', 'required' => ['AllowedOrigins', 'AllowedHeaders'], 'members' => ['AllowedOrigins' => ['shape' => 'AllowedOrigins'], 'AllowedMethods' => ['shape' => 'AllowedMethods'], 'AllowedHeaders' => ['shape' => 'AllowedHeaders'], 'MaxAgeSeconds' => ['shape' => 'MaxAgeSeconds'], 'ExposeHeaders' => ['shape' => 'ExposeHeaders']]], 'CreateContainerInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName'], 'Tags' => ['shape' => 'TagList']]], 'CreateContainerOutput' => ['type' => 'structure', 'required' => ['Container'], 'members' => ['Container' => ['shape' => 'Container']]], 'DeleteContainerInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'DeleteContainerOutput' => ['type' => 'structure', 'members' => []], 'DeleteContainerPolicyInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'DeleteContainerPolicyOutput' => ['type' => 'structure', 'members' => []], 'DeleteCorsPolicyInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'DeleteCorsPolicyOutput' => ['type' => 'structure', 'members' => []], 'DeleteLifecyclePolicyInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'DeleteLifecyclePolicyOutput' => ['type' => 'structure', 'members' => []], 'DescribeContainerInput' => ['type' => 'structure', 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'DescribeContainerOutput' => ['type' => 'structure', 'members' => ['Container' => ['shape' => 'Container']]], 'Endpoint' => ['type' => 'string', 'max' => 255, 'min' => 1, 'pattern' => '[\\u0009\\u000A\\u000D\\u0020-\\u00FF]+'], 'ErrorMessage' => ['type' => 'string', 'max' => 255, 'min' => 1, 'pattern' => '[ \\w:\\.\\?-]+'], 'ExposeHeaders' => ['type' => 'list', 'member' => ['shape' => 'Header'], 'max' => 100, 'min' => 0], 'GetContainerPolicyInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'GetContainerPolicyOutput' => ['type' => 'structure', 'required' => ['Policy'], 'members' => ['Policy' => ['shape' => 'ContainerPolicy']]], 'GetCorsPolicyInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'GetCorsPolicyOutput' => ['type' => 'structure', 'required' => ['CorsPolicy'], 'members' => ['CorsPolicy' => ['shape' => 'CorsPolicy']]], 'GetLifecyclePolicyInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'GetLifecyclePolicyOutput' => ['type' => 'structure', 'required' => ['LifecyclePolicy'], 'members' => ['LifecyclePolicy' => ['shape' => 'LifecyclePolicy']]], 'Header' => ['type' => 'string', 'max' => 8192, 'min' => 1, 'pattern' => '[\\u0009\\u000A\\u000D\\u0020-\\u00FF]+'], 'InternalServerError' => ['type' => 'structure', 'members' => ['Message' => ['shape' => 'ErrorMessage']], 'exception' => \true, 'fault' => \true], 'LifecyclePolicy' => ['type' => 'string', 'max' => 8192, 'min' => 0, 'pattern' => '[\\u0009\\u000A\\u000D\\u0020-\\u00FF]+'], 'LimitExceededException' => ['type' => 'structure', 'members' => ['Message' => ['shape' => 'ErrorMessage']], 'exception' => \true], 'ListContainersInput' => ['type' => 'structure', 'members' => ['NextToken' => ['shape' => 'PaginationToken'], 'MaxResults' => ['shape' => 'ContainerListLimit']]], 'ListContainersOutput' => ['type' => 'structure', 'required' => ['Containers'], 'members' => ['Containers' => ['shape' => 'ContainerList'], 'NextToken' => ['shape' => 'PaginationToken']]], 'ListTagsForResourceInput' => ['type' => 'structure', 'required' => ['Resource'], 'members' => ['Resource' => ['shape' => 'ContainerARN']]], 'ListTagsForResourceOutput' => ['type' => 'structure', 'members' => ['Tags' => ['shape' => 'TagList']]], 'MaxAgeSeconds' => ['type' => 'integer', 'max' => 2147483647, 'min' => 0], 'MethodName' => ['type' => 'string', 'enum' => ['PUT', 'GET', 'DELETE', 'HEAD']], 'Origin' => ['type' => 'string', 'max' => 2048, 'min' => 1, 'pattern' => '[\\u0009\\u000A\\u000D\\u0020-\\u00FF]+'], 'PaginationToken' => ['type' => 'string', 'max' => 1024, 'min' => 1, 'pattern' => '[0-9A-Za-z=/+]+'], 'PolicyNotFoundException' => ['type' => 'structure', 'members' => ['Message' => ['shape' => 'ErrorMessage']], 'exception' => \true], 'PutContainerPolicyInput' => ['type' => 'structure', 'required' => ['ContainerName', 'Policy'], 'members' => ['ContainerName' => ['shape' => 'ContainerName'], 'Policy' => ['shape' => 'ContainerPolicy']]], 'PutContainerPolicyOutput' => ['type' => 'structure', 'members' => []], 'PutCorsPolicyInput' => ['type' => 'structure', 'required' => ['ContainerName', 'CorsPolicy'], 'members' => ['ContainerName' => ['shape' => 'ContainerName'], 'CorsPolicy' => ['shape' => 'CorsPolicy']]], 'PutCorsPolicyOutput' => ['type' => 'structure', 'members' => []], 'PutLifecyclePolicyInput' => ['type' => 'structure', 'required' => ['ContainerName', 'LifecyclePolicy'], 'members' => ['ContainerName' => ['shape' => 'ContainerName'], 'LifecyclePolicy' => ['shape' => 'LifecyclePolicy']]], 'PutLifecyclePolicyOutput' => ['type' => 'structure', 'members' => []], 'StartAccessLoggingInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'StartAccessLoggingOutput' => ['type' => 'structure', 'members' => []], 'StopAccessLoggingInput' => ['type' => 'structure', 'required' => ['ContainerName'], 'members' => ['ContainerName' => ['shape' => 'ContainerName']]], 'StopAccessLoggingOutput' => ['type' => 'structure', 'members' => []], 'Tag' => ['type' => 'structure', 'required' => ['Key'], 'members' => ['Key' => ['shape' => 'TagKey'], 'Value' => ['shape' => 'TagValue']]], 'TagKey' => ['type' => 'string', 'max' => 128, 'min' => 1], 'TagKeyList' => ['type' => 'list', 'member' => ['shape' => 'TagKey']], 'TagList' => ['type' => 'list', 'member' => ['shape' => 'Tag']], 'TagResourceInput' => ['type' => 'structure', 'required' => ['Resource', 'Tags'], 'members' => ['Resource' => ['shape' => 'ContainerARN'], 'Tags' => ['shape' => 'TagList']]], 'TagResourceOutput' => ['type' => 'structure', 'members' => []], 'TagValue' => ['type' => 'string', 'max' => 256, 'min' => 0], 'TimeStamp' => ['type' => 'timestamp'], 'UntagResourceInput' => ['type' => 'structure', 'required' => ['Resource', 'TagKeys'], 'members' => ['Resource' => ['shape' => 'ContainerARN'], 'TagKeys' => ['shape' => 'TagKeyList']]], 'UntagResourceOutput' => ['type' => 'structure', 'members' => []]]];