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

  beforeAll(async () => {
    const cwd = path.resolve(path.join(__dirname, "..", "..", ".."))
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
      const { id } = await simpleOrderEditFactory(dbConnection)

      const api = useApi()

      const response = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
    })

    it("deletes already removed order edit", async () => {
      const { id } = await simpleOrderEditFactory(dbConnection)

      const api = useApi()

      const response = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )
      const idempontentResponse = await api.delete(
        `/admin/order-edits/${id}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
      expect(response.body).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
      expect(idempontentResponse.status).toEqual(200)
      expect(idempontentResponse.body).toEqual({
        id,
        object: "order_edit",
        deleted: true,
      })
    })

    // test.each([
    //   {
    //     timestampField: "requested_at",
    //     actorField: "requested_by",
    //     status: "",
    //   },
    //   // {
    //   //   timestampField: "confirmed_at",
    //   //   actorField: "confirmed_by",
    //   //   status: "",
    //   // },
    //   // { timestampField: "declined_at", actorField: "declined_by", status: "" },
    //   // {
    //   //   timestampField: "cancelled_at",
    //   //   actorField: "cancelled_by",
    //   //   status: "",
    //   // },
    // ])(
    //   "fails to delet order edit with status $status",
    //   async ({ timestampField, actorField, status }) => {
    //     expect.assertions(2)
    //     const adminUserId = "admin_user"
    //     const { id } = await simpleOrderEditFactory(dbConnection, {
    //       [timestampField]: new Date(),
    //       [actorField]: adminUserId,
    //     })

    //     const api = useApi()

    //     await api
    //       .delete(`/admin/order-edits/${id}`, adminHeaders)
    //       .catch((err) => {
    //         console.log(err)
    //       })
    //   }
    // )

    it("fails to delet order edit with status not Created", async () => {
      expect.assertions(2)

      const adminUserId = "admin_user"
      const { id } = await simpleOrderEditFactory(dbConnection, {
        canceled_at: new Date(),
        canceled_by: adminUserId,
      })

      const api = useApi()

      await api
        .delete(`/admin/order-edits/${id}`, adminHeaders)
        .catch((err) => {
          console.log(err)
        })
    })
  })
})
