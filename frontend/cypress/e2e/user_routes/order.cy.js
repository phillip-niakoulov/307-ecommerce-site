describe('cart', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('#user').type('user');
        cy.get('#password').type('user');
        cy.get('[type="submit"]').click();
        cy.wait(2000);
    });

    it('Add to cart', () => {
        cy.intercept('POST', '/api/users/checkout').as('getData');
        cy.visit('/product/dr-martens-1460-lace-up-boots');
        cy.get('.cart-button').click();

        cy.get('[href="/cart"]').click();

        cy.get('.checkout-button').click();

        cy.wait('@getData')
            .its('response')
            .then((response) => {
                expect(response.statusCode).to.eq(200);
            });

        cy.get('[href="/orders/67529b09a458fce0ffc0a3a5"]').click();

        cy.get('tbody > :last > :nth-child(2)')
            .contains('$169.99')
            .should('be.visible');
        cy.get('tbody > :last > :nth-child(3)')
            .contains('Awaiting Payment')
            .should('be.visible');
        cy.get('tbody > :last > :nth-child(1)').click();
        cy.get('.order-item')
            .contains('Dr. Martens 1460 Lace Up Boots - 1 x $169.99 = $169.99')
            .should('be.visible');
        cy.get('.item-link')
            .invoke('attr', 'href')
            .should('equal', '/product/dr-martens-1460-lace-up-boots');
        cy.get('.order-summary > :nth-child(1)')
            .contains('Total Items: 1')
            .should('be.visible');
        cy.get('.order-summary > :nth-child(2)')
            .contains('Total Price: $169.99')
            .should('be.visible');
    });
});
