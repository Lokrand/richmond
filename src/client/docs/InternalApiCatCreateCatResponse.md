
# InternalApiCatCreateCatResponse


## Properties

Name | Type
------------ | -------------
`catId` | string
`galleryPhotos` | [Array&lt;InternalApiCatFileMetadata&gt;](InternalApiCatFileMetadata.md)
`titlePhoto` | [InternalApiCatFileMetadata](InternalApiCatFileMetadata.md)

## Example

```typescript
import type { InternalApiCatCreateCatResponse } from ''

// TODO: Update the object below with actual values
const example = {
  "catId": null,
  "galleryPhotos": null,
  "titlePhoto": null,
} satisfies InternalApiCatCreateCatResponse

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InternalApiCatCreateCatResponse
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


