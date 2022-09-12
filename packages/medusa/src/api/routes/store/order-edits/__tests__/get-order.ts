import { IdMap } from "medusa-test-utils"
import { request } from "../../../../../helpers/test-request"
import { orderEditServiceMock } from "../../../../../services/__mocks__/order-edit"
import {
  defaultStoreOrderEditFields,
  defaultStoreOrderEditRelations,
} from "../index"

describe("GET /store/order-edits", () => {
  describe("successfully gets an order edit", () => {
    const orderEditId = IdMap.getId("test-order-edit")
    let subject

    beforeAll(async () => {
      subject = await request("GET", `/store/orders/${orderEditId}`)
    })

    afterAll(() => {
      jest.clearAllMocks()
    })

    it("calls orderService retrieve", () => {
      expect(orderEditServiceMock.retrieve).toHaveBeenCalledTimes(1)
      expect(orderEditServiceMock.retrieve).toHaveBeenCalledWith(orderEditId, {
        select: defaultStoreOrderEditFields,
        relations: defaultStoreOrderEditRelations,
      })
    })

    it("returns order", () => {
      expect(subject.body.order_edit.id).toEqual(orderEditId)
    })
  })
})
