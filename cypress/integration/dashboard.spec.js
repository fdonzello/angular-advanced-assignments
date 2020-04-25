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

    it('allows to deposit successfully', () => {
        cy.get('input[type=number]#amount')
            .clear()
            .type(100)

        cy.get('button[type=submit]')
            .should('be.visible')
            .should('be.enabled')
            .click()
            .should('be.disabled')

        cy.get('#loader')
            .should('be.visible')

        cy.get('#error')
            .should('not.exist')

        cy.get('#loader')
            .should('not.exist')


        cy.get('input[type=number]#amount')
            .should('have.value', '0')


        cy.get('button[type=submit]')
            .should('be.enabled')

        cy.get('#balance').should('have.text', '$ 100');
    })

    it('shows an error when deposit fails', () => {
        cy.get('input[type=number]#amount')
            .clear()
            .type(0)

        cy.get('button[type=submit]')
            .should('be.visible')
            .should('be.enabled')
            .click()
            .should('be.disabled')

        cy.get('#loader')
            .should('be.visible')

        cy.get('#error')
            .should('not.exist')

        cy.get('#loader')
            .should('not.exist')

        cy.get('#error')
            .should('be.visible')

        cy.get('#balance').should('have.text', '$ 0');
    })

    // TODO: test withdraw
})
