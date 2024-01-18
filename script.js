window.onload = function() {
    document.getElementById('import-button').addEventListener('click', importData);
    document.getElementById('add-field').addEventListener('click', () => modifyFields('add'));
    document.getElementById('remove-field').addEventListener('click', () => modifyFields('remove'));
};

function importData() {
    const file = document.getElementById('file-input').files[0];
    if (!file) 
       return alert('Please select a file to import.');

    const reader = new FileReader();
    reader.onload = event => displayProducts(JSON.parse(event.target.result));
    reader.readAsText(file);
}

function modifyFields(action) {
    const source = action === 'add' ? 'available-fields' : 'fields-to-display';
    const target = action === 'add' ? 'fields-to-display' : 'available-fields';
    const options = Array.from(document.getElementById(source).selectedOptions);
    options.forEach(option => document.getElementById(target).appendChild(option));
}

function displayProducts(data) {
    const selectedFields = Array.from(document.getElementById('fields-to-display').options)
        .map(opt => opt.value.replace(/\s+/g, '').toLowerCase());

    const tableHead = document.getElementById('product-table').querySelector('thead');
    const tableBody = document.getElementById('product-table').querySelector('tbody');
    tableHead.innerHTML = '<tr>' + selectedFields.map(field => `<th>${capitalize(field)}</th>`).join('') + '</tr';

    const products = Object.entries(data.products)
        .map(([id, details]) => ({ ...details, productId: id }))
        .sort((a, b) => b.popularity - a.popularity);

    tableBody.innerHTML = products.map(product => '<tr>' + selectedFields.map(field =>
        `<td>${field === 'productid' ? product.productId : product[field] || ''}</td>`
    ).join('') + '</tr>').join('');
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}