import { TransactionBaseService } from "../../dist"
import { EntityManager } from "typeorm"
import { FindConfig } from "../types/common"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"

type InjectedDependencies = {
  manager: EntityManager
  orderEditRepository: OrderEditRepository
}

export class OrderEditService extends TransactionBaseService {
  protected transactionManager_: EntityManager | undefined
  protected readonly manager_: EntityManager
  protected readonly orderEditRepository_: OrderEditRepository

  constructor({ manager, orderEditRepository }: InjectedDependencies) {
    super({ manager })

    this.manager_ = manager
    this.orderEditRepository_ = orderEditRepository
  }

  async retrieve(
    orderEditId: string,
    config: FindConfig<OrderEdit>
  ): Promise<OrderEdit> {
    const orderEditRepository = this.manager_.getCustomRepository(
      this.orderEditRepository_
    )
    const { relations, ...query } = buildQuery({ id: orderEditId }, config)

    const orderEdit = await orderEditRepository.findOneWithRelations(
      relations as (keyof OrderEdit)[],
      query
    )

    if (!orderEdit) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order edit with id ${orderEditId} was not found`
      )
    }

    return orderEdit
  }
}
