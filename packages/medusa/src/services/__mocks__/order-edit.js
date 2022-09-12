import { IdMap } from "medusa-test-utils"

export const orderEdits = {
  testOrder: {
    id: IdMap.getId("test-order-edit"),
    email: "virgil@vandijk.dk",
    billing_address: {
      first_name: "Virgil",
      last_name: "Van Dijk",
      address_1: "24 Dunks Drive",
      city: "Los Angeles",
      country_code: "US",
      province: "CA",
      postal_code: "93011",
    },
    shipping_address: {
      first_name: "Virgil",
      last_name: "Van Dijk",
      address_1: "24 Dunks Drive",
      city: "Los Angeles",
      country_code: "US",
      province: "CA",
      postal_code: "93011",
    },
    items: [
      {
        id: IdMap.getId("existingLine"),
        title: "merge line",
        description: "This is a new line",
        thumbnail: "test-img-yeah.com/thumb",
        content: {
          unit_price: 123,
          variant: {
            id: IdMap.getId("can-cover"),
          },
          product: {
            id: IdMap.getId("validId"),
          },
          quantity: 1,
        },
        quantity: 10,
      },
    ],
    regionid: IdMap.getId("testRegion"),
    customerid: IdMap.getId("testCustomer"),
    payment_method: {
      providerid: "default_provider",
      data: {},
    },
    no_notification: true,
    shipping_method: [
      {
        providerid: "default_provider",
        profileid: IdMap.getId("validId"),
        data: {},
        items: {},
      },
    ],
  },
}

export const orderEditServiceMock = {
  withTransaction: function () {
    return this
  },
  retrieve: jest.fn().mockImplementation((orderId) => {
    if (orderId === IdMap.getId("test-order")) {
      return Promise.resolve(orderEdits.testOrder)
    }
    return Promise.resolve(undefined)
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditServiceMock
})

export default mock
