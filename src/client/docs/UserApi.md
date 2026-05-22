# UserApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**apiV1UserGet**](UserApi.md#apiv1userget) | **GET** /api/v1/user | Get current user |
| [**apiV1UserLoginPost**](UserApi.md#apiv1userloginpost) | **POST** /api/v1/user/login | Login |
| [**apiV1UserNewPost**](UserApi.md#apiv1usernewpost) | **POST** /api/v1/user/new | Create a new user |



## apiV1UserGet

> InternalApiUserUserResponse apiV1UserGet(authorization)

Get current user

Returns user data for authenticated user

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { ApiV1UserGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // string | Insert your access token
    authorization: authorization_example,
  } satisfies ApiV1UserGetRequest;

  try {
    const data = await api.apiV1UserGet(body);
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

### Return type

[**InternalApiUserUserResponse**](InternalApiUserUserResponse.md)

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

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UserLoginPost

> InternalApiUserTokenResponse apiV1UserLoginPost(request)

Login

Login with credentials, returns auth token

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { ApiV1UserLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // InternalApiUserLoginRequest | User credentials
    request: ...,
  } satisfies ApiV1UserLoginPostRequest;

  try {
    const data = await api.apiV1UserLoginPost(body);
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
| **request** | [InternalApiUserLoginRequest](InternalApiUserLoginRequest.md) | User credentials | |

### Return type

[**InternalApiUserTokenResponse**](InternalApiUserTokenResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |
| **401** | Unauthorized |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## apiV1UserNewPost

> InternalApiUserUserResponse apiV1UserNewPost(request)

Create a new user

Creates a new user with hashed password

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { ApiV1UserNewPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // InternalApiUserCreateRequest | User credentials
    request: ...,
  } satisfies ApiV1UserNewPostRequest;

  try {
    const data = await api.apiV1UserNewPost(body);
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
| **request** | [InternalApiUserCreateRequest](InternalApiUserCreateRequest.md) | User credentials | |

### Return type

[**InternalApiUserUserResponse**](InternalApiUserUserResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Created |  -  |
| **409** | Conflict |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

