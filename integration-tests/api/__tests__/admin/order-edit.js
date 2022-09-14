const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")
const {
  simpleOrderEditFactory,
} = require("../../factories/simple-order-edit-factory")

const adminSeeder = require("../../helpers/admin-seeder")

const adminHeaders = {
  headers: {
    Authorization: "Bearer test_token",
  },
}

jest.setTimeout(30000)

describe("[MEDUSA_FF_ORDER_EDITING] /admin/order-edits", () => {
  let medusaProcess
  let dbConnection
  const adminUserId = "admin_user"

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", ".."))
    const [process, connection] = await startServerWithEnvironment({
      cwd,
      env: { MEDUSA_FF_ORDER_EDITING: true },
      verbose: false,
    })
    dbConnection = connection
    medusaProcess = process
  })

  afterAll(async () => {
    const db = useDb()
    await db.shutdown()

    medusaProcess.kill()
  })

  describe("DELETE /admin/order-edits/:id", () => {
    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("deletes order edit", async () => {
      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: adminUserId,
      })

      const api = useApi()

      const response = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
    })

    it("deletes already removed order edit", async () => {
      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: adminUserId,
      })

      const api = useApi()

      const response = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )
      expect(response.status).toEqual(200)
      expect(response.data).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })

      const idempontentResponse = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      expect(idempontentResponse.status).toEqual(200)
      expect(idempontentResponse.data).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
    })

    test.each([
      [
        "requested",
        {
          requested_at: new Date(),
          requested_by: adminUserId,
        },
      ],
      [
        "confirmed",
        {
          confirmed_at: new Date(),
          confirmed_by: adminUserId,
        },
      ],
      [
        "declined",
        {
          declined_at: new Date(),
          declined_by: adminUserId,
        },
      ],
      [
        "canceled",
        {
          canceled_at: new Date(),
          canceled_by: adminUserId,
        },
      ],
    ])("fails to delete order edit with status %s", async (status, data) => {
      expect.assertions(2)

      const { id } = await simpleOrderEditFactory(dbConnection, {
        created_by: adminUserId,
        ...data,
      })

      const api = useApi()

      await api
        .delete(`/admin/order-edits/${id}`, adminHeaders)
        .catch((err) => {
          console.log(err.response.data)
          expect(err.response.status).toEqual(400)
          expect(err.response.data.message).toEqual(
            `Cannot delete order edit with status ${status}`
          )
        })
    })
  })
})
