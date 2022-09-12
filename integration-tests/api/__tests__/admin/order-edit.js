const path = require("path")

const startServerWithEnvironment =
  require("../../../helpers/start-server-with-environment").default
const { useApi } = require("../../../helpers/use-api")
const { useDb } = require("../../../helpers/use-db")

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

  describe("GET /admin/order-edits/:id", () => {
    let orderEditId

    beforeEach(async () => {
      await adminSeeder(dbConnection)
    })

    afterEach(async () => {
      const db = useDb()
      return await db.teardown()
    })

    it("gets order edit", async () => {
      const api = useApi()

      const response = await api.get(
        `/admin/order-edits/${orderEditId}`,
        adminHeaders
      )

      expect(response.status).toEqual(200)
    })
  })
})
