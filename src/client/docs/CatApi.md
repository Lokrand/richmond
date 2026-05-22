# CatApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1CatAllGet**](CatApi.md#apiv1catallget) | **GET** /api/v1/cat/all | List all cats |
| [**apiV1CatIdDelete**](CatApi.md#apiv1catiddelete) | **DELETE** /api/v1/cat/{id} | Delete a cat |
| [**apiV1CatIdGet**](CatApi.md#apiv1catidget) | **GET** /api/v1/cat/{id} | Get a cat by ID |
| [**apiV1CatIdPut**](CatApi.md#apiv1catidput) | **PUT** /api/v1/cat/{id} | Update a cat |
| [**apiV1CatNewPost**](CatApi.md#apiv1catnewpost) | **POST** /api/v1/cat/new | Create a new cat |



## apiV1CatAllGet

> InternalApiCatListCatsResponse apiV1CatAllGet(limit, offset)

List all cats

Lists cats with pagination (no auth required)

### Example

```ts
import {
  Configuration,
  CatApi,
} from '';
import type { ApiV1CatAllGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CatApi();

  const body = {
    // number | Limit (default 20, max 100) (optional)
    limit: 56,
    // number | Offset (default 0) (optional)
    offset: 56,
  } satisfies ApiV1CatAllGetRequest;

  try {
    const data = await api.apiV1CatAllGet(body);
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
| **limit** | `number` | Limit (default 20, max 100) | [Optional] [Defaults to `undefined`] |
| **offset** | `number` | Offset (default 0) | [Optional] [Defaults to `undefined`] |

### Return type

[**InternalApiCatListCatsResponse**](InternalApiCatListCatsResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CatIdDelete

> apiV1CatIdDelete(id, authorization)

Delete a cat

Deletes a cat by ID (auth required, must be owner)

### Example

```ts
import {
  Configuration,
  CatApi,
} from '';
import type { ApiV1CatIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CatApi();

  const body = {
    // number | Cat ID
    id: 56,
    // string | Insert your access token
    authorization: authorization_example,
  } satisfies ApiV1CatIdDeleteRequest;

  try {
    const data = await api.apiV1CatIdDelete(body);
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
| **id** | `number` | Cat ID | [Defaults to `undefined`] |
| **authorization** | `string` | Insert your access token | [Defaults to `&#39;Bearer &lt;Add access token here&gt;&#39;`] |

### Return type

`void` (Empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | No Content |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CatIdGet

> InternalApiCatCatResponse apiV1CatIdGet(id)

Get a cat by ID

Gets a cat with photos by ID

### Example

```ts
import {
  Configuration,
  CatApi,
} from '';
import type { ApiV1CatIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CatApi();

  const body = {
    // number | Cat ID
    id: 56,
  } satisfies ApiV1CatIdGetRequest;

  try {
    const data = await api.apiV1CatIdGet(body);
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
| **id** | `number` | Cat ID | [Defaults to `undefined`] |

### Return type

[**InternalApiCatCatResponse**](InternalApiCatCatResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CatIdPut

> InternalApiCatCatResponse apiV1CatIdPut(id, authorization, data)

Update a cat

Updates a cat by ID (auth required, must be owner)

### Example

```ts
import {
  Configuration,
  CatApi,
} from '';
import type { ApiV1CatIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CatApi();

  const body = {
    // number | Cat ID
    id: 56,
    // string | Insert your access token
    authorization: authorization_example,
    // InternalApiCatUpdateCatRequest | Update data
    data: ...,
  } satisfies ApiV1CatIdPutRequest;

  try {
    const data = await api.apiV1CatIdPut(body);
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
| **id** | `number` | Cat ID | [Defaults to `undefined`] |
| **authorization** | `string` | Insert your access token | [Defaults to `&#39;Bearer &lt;Add access token here&gt;&#39;`] |
| **data** | [InternalApiCatUpdateCatRequest](InternalApiCatUpdateCatRequest.md) | Update data | |

### Return type

[**InternalApiCatCatResponse**](InternalApiCatCatResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1CatNewPost

> InternalApiCatCreateCatResponse apiV1CatNewPost(authorization, data, file)

Create a new cat

Creates a new cat with photos (multipart/form-data)

### Example

```ts
import {
  Configuration,
  CatApi,
} from '';
import type { ApiV1CatNewPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new CatApi();

  const body = {
    // string | Insert your access token
    authorization: authorization_example,
    // string | JSON cat data
    data: data_example,
    // Array<Blob> | Photo files (first is title photo)
    file: /path/to/file.txt,
  } satisfies ApiV1CatNewPostRequest;

  try {
    const data = await api.apiV1CatNewPost(body);
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
| **authorization** | `string` | Insert your access token | [Defaults to `&#39;Bearer &lt;Add access token here&gt;&#39;`] |
| **data** | `string` | JSON cat data | [Defaults to `undefined`] |
| **file** | `Array<Blob>` | Photo files (first is title photo) | |

### Return type

[**InternalApiCatCreateCatResponse**](InternalApiCatCreateCatResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **100** | Cat data model |  -  |
| **201** | Created |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

