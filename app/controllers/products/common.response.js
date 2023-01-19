module.exports = {
  createProductRes: (productData) => {
    return response = {
      "id": productData.id,
      "title": productData.title,
      "description": productData.description,
      "price": productData.price,
      "slug": productData.slug,
      "category_id":productData.category_id
    }
  }

}