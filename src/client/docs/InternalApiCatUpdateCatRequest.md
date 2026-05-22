
# InternalApiCatUpdateCatRequest


## Properties

Name | Type
------------ | -------------
`birthDate` | string
`breed` | string
`habits` | string
`name` | string
`weight` | number

## Example

```typescript
import type { InternalApiCatUpdateCatRequest } from ''

// TODO: Update the object below with actual values
const example = {
  "birthDate": null,
  "breed": null,
  "habits": null,
  "name": null,
  "weight": null,
} satisfies InternalApiCatUpdateCatRequest

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as InternalApiCatUpdateCatRequest
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


