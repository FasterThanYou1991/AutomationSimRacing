import { findPriceOfProduct } from "../../helpers/helper";
import { getCurrentTimestamp } from "../../helpers/helper";
import { generateHtmlReport } from "../../helpers/helper";

describe('My first test', () => {
    const products = [];

    // Główny test: otwarcie strony, wyszukiwanie produktów i generowanie raportu
    it('Open base url and collect product prices', () => {
        cy.visit('https://www.ceneo.pl/');
        cy.get('.js_cookie-consent-necessary').click();

        cy.fixture('example.json').then((data) => {
            const productNames = data.products;

            productNames.forEach((productName, index) => {
                if (index > 0) {
                    cy.get('#form-head-search-q').clear();
                }
                cy.get('#form-head-search-q').type(`${productName}{enter}`);
                cy.get('.product-offer__product__price .price', { timeout: 2000 }).should('be.visible');
                findPriceOfProduct(products, productName);
            });

            cy.then(() => {
                cy.log('Collected product information:', products);
            });

            cy.then(() => {
                const htmlContent = generateHtmlReport(products, getCurrentTimestamp());
                cy.writeFile('path/to/report.html', htmlContent)
                    .then(() => {
                        cy.exec('start path/to/report.html', { failOnNonZeroExit: false });
                    });
            });
        });
    });
});
