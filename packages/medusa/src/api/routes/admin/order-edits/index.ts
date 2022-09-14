import { Router } from "express"
import middlewares from "../../../middlewares"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"
import OrderEditingFeatureFlag from "../../../../loaders/feature-flags/order-editing"
import { DeleteResponse } from "../../../../types/common"

const route = Router()

export default (app) => {
  app.use(
    "/order-edits",
    isFeatureFlagEnabled(OrderEditingFeatureFlag.key),
    route
  )

  route.delete("/:id", middlewares.wrap(require("./delete-order-edit").default))

  return app
}

export type AdminOrderEditDeleteRes = DeleteResponse
