    const token = localStorage.getItem("access_token");
    const totalItems = document.getElementById("totalItems");
    const productManagement = document.getElementById("productManagement");
    // Function to open modal and fetch product data
   async function openEditModal(id, name) {
    try {
        const token = localStorage.getItem("access_token");
        const response = await fetch(`http://127.0.0.1:8000/api/v1/product/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch product data");
        }

        const productData = await response.json();

        document.getElementById("edit-product-id").value = productData.id;
        document.getElementById("edit-product-name").value = productData.product_name;
        document.getElementById("edit-category").value = productData.category;
        document.getElementById("edit-sku").value = productData.sku;
        document.getElementById("edit-buying-price").value = productData.buying_price;
        document.getElementById("edit-selling-price").value = productData.selling_price;
        document.getElementById("edit-stock").value = productData.quantity;
        // document.getElementById("edit-brand").value = productData.brand;
        // document.getElementById("edit-description").value = productData.description;
        // document.getElementById("edit-unit").value = productData.unit;
        // document.getElementById("edit-low-stock-alert").value = productData.low_stock_alert;
        // document.getElementById("edit-front-image").value = productData.front_image;
        // document.getElementById("edit-back-image").value = productData.back_image.join(', '); // Convert array to string

        const editModal = new bootstrap.Modal(document.getElementById('editProductModal'));
        editModal.show();
    } catch (error) {
        console.log("Error loading product data: " + error.message);
    }
}

    // Handle form submission
    document.getElementById("editProductForm").addEventListener("submit", async function(e) {
        e.preventDefault();
        // const uuid = crypto.randomUUID();
        const product_id = document.getElementById("edit-product-id").value
        console.log(product_id)
        const updatedData = {
        product_name: document.getElementById("edit-product-name").value,
        selling_price: parseFloat(document.getElementById("edit-selling-price").value),
        buying_price: parseFloat(document.getElementById("edit-buying-price").value),
        quantity: parseInt(document.getElementById("edit-stock").value),
        category: document.getElementById("edit-category").value,
        sku: document.getElementById("edit-sku").value
        // brand: document.getElementById("edit-brand").value,
        // description: document.getElementById("edit-description").value,
        // unit: document.getElementById("edit-unit").value,
        // low_stock_alert: document.getElementById("edit-low-stock-alert").value,
        // front_image: document.getElementById("edit-front-image").value,
        // back_image: document.getElementById("edit-back-image").value.split(',').map(url => url.trim())
    };

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/v1/edit_product/${product_id}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            alert("Product updated successfully!");
            window.location.reload(); // Refresh the dashboard to show updated data
        } catch (error) {
            alert("Error updating product: " + error.message);
        } finally {
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
        }
    });

    if (!token) {
        window.location.href = 'index.html';
    }

    function logout() {
        if (confirm("Are you sure you want to logout?")) {
            localStorage.clear();
            window.location.href = "index.html";
        }
    }
