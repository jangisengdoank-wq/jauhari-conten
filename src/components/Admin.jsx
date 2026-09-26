import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Admin({ dataEdit, setHalaman, fetchData, kategoriList }) {
  const [judul, setJudul] = useState('');
  const [kategori, setKategori] = useState('1v1');
  const [prompt, setPrompt] = useState('');
  const [fbLink, setFbLink] = useState('');
  const [thumbnail, setThumbnail] = useState(''); // State baru untuk Cover Video
  const [loading, setLoading] = useState(false);

  // Cek apakah lagi mode Edit (ada data lama yang dilempar)
  useEffect(() => {
    if (dataEdit) {
      setJudul(dataEdit.judul);
      setKategori(dataEdit.kategori);
      setPrompt(dataEdit.prompt);
      setFbLink(dataEdit.fbLink);
      setThumbnail(dataEdit.thumbnail || '');
    } else {
      // Kalau nambah baru, kosongin formnya
      setJudul('');
      setKategori('1v1');
      setPrompt('');
      setFbLink('');
      setThumbnail('');
    }
  }, [dataEdit]);

  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (dataEdit) {
        // MODE EDIT: Update data yang udah ada di Firebase
        const videoRef = doc(db, 'prompts', dataEdit.id);
        await updateDoc(videoRef, {
          judul, 
          kategori, 
          prompt, 
          fbLink,
          thumbnail
        });
        alert('Data video berhasil di-update!');
      } else {
        // MODE TAMBAH: Bikin data baru di Firebase
        await addDoc(collection(db, 'prompts'), {
          judul, 
          kategori, 
          prompt, 
          fbLink,
          thumbnail
        });
        alert('Data video baru berhasil disimpan!');
      }
      
      fetchData(); // Refresh data di latar belakang
      setHalaman('Etalase'); // Otomatis balik ke halaman Etalase
    } catch (error) {
      console.error("Error nambah/update data: ", error);
      alert('Gagal simpan data, cek koneksi!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {dataEdit ? '✏️ Edit Data Video' : '➕ Tambah Video Baru'}
      </h2>
      
      <form onSubmit={handleSimpan} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Judul Video</label>
          <input type="text" value={judul} onChange={(e) => setJudul(e.target.value)} required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
        </div>
        
        {/* KATEGORI DINAMIS */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Kategori Filter (Bisa ketik baru)</label>
          <input 
            type="text" 
            list="kategori-options" 
            value={kategori} 
            onChange={(e) => setKategori(e.target.value)} 
            required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" 
            placeholder="Pilih atau ketik kategori baru..." 
          />
          <datalist id="kategori-options">
            {kategoriList && kategoriList.map((kat, index) => (
              <option key={index} value={kat} />
            ))}
          </datalist>
        </div>

        {/* INPUT BARU UNTUK THUMBNAIL */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Link Gambar Cover / Thumbnail (Opsional)</label>
          <input type="url" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" 
            placeholder="https://link-gambar-cover-lu.jpg" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Teks Prompt</label>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} required 
            className="w-full border p-2 rounded h-24 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Link Video Facebook</label>
          <input type="url" value={fbLink} onChange={(e) => setFbLink(e.target.value)} required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" />
        </div>

        <div className="flex gap-3 mt-4">
          <button type="submit" disabled={loading} 
            className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition">
            {loading ? 'Menyimpan...' : (dataEdit ? 'Simpan Perubahan' : 'Simpan ke Database')}
          </button>
        </div>
      </form>
    </div>
  );
}