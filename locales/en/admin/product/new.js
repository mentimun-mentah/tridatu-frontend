export default {
  product_information: {
    title: "Basic Information",
    product_name: "Product Name",
    product_description: "Product Description",
    category: "Category",
    brand: "Brand",
    no_brand: "No Brand",
    condition: "Condition",
    condition_new: "New",
    condition_used: "Used",
    placeholder: {
      category: "Type and search / select Category",
      brand: "For Brand",
      condition: "Product Condition",
    }
  },
  sales_information: {
    title: "Sales Information",
    no_variant: {
      price: "Price",
      stock: "Stock",
      barcode: "Barcode",
      discount: "OFF",
      variant_code: "Variant Code",
      sale_price: "Discounted Price",
      sale_text: "This product is entitled in discount event",
      sale_info: "Price cannot be edited when product is on promotion.",
      placeholder: {
        stock: "Amount of Stock"
      }
    },
    variant: {
      title: "Variation",
      active_variant: "Enable Variation",
      name: "Name",
      option: "Options",
      add_option: "Add Options",
      variant_information: "Variation Information",
      set_all: "Apply to All",
      price: "Price",
      stock: "Stock",
      code: "Code",
      barcode: "Barcode",
      add: "Add",
      delete_variant_info: "Variation cannot be deleted when product has an ongoing or upcoming promotion.",
      delete_option_info: "Option cannot be deleted when product has an ongoing on upcoming promotion.",
      placeholder: {
        price: "Enter price",
        stock: "Enter stock",
        variant_name_1: "Enter Variation Name, eg: colour, etc.",
        variant_name_2: "Enter Variation Name, eg: size, etc.",
        variant_option_1: "Enter Variation Options, eg: Red, etc.",
        variant_option_2: "Enter Variation Options, eg: S,M etc."
      }
    },
    wholesale: {
      title: "Wholesale",
      main_price: "Main Price",
      min_amount: "Min. Amount",
      unit_price: "Unit Price",
      add_wholesale_price: "Add Price Tier",
      active_variant_info: "All price variations automatically follow the main price if the product is at a wholesale price.",
      modal_text: "All price variations automatically follow the price of the first product if the product has a wholesale price. Continue?",
    },
    validation: {
      empty_variant: "Variation can't be empty",
      empty_column: "Columns can't be empty",
      duplicate: "The option of variations must be different",
      stock: "Stock can't be less than 0",
      price: "The price must be more than 1",
      name_check: "Ensure this value has 5 - 100 characters",
      description_check: "Ensure this value has at least 20 characters",
      weight_check: "Value can't be more than 18 characters",
      invalid_value: "Invalid Value",
      preorder_check: "Ensure value must be between 1 - 500",
      code_barcode_check: "Value can't be more than 50 characters",
      check_message: "Ensure all columns are filled",
      empty_photos: "Product photos can't be empty",
      //wholesale
      init_qty_grosir: "Min Qty for wholesale must be more than 1",
      next_qty_grosir: "Min Qty must be bigger than before",
      price_smaller_message: "The unit price must be lower than the main price",
      price_50_smaller_message: "The unit price must not be 50% lower than the main price",
      price_smaller_before: "The unit price must be lower than the previous price"
    }
  },
  media_settings: {
    title: "Media Management",
    product_photos: "Product Photos",
    size_guide: "Size Guide",
    example: "Example",
    product_video: "Product Video",
  },
  shipping: {
    title: "Shipping",
    weight: "Weight",
    preorder: "Preorder",
    day: "days",
    placeholder: {
      weight: "Package Weight",
    }
  },
  yes: "Yes",
  no: "No",
  save: "Save",
  cancel: "Cancel",
  success_add_response: "Successfully add a new product.",
  success_update_response: "Successfully update the product."
}
