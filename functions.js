const token = localStorage.getItem("access_token");
const totalItems = document.getElementById("totalItems");
const productManagement = document.getElementById("productManagement");
// Function to open modal and fetch product data


// functions.js
document.addEventListener("DOMContentLoaded", function () {
  async function viewProduct(id) {
    const viewModal = new bootstrap.Modal(document.getElementById('viewProductModal'));
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/product/${id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      console.log("Fetched product data:", data); // 🔍 Debugging

      const modalBody = document.getElementById("viewProductModalBody");
      if (!modalBody) {
        console.error("Modal body element not found!");
        alert("Failed to load product details.");
        return;
      }

      modalBody.innerHTML = "";

      const fields = [
        { label: "Product Name", value: data?.product_name },
        { label: "Brand", value: data?.brand },
        { label: "SKU", value: data?.sku },
        { label: "Category", value: data?.category },
        { label: "Buying Price", value: data?.buying_price },
        { label: "Selling Price", value: data?.selling_price },
        { label: "Stock", value: data?.quantity },
        { label: "Low Stock Alert", value: data?.low_stock_alert },
        { label: "Description", value: data?.description },
        { label: "Created By", value: data?.created_by },
        { label: "Created At", value: data?.created_at },
        { label: "Last Modified", value: data?.last_modified }
      ];

      fields.forEach(field => {
        const fieldDiv = document.createElement("div");
        fieldDiv.className = "mb-3";
        fieldDiv.innerHTML = `
          <strong>${field.label}:</strong>
          <p>${field.value || "N/A"}</p>
        `;
        modalBody.appendChild(fieldDiv);
      });

      // Display images
      const imageContainer = document.createElement("div");
      imageContainer.className = "mb-3";

      const frontImage = document.createElement("img");
      frontImage.src = data?.front_image 
        ? `http://127.0.0.1:8000/static/images/${data.front_image}` 
        : "http://127.0.0.1:8000/static/images/default.png";
      frontImage.alt = "Front Image";
      frontImage.style.maxWidth = "50%";
      imageContainer.appendChild(frontImage);

      if (Array.isArray(data?.back_image)) {
        data.back_image.forEach((imgId, index) => {
          const backImage = document.createElement("img");
          backImage.src = `http://127.0.0.1:8000/static/images/${imgId}`;
          backImage.alt = `Back Image ${index + 1}`;
          backImage.style.maxWidth = "50%";
          imageContainer.appendChild(backImage);
        });
      }

      modalBody.appendChild(imageContainer);

      viewModal.show();
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Failed to load product details.");
    }
  }

  // Expose viewProduct globally if needed
  window.viewProduct = viewProduct;
});

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
document.getElementById("editProductForm").addEventListener("submit", async function (e) {
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

function deleteProduct(id){
    const response = fetch(`http://127.0.0.1:8000/api/v1/delete_product/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization":`Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    if(response){
        window.location.reload()
    } else {
        console.log("Product not deleted")
    }
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("createProductForm");
  
  form.addEventListener("submit", async function (e) {
    e.preventDefault();


    const formData = new FormData();

    // Add required fields
    formData.append("product_name", document.getElementById("productName").value);
    formData.append("selling_price", document.getElementById("sellingPrice").value);
    formData.append("buying_price", document.getElementById("buyingPrice").value);
    formData.append("quantity", document.getElementById("quantity").value);
    formData.append("category", document.getElementById("productCategory").value);
    formData.append("brand", document.getElementById("productBrand").value);
    const frontImage = document.getElementById("frontImage").files[0];
    if (frontImage) {
      formData.append("front_image", frontImage);
    }
    const backImages = document.getElementById("backImages").files;
    for (let i = 0; i < backImages.length; i++) {
      formData.append("back_images", backImages[i]);
    }
    formData.append("description", document.getElementById("description").value);
    formData.append("sku", document.getElementById("sku").value);
    formData.append("unit", document.getElementById("unit").value);
    formData.append("low_stock_alert", document.getElementById("lowStockAlert").value);

    // Handle image uploads
    try {
      const response = await fetch("http://127.0.0.1:8000/api/v1/register_product", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();
      if (response.ok) {
        alert("Product registered successfully!");
        window.location.reload()
        form.reset();
      } else {
        alert("Error: " + (result.detail || JSON.stringify(result)));
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  });
});

