import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { ProductServiceMock } from "../../../../../services/__mocks__/product"
import { ProductVariantServiceMock } from "../../../../../services/__mocks__/product-variant"
import { ShippingProfileServiceMock } from "../../../../../services/__mocks__/shipping-profile"
import { OrderEditService } from "../../../../../services/order-edit"

describe("POST /admin/order-edits", () => {
  describe("successfully create an order edit", () => {
    const orderId = IdMap.getId("order-edit-order-id-test")
    const internalNote = "test internal note"
    let subject

    beforeAll(async () => {
      subject = await request("POST", "/admin/order-edits", {
        payload: {
          order_id: orderId,
          internal_note: internalNote,
        },
        adminSession: {
          jwt: {
            userId: IdMap.getId("admin_user"),
          },
        },
      })
    })

    afterAll(async () => {
      jest.clearAllMocks()
    })

    it("returns 200", () => {
      expect(subject.status).toEqual(200)
    })

    it("calls order edit service create", () => {
      expect(OrderEditService.create).toHaveBeenCalledTimes(1)
      expect(OrderEditService.create).toHaveBeenCalledWith(
        {
          order_id: orderId,
          internal_note: internalNote,
        },
        {
          looggedInUserId: IdMap.getId("admin_user"),
        }
      )
    })
  })
})
