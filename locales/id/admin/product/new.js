export default {
  product_information: {
    title: "Informasi Produk",
    product_name: "Nama Produk",
    product_description: "Deskripsi Produk",
    category: "Kategori",
    brand: "Brand",
    no_brand: "Tidak ada brand",
    condition: "Kondisi",
    condition_new: "Baru",
    condition_used: "Bekas",
    placeholder: {
      category: "Ketik dan cari / pilih Kategori",
      brand: "Buat Brand",
      condition: "Kondisi Produk",
    }
  },
  sales_information: {
    title: "Informasi Penjualan",
    no_variant: {
      price: "Harga",
      stock: "Stok",
      barcode: "Barcode",
      discount: "DISKON",
      variant_code: "Kode Variasi",
      sale_price: "Harga Sale",
      sale_text: "Produk ini sedang dalam masa promosi",
      sale_info: "Harga tidak dapat dimodifikasi ketika promosi sedang berlangsung.",
      placeholder: {
        stock: "Jumlah Stok"
      }
    },
    variant: {
      title: "Variasi",
      active_variant: "Aktifkan Variasi",
      name: "Nama",
      option: "Pilihan",
      add_option: "Tambahkan Pilihan",
      variant_information: "Informasi Variasi",
      set_all: "Terapkan ke Semua",
      price: "Harga",
      stock: "Stok",
      code: "Kode",
      barcode: "Barcode",
      add: "Tambah",
      delete_variant_info: "Variasi tidak dapat dihapus jika promosi sudah dijadwalkan atau sedang berjalan.",
      delete_option_info: "Pilihan tidak dapat dihapus jika promosi sudah dijadwalkan atau sedang berjalan.",
      placeholder: {
        price: "Masukkan harga",
        stock: "Masukkan stok",
        variant_name_1: "Masukkan Nama Variasi, contoh: Warna, dll.",
        variant_name_2: "Masukkan Nama Variasi, contoh: Ukuran, dll.",
        variant_option_1: "Masukkan Pilihan Variasi, contoh: Merah, dll.",
        variant_option_2: "Masukkan Pilihan Variasi, contoh: S, M, dll."
      }
    },
    wholesale: {
      title: "Grosir",
      main_price: "Harga Utama",
      min_amount: "Jumlah Min.",
      unit_price: "Harga Satuan",
      add_wholesale_price: "Tambah Harga Grosir",
      active_variant_info: "Semua harga variasi otomatis mengikuti harga utama jika produk memiliki harga grosir.",
      modal_text: "Semua harga variasi otomatis mengikuti harga produk pertama jika produk memiliki harga grosir. Lanjutkan?",
    },
    validation: {
      empty_variant: "Variasi tidak boleh kosong",
      empty_column: "Kolom tidak boleh kosong",
      duplicate: "Pilihan variasi harus berbeda",
      stock: "Stok tidak boleh kurang dari 0",
      price: "Harga harus lebih dari 1",
      name_check: "Pastikan value memiliki 5 - 100 karakter",
      description_check: "Pastikan value ini memiliki setidaknya 20 karakter",
      weight_check: "Value tidak boleh lebih dari 18 karakter",
      invalid_value: "Value tidak valid",
      preorder_check: "Value harus diantara 1 - 500",
      code_barcode_check: "Value tidak boleh lebih dari 50 karakter",
      check_message: "Pastikan kolom sudah terisi semua",
      empty_photos: "Foto produk tidak boleh kosong",
      //wholesale
      init_qty_grosir: "Min Qty untuk grosir harus lebih dari 1",
      next_qty_grosir: "Min Qty harus lebih besar dari sebelumnya",
      price_smaller_message: "Harga satuan harus lebih rendah dari harga utama",
      price_50_smaller_message: "Harga satuan tidak boleh 50% lebih rendah dari harga utama",
      price_smaller_before: "Harga satuan harus lebih rendah dari harga yang sebelumnya"
    }
  },
  media_settings: {
    title: "Pengaturan Media",
    product_photos: "Foto Produk",
    size_guide: "Panduan Ukuran",
    example: "Contoh",
    product_video: "Video Produk",
  },
  shipping: {
    title: "Pengiriman",
    weight: "Berat",
    preorder: "Preorder",
    day: "hari",
    placeholder: {
      weight: "Berat paket",
    }
  },
  yes: "Ya",
  no: "Tidak",
  save: "Simpan",
  cancel: "Batal",
  success_add_response: "Berhasil menambahkan produk baru.",
  success_update_response: "Berhasil memperbarui produk."
}
