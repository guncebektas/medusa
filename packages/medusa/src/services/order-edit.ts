import { EntityManager } from "typeorm"
import { FindConfig } from "../types/common"
import { buildQuery } from "../utils"
import { MedusaError } from "medusa-core-utils"
import { CreateOrderEditInput } from "../types/order-edit"
import EventBusService from "./event-bus"
import { TransactionBaseService } from "../interfaces"

type InjectedDependencies = {
  manager: EntityManager
  orderEditRepository: OrderEditRepository
  eventBusService: EventBusService
}

export class OrderEditService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "order-edit.created",
  }

  protected transactionManager_: EntityManager | undefined
  protected readonly manager_: EntityManager
  protected readonly orderEditRepository_: OrderEditRepository
  protected readonly eventBus_: EventBusService

  constructor({
    manager,
    orderEditRepository,
    eventBusService,
  }: InjectedDependencies) {
    super({ manager })

    this.manager_ = manager
    this.orderEditRepository_ = orderEditRepository
    this.eventBus_ = eventBusService
  }

  async retrieve(
    orderEditId: string,
    config: FindConfig<OrderEdit>
  ): Promise<OrderEdit> {
    const manager = this.transactionManager_ ?? this.manager_

    const orderEditRepository = manager.getCustomRepository(
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

  protected async retrieveActiveOrderEdit(orderId: string): Promise<OrderEdit> {
    const manager = this.transactionManager_ ?? this.manager_
    const orderEditRepository = manager.getCustomRepository(
      this.orderEditRepository_
    )
    return await orderEditRepository.findOne({
      where: {
        order_id: orderId,
        confirmed_at: null,
        declined_at: null,
        canceled_at: null,
      },
    })
  }

  async create(
    data: CreateOrderEditInput,
    context: { loggedInUserId: string }
  ): Promise<OrderEdit> {
    return await this.atomicPhase_(async (transactionManager) => {
      const activeOrderEdit = await this.retrieveActiveOrderEdit(data.order_id)
      if (activeOrderEdit) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `An active order edit already exists for the order ${data.order_id}`
        )
      }

      const orderEditRepository = transactionManager.getCustomRepository(
        this.orderEditRepository_
      )

      const orderEditToCreate = orderEditRepository.create({
        order_id: data.order_id,
        internal_note: data.internal_note,
        created_by: context.loggedInUserId,
        requested_at: new Date(),
        requested_by: context.loggedInUserId,
      })
      const orderEdit = orderEditRepository.save(orderEditToCreate)

      await this.eventBus_
        .withTransaction(transactionManager)
        .emit(OrderEditService.Events.CREATED, { id: orderEdit.id })

      return orderEdit
    })
  }
}
