import LoginPage from './pages/LoginPage'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should login the user', () => {
    LoginPage.login()
    cy.url().should('include', '/users')
  })
})
