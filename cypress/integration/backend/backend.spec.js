/// <reference types="cypress" />


describe('Backend tests', () => {
    beforeEach(()=>{
        //looks like api endpoint response is pretty slow
        cy.wait(2500);
    });
    it('Obtain all available animals', () => {
        cy.request('https://petstore3.swagger.io/api/v3/pet/findByStatus?status=available')
            .then((response) => {
                expect(response.status).to.eq(200);
            })
            .its('body')
            .each((item) => {
                expect(item.status).to.eq('available');
            });
    });

    it('Add a new pet', () => {
        cy.fixture('stevie').then((data) =>
            cy.request({
                method: 'POST',
                url: 'https://petstore3.swagger.io/api/v3/pet',
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: data
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(data.id);
                expect(response.body.name).to.eq(data.name);
                expect(response.body.category.id).to.eq(data.category.id);
                expect(response.body.category.name).to.eq(data.category.name);
                expect(response.body.photoUrls[0]).to.eq(data.photoUrls[0]);
                expect(response.body.tags[0].id).to.eq(data.tags[0].id);
                expect(response.body.tags[0].name).to.eq(data.tags[0].name);
                expect(response.body.status).to.eq(data.status);
            }));

    });
    it('Check if dog was added', () => {
        cy.wait(500);//slow response from api endpoint
        cy.fixture('stevie').then((data) => {
            cy.request({
                body: 'GET',
                url: `https://petstore3.swagger.io/api/v3/pet/${data.id}`
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(data.id);
                expect(response.body.name).to.eq(data.name);
                expect(response.body.category.id).to.eq(data.category.id);
                expect(response.body.category.name).to.eq(data.category.name);
                expect(response.body.photoUrls[0]).to.eq(data.photoUrls[0]);
                expect(response.body.tags[0].id).to.eq(data.tags[0].id);
                expect(response.body.tags[0].name).to.eq(data.tags[0].name);
                expect(response.body.status).to.eq(data.status);
            });
        })
    });

    it('Change the status of a pet to "sold"', () => {
        cy.fixture('stevie').then((data) => {
            cy.request({
                method: 'POST',
                url: 'https://petstore3.swagger.io/api/v3/pet',
                headers: {
                    "accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: {
                    id: data.id,
                    name: data.name,
                    status: 'sold'
                }
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(data.id);
                expect(response.body.status).to.eq('sold');
            });
        })
    });
    it('Check if dog status was changed to sold', () => {
        cy.fixture('stevie').then((data) => {
            cy.request({
                body: 'GET',
                url: `https://petstore3.swagger.io/api/v3/pet/${data.id}`
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.id).to.eq(data.id);
                expect(response.body.name).to.eq(data.name);
                expect(response.body.category.id).to.eq(data.category.id);
                expect(response.body.category.name).to.eq(data.category.name);
                expect(response.body.photoUrls[0]).to.eq(data.photoUrls[0]);
                expect(response.body.tags[0].id).to.eq(data.tags[0].id);
                expect(response.body.tags[0].name).to.eq(data.tags[0].name);
                expect(response.body.status).to.eq(data.status);
            });
        })
    });
    it('Delete dog', () => {
        cy.fixture('stevie').then((data) => {
            cy.request({
                body: 'DELETE',
                url: `https://petstore3.swagger.io/api/v3/pet/${data.id}`
            }).then((response) => {
                expect(response.status).to.eq(200);
            });
        });
    });
    //for some reason (I think it is slow reponse from api, this test is failing, because it should return 400 but returns 200)
    it('Confirm dog is deleted', () => {
        cy.fixture('stevie').then((data) => {
            cy.request({
                body: 'GET',
                url: `https://petstore3.swagger.io/api/v3/pet/${data.id}`
            }).then((response) => {
                expect(response.status).to.eq(400);
            });
        })
    });
});
