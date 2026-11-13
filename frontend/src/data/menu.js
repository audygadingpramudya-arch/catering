export const menus = [
  {
    id: 1,
    name: 'Nasi Box Ayam Bakar',
    category: 'Nasi Box',
    price: 15000,
    description: 'Nasi box dengan ayam bakar, sayuran dan sambal',
    image: '/images/ayam-bakar.jpg',
    popular: true
  },
  {
    id: 2,
    name: 'Nasi Box Ayam Goreng',
    category: 'Nasi Box',
    price: 14000,
    description: 'Nasi box dengan ayam goreng, sayuran dan sambal',
    image: '/images/nasi-box.jpg',
    popular: true
  },
  {
    id: 3,
    name: 'Nasi Goreng Spesial',
    category: 'Nasi Box',
    price: 14000,
    description: 'Nasi goreng spesial dengan ayam dan sayuran',
    image: '/images/nasi-goreng.jpg',
    popular: true
  },
  {
    id: 4,
    name: 'Paket Prasmanan',
    category: 'Prasmanan',
    price: 25000,
    description: 'Prasmanan lengkap dengan 5 pilihan lauk dan sayuran',
    image: '/images/prasmanan.jpg',
    popular: false
  },
  {
    id: 5,
    name: 'Nasi Tumpeng Syukuran',
    category: 'Acara',
    price: 250000,
    description: 'Nasi tumpeng lengkap untuk acara syukuran dan perayaan',
    image: '/images/tumpeng.jpg',
    popular: false
  }
];

export const categories = ['Semua', 'Nasi Box', 'Prasmanan', 'Acara'];

export function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(angka);
}
