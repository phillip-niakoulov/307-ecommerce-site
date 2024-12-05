describe('login', () => {
    it('invalid username', () => {
        cy.intercept('POST', '/api/users/login').as('getData');
        cy.visit('/login');
        cy.get('[type="submit"]').click();
        cy.wait('@getData')
            .its('response')
            .then((response) => {
                expect(response.statusCode).to.eq(403);

                expect(response.body).to.have.property(
                    'message',
                    'Invalid username'
                );
                cy.get('#error').should('have.text', 'Invalid username');
            });
    });
    it('invalid password', () => {
        cy.intercept('POST', '/api/users/login').as('getData');
        cy.visit('/login');
        cy.get('#user').type('admin');
        cy.get('[type="submit"]').click();
        cy.wait('@getData')
            .its('response')
            .then((response) => {
                expect(response.statusCode).to.eq(403);

                expect(response.body).to.have.property(
                    'message',
                    'Invalid password'
                );
                cy.get('#error').should('have.text', 'Invalid password');
            });
    });
    it('login user', () => {
        cy.intercept('POST', '/api/users/login').as('getData');
        cy.visit('/login');
        cy.get('#user').type('user');
        cy.get('#password').type('user');
        cy.get('[type="submit"]').click();
        cy.wait('@getData')
            .its('response')
            .then((response) => {
                expect(response.statusCode).to.eq(200);
            });
    });
});
