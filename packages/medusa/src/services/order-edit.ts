import { EntityManager } from "typeorm"
import { MedusaError } from "medusa-core-utils"
import { OrderEditRepository } from "../repositories/order-edit"
import { OrderEditStatus } from "../models/order-edit"
import { TransactionBaseService } from "../interfaces"

type InjectedDependencies = {
  manager: EntityManager
  orderEditRepository: typeof OrderEditRepository
}

export class OrderEditService extends TransactionBaseService {
  protected transactionManager_: EntityManager | undefined
  protected readonly manager_: EntityManager

  protected readonly orderEditRepository_: typeof OrderEditRepository

  constructor({ manager, orderEditRepository }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.orderEditRepository_ = orderEditRepository
  }

  async delete(orderEditId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const orderEditRepo = manager.getCustomRepository(
        this.orderEditRepository_
      )

      const edit = await orderEditRepo.findOne({ where: { id: orderEditId } })

      if (!edit) {
        return
      }

      if (edit.status !== OrderEditStatus.CREATED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Cannot delete order edit with status ${edit.status}`
        )
      }

      await orderEditRepo.softRemove(edit)
    })
  }
}

export default OrderEditService
