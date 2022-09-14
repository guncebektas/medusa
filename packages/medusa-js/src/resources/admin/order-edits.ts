import {
  AdminOrderEditDeleteRes
} from "@medusajs/medusa"
import qs from "qs"
import { ResponsePromise } from "../../typings"
import BaseResource from "../base"

class AdminOrderEditsResource extends BaseResource {
  delete(
    id: string,
    customHeaders: Record<string, any> = {}
  ): ResponsePromise<AdminOrderEditDeleteRes> {
    const path = `/admin/order-edits/${id}`
    return this.client.request("DELETE", path, undefined, {}, customHeaders)
  }
}

export default AdminOrderEditsResource
