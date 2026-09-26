import { useState, useEffect } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase'; 
import ModalVideo from './components/ModalVideo';
import Admin from './components/Admin';
import AdminCharacter from './components/AdminCharacter';

function App() {
  // STATE NAVIGASI & MODE
  const [isAdmin, setIsAdmin] = useState(false); 
  const [activeTab, setActiveTab] = useState('Video'); 
  const [halaman, setHalaman] = useState('Etalase'); 
  
  // STATE DATA DARI FIREBASE
  const [promptData, setPromptData] = useState([]);
  const [characterData, setCharacterData] = useState([]);
  
  // STATE FILTER, PENCARIAN & EDIT
  const [filter, setFilter] = useState('All');
  const [pencarian, setPencarian] = useState(''); 
  const [dataEdit, setDataEdit] = useState(null); 
  
  // STATE MODAL VIDEO & COPY FEEDBACK
  const [modalOpen, setModalOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);

  // FUNGSI: Tarik data dari Firebase
  const fetchData = async () => {
    setLoading(true);
    try {
      // Tarik data Video
      const videoSnap = await getDocs(collection(db, "prompts"));
      setPromptData(videoSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })));
      
      // Tarik data Karakter
      const charSnap = await getDocs(collection(db, "characters"));
      setCharacterData(charSnap.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })));
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  // Jalanin fetchData pas web pertama kali dibuka
  useEffect(() => { 
    fetchData(); 
  }, []);

  // Ekstrak Kategori unik untuk tombol filter
  const kategoriUnik = ['All', ...new Set(promptData.map(item => item.kategori))];

  // FUNGSI: Hapus data (Video atau Karakter)
  const handleHapus = async (id, koleksi) => {
    if (window.confirm("Yakin mau hapus data ini?")) {
      try {
        await deleteDoc(doc(db, koleksi, id));
        fetchData(); 
      } catch (error) {
        console.error("Error menghapus:", error);
      }
    }
  };

  // FUNGSI: Animasi tombol Copy 2 detik
  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // FUNGSI: Filter Data Pencarian
  const filteredVideo = promptData.filter(d => {
    const cocokKat = filter === 'All' ? true : d.kategori === filter;
    const cocokCari = d.judul.toLowerCase().includes(pencarian.toLowerCase());
    return cocokKat && cocokCari;
  });

  const filteredCharacter = characterData.filter(d => 
    d.nama.toLowerCase().includes(pencarian.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans text-gray-800 pb-24">
      
      {/* ======= HALAMAN FORM ADMIN ======= */}
      {halaman !== 'Etalase' ? (
        <div className="pt-10">
          <button 
            onClick={() => { setHalaman('Etalase'); fetchData(); }} 
            className="ml-10 mb-4 bg-gray-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-700"
          >
            &larr; Batal & Kembali
          </button>
          
          {halaman === 'FormVideo' && (
            <Admin 
              dataEdit={dataEdit} 
              setHalaman={setHalaman} 
              fetchData={fetchData} 
              kategoriList={kategoriUnik.filter(k => k !== 'All')} 
            />
          )}
          
          {halaman === 'FormCharacter' && (
            <AdminCharacter 
              dataEdit={dataEdit} 
              setHalaman={setHalaman} 
              fetchData={fetchData} 
            />
          )}
        </div>
      ) : (

        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {/* ======= HALAMAN UTAMA (ETALASE) ======= */}
          
          {/* HEADER */}
          <div className="text-center mb-8 pt-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              JauhariConten {isAdmin && <span className="text-red-500 text-2xl">(Admin Mode)</span>}
            </h1>
            <p className="text-gray-500 font-medium">Perpustakaan AI Prompt & Referensi Karakter</p>
          </div>

          {/* TAB NAVIGASI: VIDEO VS KARAKTER */}
          <div className="flex justify-center gap-4 mb-8 border-b-2 pb-4">
            <button 
              onClick={() => { setActiveTab('Video'); setPencarian(''); }} 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'Video' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              🎬 Prompt Video
            </button>
            <button 
              onClick={() => { setActiveTab('Character'); setPencarian(''); }} 
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'Character' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
            >
              🎭 Character Sheet
            </button>
          </div>

          {/* AREA PENCARIAN & TAMBAH DATA */}
          <div className="max-w-3xl mx-auto mb-10 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <input 
                type="text" 
                placeholder={activeTab === 'Video' ? "🔍 Cari judul video..." : "🔍 Cari nama karakter..."} 
                value={pencarian} 
                onChange={(e) => setPencarian(e.target.value)} 
                className="flex-grow p-3 rounded-xl border bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500" 
              />
              
              {isAdmin && activeTab === 'Video' && (
                <button onClick={() => { setDataEdit(null); setHalaman('FormVideo'); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 whitespace-nowrap">
                  + Tambah Video
                </button>
              )}
              
              {isAdmin && activeTab === 'Character' && (
                <button onClick={() => { setDataEdit(null); setHalaman('FormCharacter'); }} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 whitespace-nowrap">
                  + Tambah Karakter
                </button>
              )}
            </div>
            
            {/* FILTER KATEGORI (HANYA MUNCUL DI TAB VIDEO) */}
            {activeTab === 'Video' && (
              <div className="flex gap-2 flex-wrap">
                {kategoriUnik.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setFilter(cat)} 
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${filter === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div className="flex justify-center items-center py-20 text-gray-500 font-bold">Memuat data...</div>
          ) : (
            <>
              {/* ======= KONTEN TAB VIDEO ======= */}
              {activeTab === 'Video' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredVideo.map(item => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-200 flex flex-col overflow-hidden group">
                      
{/* KEMBALI KE MODE AWAL: TAMPIL VIDEO LANGSUNG */}
                      <div className="w-full aspect-[9/16] bg-black relative">
                        <iframe 
                          src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(item.fbLink)}&show_text=0`}
                          className="absolute inset-0 w-full h-full pointer-events-auto"
                          style={{ border: 'none', overflow: 'hidden' }} 
                          scrolling="no" 
                          frameBorder="0" 
                          allowFullScreen={true}
                          loading="lazy" 
                        ></iframe>
                      </div>

                      <div className="p-4 flex flex-col flex-grow bg-white z-10 border-t border-gray-100">
                        <div className="mb-4">
                          <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider">
                            {item.kategori}
                          </span>
                          <h2 className="text-lg font-bold text-gray-800 mt-2 line-clamp-2">{item.judul}</h2>
                        </div>
                        
                        <div className="mt-auto">
                          <button 
                            onClick={() => handleCopy(item.id, item.prompt)} 
                            className={`w-full py-2.5 rounded-xl font-bold transition-all duration-300 flex justify-center items-center gap-2 shadow-sm ${copiedId === item.id ? 'bg-gray-800 text-white scale-95' : 'bg-green-500 hover:bg-green-600 text-white active:scale-95'}`}
                          >
                            {copiedId === item.id ? '✔️ Copied!' : '📋 Copy Prompt'}
                          </button>
                        </div>

                        {isAdmin && (
                          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                            <button onClick={() => { setDataEdit(item); setHalaman('FormVideo'); }} className="flex-1 bg-yellow-100 text-yellow-700 py-1.5 rounded-lg text-sm font-bold hover:bg-yellow-200">✏️ Edit</button>
                            <button onClick={() => handleHapus(item.id, 'prompts')} className="flex-1 bg-red-100 text-red-700 py-1.5 rounded-lg text-sm font-bold hover:bg-red-200">🗑️ Hapus</button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ======= KONTEN TAB KARAKTER ======= */}
              {activeTab === 'Character' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredCharacter.map(char => (
                    <div key={char.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col group hover:shadow-lg transition-all">
                      <img src={char.linkGambar} alt={char.nama} className="w-full h-48 object-cover rounded-xl mb-3 bg-gray-100" onError={(e)=>{e.target.src="https://via.placeholder.com/150?text=No+Image"}} />
                      <h3 className="font-extrabold text-gray-800 text-lg leading-tight">{char.nama}</h3>
                      <p className="text-xs text-gray-500 mb-3 mt-1 flex-grow line-clamp-3">{char.deskripsi}</p>
                      
                      <button 
                        onClick={() => handleCopy(char.id, char.promptTag)} 
                        className={`w-full py-2 rounded-lg font-bold text-sm transition-all duration-300 mb-2 ${copiedId === char.id ? 'bg-gray-800 text-white' : 'bg-purple-100 hover:bg-purple-200 text-purple-700'}`}
                      >
                        {copiedId === char.id ? '✔️ Copied!' : '📋 Copy Tag'}
                      </button>
                      
                      {isAdmin && (
                        <div className="flex gap-2 pt-2 border-t border-gray-100">
                          <button onClick={() => { setDataEdit(char); setHalaman('FormCharacter'); }} className="flex-1 bg-yellow-50 text-yellow-600 hover:bg-yellow-100 py-1 rounded text-xs font-bold">Edit</button>
                          <button onClick={() => handleHapus(char.id, 'characters')} className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-1 rounded text-xs font-bold">Hapus</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* FLOATING TOMBOL ADMIN (Pojok Kanan Bawah) */}
      {halaman === 'Etalase' && (
        <button 
          onClick={() => setIsAdmin(!isAdmin)} 
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl transition-all z-50 border-2 flex items-center justify-center ${isAdmin ? 'bg-red-500 text-white border-red-700 hover:bg-red-600 hover:rotate-90' : 'bg-gray-900 text-white border-gray-700 hover:scale-110'}`} 
          title={isAdmin ? "Keluar Admin Mode" : "Masuk Admin Mode"}
        >
          <span className="text-2xl leading-none">{isAdmin ? '✖️' : '⚙️'}</span>
        </button>
      )}

      {/* KOMPONEN MODAL VIDEO POP-UP */}
      <ModalVideo 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        fbUrl={activeVideo} 
      />
    </div>
  );
}

export default App;