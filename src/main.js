// Popup sửa sản phẩm theo product_id, có danh mục + brand và xử lý ảnh
const API_BASE = "https://fshop.nghienshopping.online/api";

function getTokenFromCookie() {
  const match = document.cookie.match(/token=([^;]+)/);
  return match ? match[1] : null;
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${API_BASE}/uploads`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
    body: formData,
  });
  const result = await res.json();
  if (!res.ok || !result.url) throw new Error("Upload thất bại");
  return result.url;
}

// Gắn sự kiện vào các nút sửa có class="edit-btn"
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".edit-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("id");
      if (id) openEditProductPopup(id);
    });
  });
});

function createInput(labelText, name, type = "text", value = "") {
  const label = document.createElement("label");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.name = name;
  input.type = type;
  input.value = value;
  label.appendChild(input);
  return label;
}

function createTextarea(labelText, name, value = "") {
  const label = document.createElement("label");
  label.textContent = labelText;
  const textarea = document.createElement("textarea");
  textarea.name = name;
  textarea.value = value;
  label.appendChild(textarea);
  return label;
}

function createSelect(labelText, name, options, selectedValue) {
  const label = document.createElement("label");
  label.textContent = labelText;
  const select = document.createElement("select");
  select.name = name;
  options.forEach((opt) => {
    const option = document.createElement("option");
    option.value = opt.value;
    option.textContent = opt.label;
    if (opt.value == selectedValue) option.selected = true;
    select.appendChild(option);
  });
  label.appendChild(select);
  return label;
}

function createVariantBlock(variant, index) {
  const wrapper = document.createElement("div");
  wrapper.className = "variant-block";
  wrapper.innerHTML = `<strong>Biến thể ${index + 1}</strong>`;
  wrapper.appendChild(
    createInput(
      "Màu sắc",
      `variant_color_name_${index}`,
      "text",
      variant.color_name
    )
  );
  wrapper.appendChild(
    createInput(
      "Kích thước",
      `variant_size_name_${index}`,
      "text",
      variant.size_name
    )
  );
  wrapper.appendChild(
    createInput("Giá", `variant_price_${index}`, "number", variant.price)
  );
  wrapper.appendChild(
    createInput(
      "Giá gốc",
      `variant_origin_price_${index}`,
      "number",
      variant.origin_price
    )
  );
  wrapper.appendChild(
    createInput(
      "Giảm giá",
      `variant_discount_${index}`,
      "number",
      variant.discount
    )
  );
  wrapper.appendChild(
    createInput("Tồn kho", `variant_stock_${index}`, "number", variant.stock)
  );

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  const imageUrlInput = document.createElement("input");
  imageUrlInput.name = `variant_image_${index}`;
  imageUrlInput.value = variant.variant_image || "";

  imageInput.addEventListener("change", async () => {
    if (imageInput.files[0]) {
      const url = await uploadImage(imageInput.files[0]);
      imageUrlInput.value = url;
    }
  });

  wrapper.appendChild(imageUrlInput);
  wrapper.appendChild(imageInput);
  return wrapper;
}

async function openEditProductPopup(productId) {
  const token = getTokenFromCookie();
  if (!token) return alert("Bạn chưa đăng nhập");

  const [productRes, catRes, brandRes] = await Promise.all([
    fetch(`${API_BASE}/products/${productId}`).then((res) => res.json()),
    fetch(`${API_BASE}/cat`).then((res) => res.json()),
    fetch(`${API_BASE}/brands`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => res.json()),
  ]);

  const product = productRes.data.product;
  const category = productRes.data.category;
  const catOptions = [];
  function extractCats(cats, prefix = "") {
    for (const cat of cats) {
      catOptions.push({ value: cat.category_id, label: prefix + cat.name });
      if (cat.children?.length) extractCats(cat.children, prefix + "--");
    }
  }
  extractCats(catRes.data);
  const brandOptions = brandRes.map((b) => ({
    value: b.brand_id,
    label: b.name,
  }));

  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  const modal = document.createElement("div");
  modal.className = "modal";

  const closeBtn = document.createElement("div");
  closeBtn.className = "close-btn";
  closeBtn.textContent = "✖";
  closeBtn.onclick = () => overlay.remove();

  const form = document.createElement("form");
  form.appendChild(createInput("Tên sản phẩm", "name", "text", product.name));
  form.appendChild(createTextarea("Mô tả", "description", product.description));
  form.appendChild(createInput("Giá", "price", "number", product.price));
  form.appendChild(
    createInput("Giá gốc", "origin_price", "number", product.origin_price)
  );
  form.appendChild(
    createInput("Giảm giá", "discount", "number", product.discount)
  );
  form.appendChild(createInput("Tồn kho", "stock", "number", product.stock));

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  const imageUrlInput = document.createElement("input");
  imageUrlInput.name = "image";
  imageUrlInput.value = product.image;
  imageInput.addEventListener("change", async () => {
    if (imageInput.files[0]) {
      const url = await uploadImage(imageInput.files[0]);
      imageUrlInput.value = url;
    }
  });
  form.appendChild(imageUrlInput);
  form.appendChild(imageInput);

  const imagesTextarea = document.createElement("textarea");
  imagesTextarea.name = "images";
  try {
    imagesTextarea.value = JSON.parse(product.images).join("\n");
  } catch {
    imagesTextarea.value = product.images;
  }
  form.appendChild(
    createTextarea(
      "Ảnh chi tiết (1 URL mỗi dòng)",
      "images",
      imagesTextarea.value
    )
  );

  form.appendChild(
    createSelect("Danh mục", "category_id", catOptions, product.category_id)
  );
  form.appendChild(
    createSelect("Thương hiệu", "brand_id", brandOptions, product.brand)
  );

  const variantContainer = document.createElement("div");
  const variants = product.variants || [];
  variantContainer.innerHTML = `<h3>Biến thể</h3>`;
  variants.forEach((v, i) => {
    variantContainer.appendChild(createVariantBlock(v, i));
  });
  form.appendChild(variantContainer);

  const submit = document.createElement("button");
  submit.textContent = "Lưu thay đổi";
  submit.type = "submit";
  form.appendChild(submit);

  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const updatedProduct = {
      name: fd.get("name"),
      description: fd.get("description"),
      price: parseFloat(fd.get("price")),
      origin_price: parseFloat(fd.get("origin_price")),
      discount: parseFloat(fd.get("discount")),
      stock: parseInt(fd.get("stock")),
      category_id: parseInt(fd.get("category_id")),
      brand_id: parseInt(fd.get("brand_id")),
      image: fd.get("image"),
      images: fd.get("images")?.split("\n").filter(Boolean) || [],
    };

    const res = await fetch(`${API_BASE}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedProduct),
    });
    const result = await res.json();
    if (res.ok) {
      alert("Cập nhật thành công!");
      overlay.remove();
    } else {
      alert("Lỗi: " + (result.error || "Không xác định"));
    }
  };

  modal.appendChild(closeBtn);
  modal.appendChild(form);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}
