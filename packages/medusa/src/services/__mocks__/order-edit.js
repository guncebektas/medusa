export const orderEditServiceMock = {
  withTransaction: function () {
    return this
  },
  delete: jest.fn().mockImplementation((_) => {
    return Promise.resolve()
  }),
}

const mock = jest.fn().mockImplementation(() => {
  return orderEditServiceMock
})

export default mock
