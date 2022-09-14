import { queryKeysFactory } from "../../utils/index"

const ADMIN_ORDER_EDITS_QUERY_KEY = `admin_order_edits` as const

export const adminOrderEditsKeys = queryKeysFactory(ADMIN_ORDER_EDITS_QUERY_KEY)

