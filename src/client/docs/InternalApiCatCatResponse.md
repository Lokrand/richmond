
# InternalApiCatCatResponse


## Properties

Name | Type
------------ | -------------
`birthDate` | string
`breed` | string
`catId` | number
`createdAt` | string
`galleryPhotos` | [Array&lt;InternalApiCatFileMetadata&gt;](InternalApiCatFileMetadata.md)
`habits` | string
`name` | string
`titlePhoto` | [InternalApiCatFileMetadata](InternalApiCatFileMetadata.md)
`userId` | number
`weight` | number

## Example

```typescript
import type { InternalApiCatCatResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "birthDate": null,
  "breed": null,
  "catId": null,
  "createdAt": null,
  "galleryPhotos": null,
  "habits": null,
  "name": null,
  "titlePhoto": null,
  "userId": null,
  "weight": null,
} satisfies InternalApiCatCatResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InternalApiCatCatResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


