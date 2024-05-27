$(document).ready(function() {
    function fetchProducts() {
        $.ajax({
            url: 'api.php',
            type: 'GET',
            success: function(response) {
                let products = response;
                let tableContent = '';
                let chartLabels = [];
                let chartData = [];

                products.forEach(function(product) {
                    tableContent += `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.type}</td>
                            <td>${product.quantity}</td>
                            <td>${product.price}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-product" data-id="${product.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    chartLabels.push(product.name);
                    chartData.push(product.quantity);
                });

                $('#productTable').html(tableContent);
                renderChart(chartLabels, chartData);
            }
        });
    }

    function fetchCustomers() {
        $.ajax({
            url: 'api.php?type=customers',
            type: 'GET',
            success: function(response) {
                let customers = response;
                let options = '';
                customers.forEach(function(customer) {
                    options += <option value="${customer.id}">${customer.name}</option>;
                });
                $('#orderCustomer').html(options);
            }
        });
    }

    function fetchOrders() {
        $.ajax({
            url: 'api.php?type=orders',
            type: 'GET',
            success: function(response) {
                let orders = response;
                let tableContent = '';
                orders.forEach(function(order) {
                    tableContent += `
                        <tr>
                            <td>${order.customer_name}</td>
                            <td>${order.product_name}</td>
                            <td>${order.quantity}</td>
                            <td>${order.order_date}</td>
                            <td>
                                <button class="btn btn-warning btn-sm edit-order" data-id="${order.id}">Edit</button>
                                <button class="btn btn-danger btn-sm delete-order" data-id="${order.id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });

                $('#orderTable').html(tableContent);
            }
        });
    }

    function renderChart(labels, data) {
        var ctx = document.getElementById('inventoryChart').getContext('2d');
        var inventoryChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Quantity',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    $('#productForm').submit(function(event) {
        event.preventDefault();
        let id = $('#productId').val();
        let name = $('#productName').val();
        let type = $('#productType').val();
        let quantity = $('#productQuantity').val();
        let price = $('#productPrice').val();

        let method = id ? 'PUT' : 'POST';
        let url = 'api.php';
        let data = JSON.stringify({
            id: id,
            name: name,
            type: type,
            quantity: quantity,
            price: price
        });

        $.ajax({
            url: url,
            type: method,
            data: data,
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);
                $('#productModal').modal('hide');
                fetchProducts();
            }
        });
    });

    $('#customerForm').submit(function(event) {
        event.preventDefault();
        let id = $('#customerId').val();
        let name = $('#customerName').val();
        let email = $('#customerEmail').val();
        let phone = $('#customerPhone').val();

        let method = id ? 'PUT' : 'POST';
        let url = 'api.php';
        let data = JSON.stringify({
            type: 'customer',
            id: id,
            name: name,
            email: email,
            phone: phone
        });

        $.ajax({
            url: url,
            type: method,
            data: data,
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);
                $('#customerModal').modal('hide');
                fetchCustomers();
            }
        });
    });

    $('#orderForm').submit(function(event) {
        event.preventDefault();
        let id = $('#orderId').val();
        let customer_id = $('#orderCustomer').val();
        let product_id = $('#orderProduct').val();
        let quantity = $('#orderQuantity').val();

        let method = id ? 'PUT' : 'POST';
        let url = 'api.php';
        let data = JSON.stringify({
            type: 'order',
            id: id,
            customer_id: customer_id,
            product_id: product_id,
            quantity: quantity
        });

        $.ajax({
            url: url,
            type: method,
            data: data,
            contentType: 'application/json',
            success: function(response) {
                alert(response.message);
                $('#orderModal').modal('hide');
                fetchOrders();
            }
        });
    });

    $(document).on('click', '.edit-product', function() {
        let id = $(this).data('id');
        $.ajax({
            url: 'api.php?id=' + id,
            type: 'GET',
            success: function(response) {
                let product = response[0];
                $('#productId').val(product.id);
                $('#productName').val(product.name);
                $('#productType').val(product.type);
                $('#productQuantity').val(product.quantity);
                $('#productPrice').val(product.price);
                $('#productModal').modal('show');
            }
        });
    });

    $(document).on('click', '.delete-product', function() {
        if (confirm("Are you sure you want to delete this product?")) {
            let id = $(this).data('id');
            $.ajax({
                url: 'api.php',
                type: 'DELETE',
                data: JSON.stringify({ id: id }),
                contentType: 'application/json',
                success: function(response) {
                    alert(response.message);
                    fetchProducts();
                }
            });
        }
    });

    $(document).on('click', '.edit-customer', function() {
        let id = $(this).data('id');
        $.ajax({
            url: 'api.php?type=customer&id=' + id,
            type: 'GET',
            success: function(response) {
                let customer = response[0];
                $('#customerId').val(customer.id);
                $('#customerName').val(customer.name);
                $('#customerEmail').val(customer.email);
                $('#customerPhone').val(customer.phone);
                $('#customerModal').modal('show');
            }
        });
    });

    $(document).on('click', '.delete-customer', function() {
        if (confirm("Are you sure you want to delete this customer?")) {
            let id = $(this).data('id');
            $.ajax({
                url: 'api.php',
                type: 'DELETE',
                data: JSON.stringify({ id: id, type: 'customer' }),
                contentType: 'application/json',
                success: function(response) {
                    alert(response.message);
                    fetchCustomers();
                }
            });
        }
    });

    $(document).on('click', '.edit-order', function() {
        let id = $(this).data('id');
        $.ajax({
            url: 'api.php?type=order&id=' + id,
            type: 'GET',
            success: function(response) {
                let order = response[0];
                $('#orderId').val(order.id);
                $('#orderCustomer').val(order.customer_id);
                $('#orderProduct').val(order.product_id);
                $('#orderQuantity').val(order.quantity);
                $('#orderModal').modal('show');
            }
        });
    });

    $(document).on('click', '.delete-order', function() {
        if (confirm("Are you sure you want to delete this order?")) {
            let id = $(this).data('id');
            $.ajax({
                url: 'api.php',
                type: 'DELETE',
                data: JSON.stringify({ id: id, type: 'order' }),
                contentType: 'application/json',
                success: function(response) {
                    alert(response.message);
                    fetchOrders();
                }
            });
        }
    });

    fetchProducts();
    fetchCustomers();
    fetchOrders();
});
