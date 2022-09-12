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
      defaultRelations: defaultStoreOrderEditRelations,
      defaultFields: defaultStoreOrderEditFields,
      allowedFields: defaultStoreOrderEditFields.filter(
        (field) => field !== "internal_note"
      ),
      isList: false,
    }),
    middlewares.wrap(require("./get-order-edit").default)
  )

  return app
}

export const defaultStoreOrderEditRelations = []
export const defaultStoreOrderEditFields = []
