describe('admin dashboard', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.get('#user').type('admin');
        cy.get('#password').type('admin');
        cy.get('[type="submit"]').click();
        cy.wait(2000);
    });

    it('user management', () => {
        cy.get('[href="/admin"]').click();
        cy.get('[href="/admin/users"]').click();

        cy.get(':nth-child(1) > :nth-child(1) > .userlist-link')
            .invoke('attr', 'href')
            .should('equal', '/user/67524f00468cf0be2856b4fe');
        cy.get(':nth-child(1) > :nth-child(1) > .userlist-link')
            .contains('67524f00468cf0be2856b4fe')
            .should('be.visible');
        cy.get('tbody > :nth-child(1) > :nth-child(2)')
            .contains('admin')
            .should('be.visible');
        cy.get('tbody > :nth-child(1) > :nth-child(3)')
            .contains('12/5/2024, 5:10:24 PM')
            .should('be.visible');
        cy.get(
            ':nth-child(1) > :nth-child(4) > :nth-child(7) > label > .userlist-checkbox'
        )
            .should('be.checked')
            .should('be.disabled');
    });

    it('user orders', () => {
        cy.get('[href="/admin"]').click();
        cy.get('[href="/admin/orders"]').click();

        cy.get('tbody > :last > :nth-child(2)')
            .contains('67529b09a458fce0ffc0a3a5')
            .should('be.visible');
        cy.get('tbody > :last > :nth-child(2) > .orderlist-link')
            .invoke('attr', 'href')
            .should('equal', '/orders/67529b09a458fce0ffc0a3a5');
        cy.get('tbody > :last > :nth-child(3)')
            .contains('$169.99')
            .should('be.visible');
        cy.get('tbody > :last > :nth-child(4)')
            .contains('Awaiting Payment')
            .should('be.visible');

        cy.get('tbody > :last > :nth-child(1)').click();

        cy.get('.order-item')
            .contains('Dr. Martens 1460 Lace Up Boots - 1 x $169.99 = $169.99')
            .should('be.visible');
        cy.get('.item-link')
            .invoke('attr', 'href')
            .should('equal', '/product/dr-martens-1460-lace-up-boots');
        cy.get('div.order-summary > :nth-child(1)')
            .contains('Total Items: 1')
            .should('be.visible');
        cy.get('div.order-summary > :nth-child(2)')
            .contains('Total Price: $169.99')
            .should('be.visible');
        cy.get('#\\36 752dfba578bf6261b619852status').should('be.visible');
    });
});
