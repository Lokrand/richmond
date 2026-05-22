# PostApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1PostAllGet**](PostApi.md#apiv1postallget) | **GET** /api/v1/post/all | List all posts |
| [**apiV1PostIdDelete**](PostApi.md#apiv1postiddelete) | **DELETE** /api/v1/post/{id} | Delete a post |
| [**apiV1PostIdGet**](PostApi.md#apiv1postidget) | **GET** /api/v1/post/{id} | Get a post by ID |
| [**apiV1PostIdPut**](PostApi.md#apiv1postidput) | **PUT** /api/v1/post/{id} | Update a post |
| [**apiV1PostNewPost**](PostApi.md#apiv1postnewpost) | **POST** /api/v1/post/new | Create a new post |



## apiV1PostAllGet

> InternalApiPostListPostsResponse apiV1PostAllGet(limit, offset)

List all posts

Lists posts with pagination (no auth required)

### Example

```ts
import {
  Configuration,
  PostApi,
} from '';
import type { ApiV1PostAllGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostApi();

  const body = {
    // number | Limit (default 20, max 100) (optional)
    limit: 56,
    // number | Offset (default 0) (optional)
    offset: 56,
  } satisfies ApiV1PostAllGetRequest;

  try {
    const data = await api.apiV1PostAllGet(body);
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

[**InternalApiPostListPostsResponse**](InternalApiPostListPostsResponse.md)

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


## apiV1PostIdDelete

> apiV1PostIdDelete(id, authorization)

Delete a post

Deletes a post by ID (auth required, must be owner)

### Example

```ts
import {
  Configuration,
  PostApi,
} from '';
import type { ApiV1PostIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostApi();

  const body = {
    // number | Post ID
    id: 56,
    // string | Insert your access token
    authorization: authorization_example,
  } satisfies ApiV1PostIdDeleteRequest;

  try {
    const data = await api.apiV1PostIdDelete(body);
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
| **id** | `number` | Post ID | [Defaults to `undefined`] |
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


## apiV1PostIdGet

> InternalApiPostPostResponse apiV1PostIdGet(id)

Get a post by ID

Gets a post by ID

### Example

```ts
import {
  Configuration,
  PostApi,
} from '';
import type { ApiV1PostIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostApi();

  const body = {
    // number | Post ID
    id: 56,
  } satisfies ApiV1PostIdGetRequest;

  try {
    const data = await api.apiV1PostIdGet(body);
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
| **id** | `number` | Post ID | [Defaults to `undefined`] |

### Return type

[**InternalApiPostPostResponse**](InternalApiPostPostResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **400** | Bad Request |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1PostIdPut

> InternalApiPostPostResponse apiV1PostIdPut(id, authorization, data)

Update a post

Updates a post by ID (auth required, must be owner)

### Example

```ts
import {
  Configuration,
  PostApi,
} from '';
import type { ApiV1PostIdPutRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostApi();

  const body = {
    // number | Post ID
    id: 56,
    // string | Insert your access token
    authorization: authorization_example,
    // InternalApiPostUpdatePostRequest | Update data
    data: ...,
  } satisfies ApiV1PostIdPutRequest;

  try {
    const data = await api.apiV1PostIdPut(body);
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
| **id** | `number` | Post ID | [Defaults to `undefined`] |
| **authorization** | `string` | Insert your access token | [Defaults to `&#39;Bearer &lt;Add access token here&gt;&#39;`] |
| **data** | [InternalApiPostUpdatePostRequest](InternalApiPostUpdatePostRequest.md) | Update data | |

### Return type

[**InternalApiPostPostResponse**](InternalApiPostPostResponse.md)

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


## apiV1PostNewPost

> InternalApiPostPostResponse apiV1PostNewPost(authorization, data, file)

Create a new post

Creates a new post for a cat with photos (multipart/form-data)

### Example

```ts
import {
  Configuration,
  PostApi,
} from '';
import type { ApiV1PostNewPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new PostApi();

  const body = {
    // string | Insert your access token
    authorization: authorization_example,
    // string | JSON post data
    data: data_example,
    // Array<Blob> | Photo files
    file: /path/to/file.txt,
  } satisfies ApiV1PostNewPostRequest;

  try {
    const data = await api.apiV1PostNewPost(body);
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
| **data** | `string` | JSON post data | [Defaults to `undefined`] |
| **file** | `Array<Blob>` | Photo files | |

### Return type

[**InternalApiPostPostResponse**](InternalApiPostPostResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `multipart/form-data`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **400** | Bad Request |  -  |
| **401** | Unauthorized |  -  |
| **403** | Forbidden |  -  |
| **404** | Not Found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

