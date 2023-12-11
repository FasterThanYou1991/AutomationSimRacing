describe('My first test', () => {
    const products = [];

    // Funkcja do parsowania ceny z formatu tekstowego na liczbowy
    function parsePrice(priceText) {
        if (typeof priceText === 'string') {
            return parseFloat(priceText.replace(/\s/g, '').replace(',', '.'));
        }
        return null; // lub obsłuż błąd w inny sposób
    }

    // Funkcja do dodawania informacji o produkcie do tablicy raportów
    function addProductToReport(productName, price) {
        products.push({ name: productName, price });
    }

    // Funkcja do wyszukiwania najniższej ceny produktu na podstawie jego nazwy
    function findPriceOfProduct(productName) {
        cy.get('.product-top__product-info__name').each(($el) => {
            if ($el.text().includes(productName)) {
                cy.get('.product-offer__product__price .price').then($prices => {
                    const pricesArray = $prices.map((index, price) => parsePrice(price.innerText)).get();
                    if (pricesArray.length > 0) {
                        const lowestPrice = Math.min(...pricesArray);
                        addProductToReport(productName, lowestPrice);
                    }
                });
            }
        });
    }

    // Funkcja do pobierania aktualnego znacznika czasu
    function getCurrentTimestamp() {
        const now = new Date();
        return now.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // format YYYY-MM-DD HH:MM:SS
    }

    // Funkcja do generowania kodu HTML raportu
    function generateHtmlReport(products, timestamp) {
        let htmlContent = `<html><head><title>Product Report</title></head><body>`;
        htmlContent += `<h1>Product Report</h1><p>Report generated on: ${timestamp}</p><ul>`;
        
        products.forEach(product => {
            htmlContent += `<li>${product.name}: <b>${product.price}</b></li>`;
        });

        htmlContent += `</ul></body></html>`;
        return htmlContent;
    }

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
                findPriceOfProduct(productName);
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
