import { usePage } from '@inertiajs/react';

export default function useTranslation() {
    // Mengambil props translations yang dikirim dari Middleware
    const { translations } = usePage().props;

    // Fungsi t() menerima key string
    const t = (key) => {
        // Jika key ada di translations, kembalikan nilainya
        // Jika tidak ada, kembalikan key itu sendiri (fallback)
        return translations[key] || key;
    };

    return { t };
}
