describe('register', () => {
    it('register user', () => {
        cy.intercept('POST', '/api/users/register', {
            statusCode: 201,
            body: {
                message: 'User registered successfully',
                user: {
                    id: 1,
                    username: 'testuser',
                },
            },
        }).as('getData');

        cy.visit('/register');
        cy.get('#username').type('testuser');
        cy.get('#email').type('testuser');
        cy.get('#password').type('testuser');
        cy.get('#confirm').type('testuser');
        cy.get('[type="submit"]').click();

        cy.wait('@getData');

        cy.contains('User registered successfully').should('be.visible');
    });
});
