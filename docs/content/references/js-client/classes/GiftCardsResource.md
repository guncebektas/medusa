# Class: GiftCardsResource

## Hierarchy

- `default`

  ↳ **`GiftCardsResource`**

## Methods

### retrieve

▸ **retrieve**(`code`, `customHeaders?`): [`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGiftCardsRes`](../modules/internal-33.md#storegiftcardsres)\>

**`Description`**

Retrieves a single GiftCard

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `string` | code of the gift card |
| `customHeaders` | `Record`<`string`, `any`\> |  |

#### Returns

[`ResponsePromise`](../modules/internal.md#responsepromise)<[`StoreGiftCardsRes`](../modules/internal-33.md#storegiftcardsres)\>

#### Defined in

[medusa-js/src/resources/gift-cards.ts:12](https://github.com/medusajs/medusa/blob/f7a63f178/packages/medusa-js/src/resources/gift-cards.ts#L12)
