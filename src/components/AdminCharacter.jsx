import { useState, useEffect } from 'react';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

export default function AdminCharacter({ dataEdit, setHalaman, fetchData }) {
  const [nama, setNama] = useState('');
  const [linkGambar, setLinkGambar] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [promptTag, setPromptTag] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataEdit) {
      setNama(dataEdit.nama);
      setLinkGambar(dataEdit.linkGambar);
      setDeskripsi(dataEdit.deskripsi);
      setPromptTag(dataEdit.promptTag);
    } else {
      setNama(''); setLinkGambar(''); setDeskripsi(''); setPromptTag('');
    }
  }, [dataEdit]);

  const handleSimpan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (dataEdit) {
        await updateDoc(doc(db, 'characters', dataEdit.id), { nama, linkGambar, deskripsi, promptTag });
        alert('Data karakter berhasil di-update!');
      } else {
        await addDoc(collection(db, 'characters'), { nama, linkGambar, deskripsi, promptTag });
        alert('Karakter baru berhasil disimpan!');
      }
      fetchData(); 
      setHalaman('Etalase'); 
    } catch (error) {
      console.error(error); alert('Gagal simpan data!');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-md border-t-4 border-purple-500 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {dataEdit ? '✏️ Edit Karakter' : '🎭 Tambah Karakter Baru'}
      </h2>
      
      <form onSubmit={handleSimpan} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Nama Karakter</label>
          <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" />
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Link URL Gambar (Opsi 2)</label>
          <input type="url" value={linkGambar} onChange={(e) => setLinkGambar(e.target.value)} required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" 
            placeholder="https://..." />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Deskripsi/Ciri Khas</label>
          <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} required 
            className="w-full border p-2 rounded h-20 focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">Teks Prompt (Buat di-copy)</label>
          <input type="text" value={promptTag} onChange={(e) => setPromptTag(e.target.value)} required 
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 outline-none bg-gray-50" />
        </div>

        <button type="submit" disabled={loading} 
          className="mt-4 bg-purple-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-purple-600 disabled:bg-gray-400 transition">
          {loading ? 'Menyimpan...' : (dataEdit ? 'Simpan Perubahan' : 'Simpan Karakter')}
        </button>
      </form>
    </div>
  );
}