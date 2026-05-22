# FileApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1FileKeyGet**](FileApi.md#apiv1filekeyget) | **GET** /api/v1/file/{key} | Download a file from S3 |



## apiV1FileKeyGet

> Blob apiV1FileKeyGet(key, quality)

Download a file from S3

Downloads a file by key from S3 storage

### Example

```ts
import {
  Configuration,
  FileApi,
} from '';
import type { ApiV1FileKeyGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new FileApi();

  const body = {
    // string | File key
    key: key_example,
    // 'original' | 'thumbnail' | 'preview' | Quality (original, thumbnail, or preview) (optional)
    quality: quality_example,
  } satisfies ApiV1FileKeyGetRequest;

  try {
    const data = await api.apiV1FileKeyGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **key** | `string` | File key | [Defaults to `undefined`] |
| **quality** | `original`, `thumbnail`, `preview` | Quality (original, thumbnail, or preview) | [Optional] [Defaults to `undefined`] [Enum: original, thumbnail, preview] |

### Return type

**Blob**

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/octet-stream`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |
| **500** | Internal Server Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

