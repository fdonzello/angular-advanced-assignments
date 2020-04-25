/// <reference types="cypress" />

context('Dashboard', () => {
    beforeEach(() => {
        cy.visit('/account/dashboard')
    })

    it('shows the current balance', () => {
        cy.get('#balance').should('contain', '$')
    })

    it('shows the form for deposit and withdraw operations', () => {
        cy.get('form').should('be.visible')

        cy.get('input[type=number]#amount')
            .should('be.visible')
            .should('be.enabled')

        cy.get('input[type=radio]#deposit')
            .should('be.visible')
            .should('be.enabled')

        cy.get('input[type=radio]#withdraw')
            .should('be.visible')
            .should('be.enabled')

        cy.get('button[type=submit]')
            .should('be.visible')
    })

    // TODO: test operations

})
