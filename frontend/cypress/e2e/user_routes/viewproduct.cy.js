describe('View Product', () => {
    it('views product', () => {
        cy.visit('/product/dr-martens-1460-lace-up-boots');

        cy.get('h2')
            .contains('Dr. Martens 1460 Lace Up Boots')
            .should('be.visible');

        cy.get('.price').contains('$169.99').should('be.visible');
        cy.get('.description')
            .contains(
                `The 1460 is the original Dr. Martens boot. The boot's recognizable DNA looks like this: 8 eyes, grooved sides, a heel-loop, yellow stitching, and a comfortable, air-cushioned sole— and now, it comes in a soft, supple leather with gunmetal eyelets.`
            )
            .should('be.visible');
        cy.get('.main-image > img')
            .invoke('attr', 'src')
            .should(
                'equal',
                'https://csc307images.blob.core.windows.net/images/dr-martens-1460-lace-up-boots-1733463331294.png'
            );
    });
});
