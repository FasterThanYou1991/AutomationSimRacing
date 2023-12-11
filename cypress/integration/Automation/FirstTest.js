describe('My first test', () => {
    const products = [];

    function findPriceOfProduct(productName) {
        // Znajdź produkt i dodaj jego nazwę i cenę do tablicy products
        cy.get('.product-top__product-info__name').each(($el) => {
            if ($el.text().includes(productName)) {
                cy.wrap($el).closest('.product-top').find('.product-top__price-column .price-format .price').then(($price) => {
                    products.push({
                        name: productName,
                        price: $price.text()
                    });
                });
            }
        });
    }
    function getCurrentTimestamp() {
        const now = new Date();
        return now.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // format YYYY-MM-DD HH:MM:SS
    }

    it('Open base url and collect product prices', () => {
        cy.visit('https://www.ceneo.pl/');
        cy.get('.js_cookie-consent-necessary').click();

        cy.fixture('example.json').then((data) => {
            const productNames = data.products;

            // Przenieś cały kod wykorzystujący productNames tutaj
            productNames.forEach((productName, index) => {
                if (index > 0) {
                    cy.get('#form-head-search-q').clear();
                }
                cy.get('#form-head-search-q').type(`${productName}{enter}`);
                cy.wait(2000); // Adjust the wait time as needed
                findPriceOfProduct(productName);
            });

            // Log collected product information
            cy.then(() => {
                cy.log('Collected product information:', products);
            });
            
            cy.then(() => {
                const timestamp = getCurrentTimestamp();
                let htmlContent = `<html><head><title>Product Report</title></head><body><h1>Product Report</h1><ul>`;
                htmlContent += `<p>Report generated on: ${timestamp}</p><ul>`;
            
                products.forEach(product => {
                    htmlContent += `<li>${product.name}: <b>${product.price}</b></li>`;
                });
            
                htmlContent += `</ul></body></html>`;
            
                cy.writeFile('path/to/report.html', htmlContent).then(() => {
                    cy.exec('start path/to/report.html', {failOnNonZeroExit: false}); // dla macOS
                    // lub cy.exec('start path/to/report.html'); // dla Windows
                });
            });
        });
    });
});