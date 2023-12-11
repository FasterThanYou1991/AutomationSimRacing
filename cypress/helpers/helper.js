// Funkcja do parsowania ceny z formatu tekstowego na liczbowy
export function parsePrice(priceText) {
    if (typeof priceText === 'string') {
        return parseFloat(priceText.replace(/\s/g, '').replace(',', '.'));
    }
    return null; // lub obsłuż błąd w inny sposób
}

export function addProductToReport(products, productName, price) {
    products.push({ name: productName, price });
}
    // Funkcja do wyszukiwania najniższej ceny produktu na podstawie jego nazwy
    export function findPriceOfProduct(products, productName) {
        cy.get('.product-top__product-info__name').each(($el) => {
            if ($el.text().includes(productName)) {
                cy.get('.product-offer__product__price .price').then($prices => {
                    const pricesArray = $prices.map((index, price) => parsePrice(price.innerText)).get();
                    if (pricesArray.length > 0) {
                        const lowestPrice = Math.min(...pricesArray);
                        addProductToReport(products, productName, lowestPrice);
                    }
                });
            }
        });
    }
    // Funkcja do pobierania aktualnego znacznika czasu
    export function getCurrentTimestamp() {
        const now = new Date();
        return now.toISOString().replace(/T/, ' ').replace(/\..+/, ''); // format YYYY-MM-DD HH:MM:SS
    }
    
    // Funkcja do generowania kodu HTML raportu
    export function generateHtmlReport(products, timestamp) {
        let htmlContent = `<html><head><title>Product Report</title></head><body>`;
        htmlContent += `<h1>Product Report</h1><p>Report generated on: ${timestamp}</p><ul>`;
        
        products.forEach(product => {
            htmlContent += `<li>${product.name}: <b>${product.price}</b></li>`;
        });

        htmlContent += `</ul></body></html>`;
        return htmlContent;
    }