const Membership = artifacts.require('./Membership.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Membership', (accounts) => {
  let contract

  before(async () => {
    contract = await Membership.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has an organization counter', async () => {
      const counter = await contract.orgaCounter()
      assert.equal(counter, 0)
    })

    it('has a member counter', async () => {
      const counter = await contract.memberCounter()
      assert.equal(counter, 0)
    })

  })

  describe('minting', async () => {
    it('creates a new organization', async () => {
      const result = await contract.createOrganization('ORGA_1','ORGA_1.ro','ORGA_1.ro','reason',true,'reason')
      const counter = await contract.orgaCounter()

      // SUCCESS
      assert.equal(counter, 1)
      const event = result.logs[0].args
      assert.equal(event.orgaId.toNumber(), 0, 'id is correct')
      
      // FAILURE: cannot mint same orga name twice
      await contract.createOrganization('ORGA_1').should.be.rejected;
    })
  })

})
