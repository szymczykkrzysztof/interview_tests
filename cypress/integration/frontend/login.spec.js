/// <reference types="cypress" />

describe('Creating account flow', () => {
    let email = `JohnRambo${Math.floor(Math.random()*10000)}@mail.com`;
    let password = 'Password12#';
    it('Create account', () => {
        cy.fixture('johnRambo').then((data) => {
            cy.visit('http://automationpractice.com/index.php')
                .get('.login').click();
            cy.get('#email_create').type(email);
            cy.get("#SubmitCreate").click();
            cy.get('#customer_firstname').type(data.firstName);
            cy.get('#customer_lastname').type(data.lastName);
            cy.get('#passwd').type(password);
            cy.get("#city").type(data.city);
            cy.get("#postcode").type(data.postcode);
            cy.get("#id_country").select(data.country);
            cy.get("#phone_mobile").type(data.mobile);
            cy.get("#alias").clear().type('Rambo addrress');
            cy.get("#address1", { timeout: 50000 }).should('be.enabled').then(() => cy.get("#address1", { timeout: 50000 }).type(data.address1));
            cy.get("#id_state").select('Alaska');
            cy.get("#submitAccount", { timeout: 50000 }).click();
            cy.get('.account > span', { timeout: 50000 }).should('contain', `${data.firstName} ${data.lastName}`);
            cy.get('.logout').click();
        });

    });
    it('Sign in to created account', () => {
        cy.fixture('johnRambo').then((data) => {
            cy.visit('http://automationpractice.com/index.php').get('.login').click();
            cy.get('#email').type(email);
            cy.get('#passwd').type(password);
            cy.get('#SubmitLogin > span').click();
            cy.get('.account > span', { timeout: 50000 }).should('contain', `${data.firstName} ${data.lastName}`);
            cy.get('.logout').click();
        });
    });
});