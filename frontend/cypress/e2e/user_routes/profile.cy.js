describe('profile', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('#user').type('user');
        cy.get('#password').type('user');
        cy.get('[type="submit"]').click();
        cy.wait(2000);
    });

    it('Add to cart', () => {
        cy.get('[href="/user/67529b09a458fce0ffc0a3a5"]').click();
        cy.get('.profile-view > h1')
            .contains(`user's Profile`)
            .should('be.visible');
        cy.get('h3').contains('Email: user@email.com').should('be.visible');
        cy.get('#logoutButton').click();
        cy.get('[href="/user/67529b09a458fce0ffc0a3a5"]').should('not.exist');
    });
});
