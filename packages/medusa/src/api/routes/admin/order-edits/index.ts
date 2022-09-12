import { Router } from "express"
import middlewares, { transformQuery } from "../../../middlewares"
import { EmptyQueryParams } from "../../../../types/common"
import { isFeatureFlagEnabled } from "../../../middlewares/feature-flag-enabled"

const route = Router()

export default (app) => {
  app.use("/order-edits", isFeatureFlagEnabled(OrderEditFeatureFlag), route)

  route.get(
    "/",
    transformQuery(EmptyQueryParams, {
      defaultRelations: defaultAdminOrderEditRelations,
      defaultFields: defaultAdminOrderEditFields,
      isList: false,
    }),
    middlewares.wrap(require("./get-order-edit").default)
  )

  return app
}

export const defaultAdminOrderEditRelations = []
export const defaultAdminOrderEditFields = []
