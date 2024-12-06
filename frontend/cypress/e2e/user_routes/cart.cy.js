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

        cy.get('.item-name')
            .contains('Dr. Martens 1460 Lace Up Boots')
            .should('be.visible');
        cy.get('.item-price').contains('$169.99').should('be.visible');
        cy.get('.item-image')
            .invoke('attr', 'src')
            .should(
                'equal',
                'https://csc307images.blob.core.windows.net/images/dr-martens-1460-lace-up-boots-1733463331294.png'
            );
        cy.get('.checkout-button')
            .contains('Checkout ($169.99)')
            .should('be.visible');

        cy.get('.checkout-button').click();

        cy.wait('@getData')
            .its('response')
            .then((response) => {
                expect(response.statusCode).to.eq(200);
            });

        cy.get('.order-results-title')
            .contains('Thanks for your purchase!')
            .should('be.visible');
        cy.get('strong').should('be.visible');
    });
});
