<?php
header("Content-Type: application/json");
include 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT * FROM products";
        $result = $conn->query($sql);
        $products = [];
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $products[] = $row;
            }
        }
        echo json_encode($products);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $name = $data['name'];
        $type = $data['type'];
        $quantity = $data['quantity'];
        $price = $data['price'];
        $sql = "INSERT INTO products (name, type, quantity, price) VALUES ('$name', '$type', $quantity, $price)";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Product added successfully"]);
        } else {
            echo json_encode(["message" => "Error adding product: " . $conn->error]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $name = $data['name'];
        $type = $data['type'];
        $quantity = $data['quantity'];
        $price = $data['price'];
        $sql = "UPDATE products SET name='$name', type='$type', quantity=$quantity, price=$price WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Product updated successfully"]);
        } else {
            echo json_encode(["message" => "Error updating product: " . $conn->error]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data['id'];
        $sql = "DELETE FROM products WHERE id=$id";
        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "Product deleted successfully"]);
        } else {
            echo json_encode(["message" => "Error deleting product: " . $conn->error]);
        }
        break;
}
$conn->close();
?>
