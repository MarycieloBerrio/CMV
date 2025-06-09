class LoginPage {
  elements = {
    emailInput: () => cy.get('input[type="email"]'),
    passwordInput: () => cy.get('input[type="password"]'),
    submitButton: () => cy.get('button[type="submit"]'),
  }

  login() {
    this.elements.emailInput().type('wasa@gmail.com')
    this.elements.passwordInput().type('Abcdsd123#')
    this.elements.submitButton().click()
  }
}

export default new LoginPage()
