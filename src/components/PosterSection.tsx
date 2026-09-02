import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Image as ImageIcon,
  Download,
  Upload,
  Eye,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Share2,
  Sparkles,
  X,
  Layers,
  ArrowDownToLine,
  Search,
  Lock,
  Unlock,
  KeyRound,
  Edit3,
  Save,
  RotateCcw,
  ShieldCheck,
  LogOut,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  MoveHorizontal,
  AlignLeft,
  ListPlus,
} from 'lucide-react';
import { PosterItem } from '../types';

// Template for structured, neat description
export const SAMPLE_POSTER_DESCRIPTION_TEMPLATE = `Materi promosi resmi resolusi tinggi untuk paket ibadah bersama PT Arminareka Perdana.

Fasilitas & Keunggulan Utama:
• Hotel Bintang 5 Ring 1 Depan Pelataran Masjidil Haram & Nabawi
• Tiket Penerbangan Langsung (Direct Flight) Garuda Indonesia / Saudia Airlines
• Sajian Katering Masakan Khas Nusantara 3x Sehari
• Bimbingan Manasik Intensif & Muthawif Bersertifikasi Kemenag RI
• Perlengkapan Eksklusif & Asuransi Perjalanan Lengkap

Informasi Pendaftaran & Konsultasi:
Hubungi Hj. Triana Indrian SE via WhatsApp untuk ketersediaan seat dan jadwal keberangkatan resmi.`;

// Default 2 Dummy Posters with structured paragraphs and points
const DEFAULT_DUMMY_POSTERS: PosterItem[] = [
  {
    id: 'poster-dummy-1',
    title: 'Poster Brosur Resmi Umroh VIP Ramadhan 1446 H',
    category: 'Umroh',
    format: 'JPG',
    fileSize: '3.4 MB',
    uploadDate: 'Maret 2025',
    description: `Materi promosi resmi resolusi tinggi (300 DPI) Paket Umroh VIP Ramadhan bersama Hj. Triana Indrian SE.

Fasilitas & Keunggulan Utama:
• Hotel Bintang 5 Ring 1 (Depan Pelataran Masjidil Haram & Nabawi)
• Penerbangan Langsung (Direct Flight) Garuda Indonesia / Saudia Airlines
• Sajian Katering Masakan Khas Nusantara 3x Sehari
• Bimbingan Manasik Intensif & Muthawif Bersertifikasi Kemenag RI
• Perlengkapan Eksklusif: Koper Fiber, Kain Ihram/Mukena, & Bahan Seragam

Siap cetak untuk brosur fisik maupun disebarkan secara digital melalui WhatsApp dan media sosial.`,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1200&auto=format&fit=crop',
    downloadUrl:
      'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
    fileName: 'Poster_Umroh_VIP_Ramadhan_Arminareka.jpg',
    isDummy: true,
  },
  {
    id: 'poster-dummy-2',
    title: 'Katalog & E-Brosur Haji Khusus Furoda VIP 2025/2026',
    category: 'Haji',
    format: 'PDF',
    fileSize: '4.8 MB',
    uploadDate: 'Musim Haji 1446 H',
    description: `E-Brosur resmi format dokumen PDF panduan komprehensif Haji Furoda Langsung Berangkat tanpa masa tunggu antrean kuota reguler.

Informasi & Layanan Utama:
• Legalitas Resmi PIHK PT Arminareka Perdana Terakreditasi "A" Kemenag RI
• Maktab Haji VIP Fasilitas Tenda Ber-AC Nyaman di Arafah & Mina
• Akomodasi Hotel Bintang 5 Bintang Lima di Makkah & Madinah
• Pembimbing Ibadah Berpengalaman & Tim Medis Standby 24 Jam
• Simulasi Manasik & Pendampingan Tahapan Rukun Haji Lengkap

Unduh dokumen lengkap untuk mempelajari rincian paket, syarat pendaftaran, dan jadwal keberangkatan.`,
    thumbnailUrl:
      'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop',
    downloadUrl: '',
    fileName: 'Katalog_Haji_Khusus_Furoda_Arminareka.pdf',
    isDummy: true,
  },
];

interface SectionTextConfig {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
}

const DEFAULT_SECTION_TEXTS: SectionTextConfig = {
  badge: 'Materi Promosi & Brosur Resmi',
  titlePrefix: 'Arminareka',
  titleHighlight: 'Poster & Brosur',
  subtitle:
    'Silakan membaca atau mengunduh brosur serta poster yang tersedia. Apabila Anda memerlukan bantuan atau informasi lebih lanjut, silakan hubungi kami.',
};

/**
 * Helper function to render neatly structured sentences, paragraphs, subheaders, and bullet points.
 */
export function renderStructuredParagraphs(rawText: string) {
  if (!rawText) return null;

  const lines = rawText.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentBullets: string[] = [];
  let bulletKey = 0;

  const flushBullets = () => {
    if (currentBullets.length > 0) {
      const bulletsToRender = [...currentBullets];
      elements.push(
        <ul key={`bullets-${bulletKey++}`} className="space-y-1.5 my-2 pl-0.5">
          {bulletsToRender.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-white/90 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0 shadow-sm" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      );
      currentBullets = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushBullets();
      return;
    }

    // Check if line is a bullet point: starts with •, -, *, ✓, or digit with dot
    const bulletMatch = trimmed.match(/^([•\-\*✓]|\d+\.)\s*(.*)$/);
    if (bulletMatch) {
      currentBullets.push(bulletMatch[2]);
      return;
    }

    // Section header (e.g. ends with ':' like "Fasilitas & Keunggulan:")
    if (trimmed.endsWith(':') && trimmed.length < 60) {
      flushBullets();
      elements.push(
        <h5
          key={`header-${idx}`}
          className="font-bold text-amber-300 text-xs sm:text-sm mt-3 mb-1.5 flex items-center gap-1.5 tracking-wide"
        >
          <Sparkles size={13} className="text-amber-400 shrink-0" />
          <span>{trimmed}</span>
        </h5>
      );
      return;
    }

    // Regular line / paragraph
    flushBullets();
    elements.push(
      <p
        key={`p-${idx}`}
        className="text-xs sm:text-sm text-white/80 leading-relaxed mb-2 last:mb-0"
      >
        {trimmed}
      </p>
    );
  });

  flushBullets();
  return elements;
}

export default function PosterSection() {
  // Admin Authorization State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('arminareka_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [adminPinError, setAdminPinError] = useState('');
  const [showSectionTextEditModal, setShowSectionTextEditModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Section Texts State
  const [sectionTexts, setSectionTexts] = useState<SectionTextConfig>(() => {
    try {
      const saved = localStorage.getItem('arminareka_poster_section_texts');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved section texts', e);
    }
    return DEFAULT_SECTION_TEXTS;
  });

  // Section text edit form
  const [tempSectionTexts, setTempSectionTexts] = useState<SectionTextConfig>(sectionTexts);

  // Posters list state
  const [posters, setPosters] = useState<PosterItem[]>(() => {
    try {
      const saved = localStorage.getItem('arminareka_all_posters');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Auto upgrade dummy poster descriptions if they were previously saved without line breaks
          return parsed.map((item: PosterItem) => {
            if (item.id === 'poster-dummy-1' && !item.description.includes('\n')) {
              return { ...item, description: DEFAULT_DUMMY_POSTERS[0].description };
            }
            if (item.id === 'poster-dummy-2' && !item.description.includes('\n')) {
              return { ...item, description: DEFAULT_DUMMY_POSTERS[1].description };
            }
            return item;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to load saved posters from localStorage', e);
    }
    return DEFAULT_DUMMY_POSTERS;
  });

  const [activeTab, setActiveTab] = useState<'all' | 'JPG' | 'PDF' | 'my-uploads'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoster, setSelectedPoster] = useState<PosterItem | null>(null);
  const [fullscreenPoster, setFullscreenPoster] = useState<PosterItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const [editingPoster, setEditingPoster] = useState<PosterItem | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadNotice, setUploadNotice] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form states for adding poster details (Admin only)
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customCategory, setCustomCategory] = useState<'Umroh' | 'Haji' | 'Wisata Halal' | 'Panduan'>('Umroh');

  // Delete poster confirmation state
  const [posterToDelete, setPosterToDelete] = useState<PosterItem | null>(null);
  const [deletePinInput, setDeletePinInput] = useState('');
  const [deletePinError, setDeletePinError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Horizontal Slider States (Flexible Left-Right Scrolling)
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Mouse Drag-to-Scroll states for flexible swipe on desktop
  const [isMouseDragging, setIsMouseDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);
  const [hasMovedDrag, setHasMovedDrag] = useState(false);

  // Check scroll position for slider navigation and dots
  const checkScrollability = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 15);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

    const children = sliderRef.current.children;
    if (children.length > 0) {
      const firstChild = children[0] as HTMLElement;
      const cardWidth = firstChild ? firstChild.offsetWidth + 20 : 380;
      const index = Math.round(scrollLeft / cardWidth);
      setActiveCardIndex(Math.max(0, Math.min(index, posters.length - 1)));
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    checkScrollability();
    slider.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      slider.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [posters]);

  // Smooth scroll left/right
  const handleScroll = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = container.clientWidth > 768 ? 440 : container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  // Scroll directly to target card index
  const handleScrollToIndex = (index: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const children = container.children;
    if (children[index]) {
      const targetElement = children[index] as HTMLElement;
      container.scrollTo({
        left: targetElement.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  // Mouse Drag Event Handlers for flexible sliding on desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsMouseDragging(true);
    setHasMovedDrag(false);
    setDragStartX(e.pageX - sliderRef.current.offsetLeft);
    setDragStartScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDragging || !sliderRef.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.4;
    if (Math.abs(walk) > 8) {
      setHasMovedDrag(true);
    }
    sliderRef.current.scrollLeft = dragStartScrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDragging(false);
    setTimeout(() => setHasMovedDrag(false), 80);
  };

  // Keyboard shortcut listener for Fullscreen (Esc to close, etc.) and Slider Left/Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (fullscreenPoster) {
          setFullscreenPoster(null);
          setZoomLevel(1);
          setRotation(0);
        } else if (selectedPoster) {
          setSelectedPoster(null);
        } else if (posterToDelete) {
          setPosterToDelete(null);
        }
      } else if (!fullscreenPoster && !selectedPoster && !editingPoster && !posterToDelete && !showAdminLoginModal) {
        if (e.key === 'ArrowLeft') {
          handleScroll('left');
        } else if (e.key === 'ArrowRight') {
          handleScroll('right');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenPoster, selectedPoster, editingPoster, posterToDelete, showAdminLoginModal]);

  const toggleCardExpanded = (id: string) => {
    setExpandedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to persist posters to localStorage
  const savePostersToStorage = (updatedList: PosterItem[]) => {
    try {
      localStorage.setItem('arminareka_all_posters', JSON.stringify(updatedList));
    } catch (e) {
      console.warn('Failed to save posters to localStorage', e);
    }
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = adminPinInput.trim();
    // Accepted Admin PINs (default: admin09 or arminareka)
    if (
      cleanPin === 'admin09' ||
      cleanPin === 'arminareka' ||
      cleanPin === '123456' ||
      cleanPin === 'triana'
    ) {
      setIsAdmin(true);
      sessionStorage.setItem('arminareka_admin_auth', 'true');
      setShowAdminLoginModal(false);
      setAdminPinInput('');
      setAdminPinError('');
      setUploadNotice('Mode Admin aktif: Anda memiliki hak akses penuh untuk mengunggah dan mengedit.');
      setTimeout(() => setUploadNotice(null), 5000);
    } else {
      setAdminPinError('PIN Admin salah. Silakan periksa kembali (Default: admin09)');
    }
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('arminareka_admin_auth');
    setUploadNotice('Anda telah keluar dari Mode Admin.');
    setTimeout(() => setUploadNotice(null), 4000);
  };

  // Handle Save Section Texts
  const handleSaveSectionTexts = (e: React.FormEvent) => {
    e.preventDefault();
    setSectionTexts(tempSectionTexts);
    try {
      localStorage.setItem('arminareka_poster_section_texts', JSON.stringify(tempSectionTexts));
    } catch (err) {
      console.warn('Failed to save section texts', err);
    }
    setShowSectionTextEditModal(false);
    setUploadNotice('Teks section Arminareka Poster & Brosur berhasil diperbarui!');
    setTimeout(() => setUploadNotice(null), 4000);
  };

  // Generate a valid PDF Blob for documents
  const generateValidPdfBlob = (title: string, desc: string): Blob => {
    const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj
4 0 obj << /Length 280 >> stream
BT
/F1 20 Tf
50 720 Td
(PT ARMINAREKA PERDANA - KANCAB 09 TANGERANG) Tj
/F1 14 Tf
0 -35 Td
(${title.replace(/[()]/g, '')}) Tj
/F1 11 Tf
0 -28 Td
(Konsultan Resmi: Hj. Triana Indrian SE | Kemenag RI Terakreditasi A) Tj
0 -22 Td
(Ibadah Nyaman - Hotel Bintang 5 Ring 1 - Penerbangan Direct Garuda / Saudia) Tj
0 -25 Td
(Hubungi WhatsApp: 0813-1050-8974) Tj
ET
endstream endobj
5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000226 00000 n 
0000000557 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
630
%%EOF`;
    return new Blob([pdfContent], { type: 'application/pdf' });
  };

  // Trigger File Download (Admin Export - E in CRUDE)
  const handleDownload = async (poster: PosterItem) => {
    if (!isAdmin) {
      setUploadNotice('Akses unduh berkas master resolusi tinggi hanya diperuntukkan bagi Admin. Pengunjung dapat melihat brosur melalui pratinjau.');
      setTimeout(() => setUploadNotice(null), 4000);
      return;
    }
    try {
      if (poster.format === 'PDF') {
        let pdfBlob: Blob;
        if (poster.downloadUrl && poster.downloadUrl.startsWith('data:application/pdf')) {
          const res = await fetch(poster.downloadUrl);
          pdfBlob = await res.blob();
        } else {
          pdfBlob = generateValidPdfBlob(poster.title, poster.description);
        }

        const blobUrl = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = poster.fileName.endsWith('.pdf') ? poster.fileName : `${poster.fileName}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      } else {
        if (poster.downloadUrl && (poster.downloadUrl.startsWith('data:') || poster.downloadUrl.startsWith('blob:'))) {
          const link = document.createElement('a');
          link.href = poster.downloadUrl;
          link.download = poster.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const response = await fetch(poster.downloadUrl || poster.thumbnailUrl);
          const blob = await response.blob();
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = poster.fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        }
      }

      setUploadNotice(`Berhasil mengunduh "${poster.fileName}"`);
      setTimeout(() => setUploadNotice(null), 4000);
    } catch (err) {
      console.error('Download error:', err);
      if (poster.downloadUrl) {
        window.open(poster.downloadUrl, '_blank');
      }
    }
  };

  // Process File Selection / Drop (Admin Only)
  const handleFileProcess = (file: File) => {
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      setUploadNotice('Mohon unggah berkas dengan format JPG, PNG, atau PDF.');
      setTimeout(() => setUploadNotice(null), 4000);
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadNotice('Ukuran berkas maksimal 25 MB.');
      setTimeout(() => setUploadNotice(null), 4000);
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      const format: 'JPG' | 'PDF' = isPdf ? 'PDF' : 'JPG';

      const newPoster: PosterItem = {
        id: `poster-item-${Date.now()}`,
        title: customTitle.trim() || cleanName,
        category: customCategory,
        format: format,
        fileSize: sizeInMB,
        uploadDate: 'Baru saja diunggah',
        description:
          customDescription.trim() ||
          `Materi poster / brosur resmi "${file.name}" yang diunggah oleh pengelola Arminareka untuk keperluan syiar dan informasi jamaah.`,
        thumbnailUrl: isPdf
          ? 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=1200&auto=format&fit=crop'
          : result,
        downloadUrl: result,
        fileName: file.name,
        isDummy: false,
      };

      const updated = [newPoster, ...posters];
      setPosters(updated);
      savePostersToStorage(updated);
      setIsUploading(false);
      setCustomTitle('');
      setCustomDescription('');
      setShowUploadModal(false);
      setUploadNotice(`Poster "${file.name}" berhasil diunggah dan siap diunduh!`);
      setTimeout(() => setUploadNotice(null), 5000);
    };

    reader.onerror = () => {
      alert('Gagal memproses berkas. Silakan coba kembali.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (!isAdmin) {
      setShowAdminLoginModal(true);
      return;
    }
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Open Delete Confirmation Modal (Admin Delete - D in CRUDE)
  const confirmDeletePoster = (poster: PosterItem, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (!isAdmin) {
      setAdminPinError('Hanya Admin yang berhak menghapus materi poster.');
      setShowAdminLoginModal(true);
      return;
    }
    setPosterToDelete(poster);
    setDeletePinInput('');
    setDeletePinError('');
  };

  // Execute Deletion
  const executeDeletePoster = () => {
    if (!posterToDelete) return;

    // Verify PIN if not already authenticated as Admin
    if (!isAdmin) {
      const cleanPin = deletePinInput.trim();
      if (
        cleanPin === 'admin09' ||
        cleanPin === 'arminareka' ||
        cleanPin === '123456' ||
        cleanPin === 'triana'
      ) {
        setIsAdmin(true);
        sessionStorage.setItem('arminareka_admin_auth', 'true');
      } else {
        setDeletePinError('PIN Admin salah. Masukkan "admin09" untuk mengonfirmasi.');
        return;
      }
    }

    const updated = posters.filter((p) => p.id !== posterToDelete.id);
    setPosters(updated);
    savePostersToStorage(updated);

    if (selectedPoster?.id === posterToDelete.id) {
      setSelectedPoster(null);
    }
    if (fullscreenPoster?.id === posterToDelete.id) {
      setFullscreenPoster(null);
    }
    if (editingPoster?.id === posterToDelete.id) {
      setEditingPoster(null);
    }

    const title = posterToDelete.title;
    setPosterToDelete(null);
    setUploadNotice(`Poster "${title}" berhasil dihapus.`);
    setTimeout(() => setUploadNotice(null), 3500);
  };

  // Restore Default Posters (if user deleted all)
  const handleRestoreDefaultPosters = () => {
    setPosters(DEFAULT_DUMMY_POSTERS);
    savePostersToStorage(DEFAULT_DUMMY_POSTERS);
    setUploadNotice('Poster resmi bawaan berhasil dipulihkan.');
    setTimeout(() => setUploadNotice(null), 3500);
  };

  // Save poster edits (Admin Only)
  const handleSavePosterEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPoster) return;
    const updated = posters.map((p) => (p.id === editingPoster.id ? editingPoster : p));
    setPosters(updated);
    savePostersToStorage(updated);
    setEditingPoster(null);
    setUploadNotice(`Perubahan pada "${editingPoster.title}" berhasil disimpan.`);
    setTimeout(() => setUploadNotice(null), 4000);
  };

  // Filter Posters
  const filteredPosters = posters.filter((poster) => {
    if (activeTab === 'JPG' && poster.format !== 'JPG') return false;
    if (activeTab === 'PDF' && poster.format !== 'PDF') return false;
    if (activeTab === 'my-uploads' && poster.isDummy) return false;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        poster.title.toLowerCase().includes(query) ||
        poster.description.toLowerCase().includes(query) ||
        poster.category.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <section
      id="poster-resmi"
      className="w-full py-16 md:py-24 border-t border-white/10 relative"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Bar Notification / Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold shadow-sm">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Mode Admin • Hak Akses CRUDE (Create, Read, Update, Delete, Export)</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-medium">
                <Eye size={14} className="text-amber-400" />
                <span>Mode Pengunjung: Hanya Lihat Poster &amp; Brosur Resmi</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {isAdmin ? (
              <>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  title="Unggah Poster Baru (Create)"
                >
                  <Upload size={13} />
                  <span>+ Unggah Poster (C)</span>
                </button>
                <button
                  onClick={() => {
                    setTempSectionTexts(sectionTexts);
                    setShowSectionTextEditModal(true);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Edit Teks Judul &amp; Deskripsi Section (Update)"
                >
                  <Edit3 size={13} />
                  <span>Edit Teks Section (U)</span>
                </button>
                <button
                  onClick={handleRestoreDefaultPosters}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Pulihkan Poster Bawaan"
                >
                  <RotateCcw size={12} />
                  <span>Reset Bawaan</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Keluar dari Mode Admin"
                >
                  <LogOut size={13} />
                  <span>Keluar Admin</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setAdminPinError('');
                  setShowAdminLoginModal(true);
                }}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-amber-300 border border-white/10 hover:border-amber-400/40 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
                title="Masuk sebagai pengelola untuk hak akses CRUDE (Unggah, Edit, Hapus, Unduh Master)"
              >
                <Lock size={12} />
                <span>Masuk Admin (CRUDE)</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Layers size={14} />
            <span>{sectionTexts.badge}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-light text-white tracking-tight leading-tight mb-4"
          >
            {sectionTexts.titlePrefix}{' '}
            <span className="font-['Cormorant_Garamond'] font-bold italic text-amber-300">
              {sectionTexts.titleHighlight}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-white/75 leading-relaxed"
          >
            {sectionTexts.subtitle}
          </motion.p>
        </div>

        {/* Upload Feedback Toast */}
        <AnimatePresence>
          {uploadNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2 justify-center shadow-lg"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>{uploadNotice}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Helper for rendering poster card contents cleanly in both Slider and Grid modes */}
        {(() => null)()}

        {/* Filter Controls, Search, and View Mode Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          {/* Format Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-2xl liquid-glass border border-white/10 overflow-x-auto max-w-full no-scrollbar">
            {[
              { id: 'all', label: 'Semua Poster' },
              { id: 'JPG', label: 'Format JPG' },
              { id: 'PDF', label: 'Dokumen PDF' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-60 sm:flex-initial">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari judul poster..."
                className="w-full bg-black/40 border border-white/15 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Slider Controls & Hint */}
        {filteredPosters.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-medium shadow-sm">
                <MoveHorizontal size={14} className="animate-pulse" />
                <span>Geser Kanan &amp; Kiri (Bisa Di-swipe / Diseret)</span>
              </span>
              <span className="hidden sm:inline-block text-xs text-white/40">
                Menampilkan {Math.min(activeCardIndex + 1, filteredPosters.length)} dari {filteredPosters.length} materi
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                title="Geser ke Kiri (Sebelumnya)"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-semibold text-white/70 px-2 min-w-[60px] text-center font-mono">
                {Math.min(activeCardIndex + 1, filteredPosters.length)} / {filteredPosters.length}
              </span>
              <button
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
                title="Geser ke Kanan (Selanjutnya)"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Poster Horizontal Slider Track */}
        <div className="relative">
          <div
            ref={sliderRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-5 sm:gap-6 pb-6 pt-2 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar touch-pan-x ${
              isMouseDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {filteredPosters.map((poster, idx) => {
              const isPdf = poster.format === 'PDF';
              return (
                <motion.div
                  key={poster.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="w-[85vw] sm:w-[380px] md:w-[420px] shrink-0 snap-start liquid-glass rounded-3xl overflow-hidden border border-white/15 hover:border-amber-400/50 transition-all flex flex-col justify-between group shadow-xl hover:shadow-2xl hover:shadow-amber-500/10"
                >
                  <div>
                    {/* Visual Header / Thumbnail (Clickable for Fullscreen) */}
                    <div
                      onClick={() => {
                        if (hasMovedDrag) return;
                        setFullscreenPoster(poster);
                        setZoomLevel(1);
                        setRotation(0);
                      }}
                      className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-950 cursor-pointer group/thumb select-none"
                      title="Klik untuk membuka poster layar penuh tanpa terpotong"
                    >
                      <img
                        src={poster.thumbnailUrl}
                        alt={poster.title}
                        draggable={false}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

                      {/* Hover hint for uncropped full screen */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="px-3.5 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-xl">
                          <Maximize2 size={13} />
                          <span>Buka Layar Penuh</span>
                        </span>
                      </div>

                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 pointer-events-none">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                            isPdf
                              ? 'bg-rose-600 text-white'
                              : 'bg-amber-500 text-slate-950'
                          }`}
                        >
                          {isPdf ? <FileText size={13} /> : <ImageIcon size={13} />}
                          <span>{poster.format}</span>
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white/90 text-[11px] font-medium">
                          {poster.category}
                        </span>
                      </div>

                      {/* Actions: Edit & Delete (Admin Only) */}
                      {isAdmin && (
                        <div
                          className="absolute top-4 right-4 flex items-center gap-2 z-10"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingPoster({ ...poster });
                            }}
                            className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105"
                            title="Edit Poster (Admin - Update)"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={(e) => confirmDeletePoster(poster, e)}
                            className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg border border-rose-400/40 hover:scale-105 active:scale-95"
                            title="Hapus Poster (Admin - Delete)"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}

                      {/* Bottom overlay info on image */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-white/80 pointer-events-none">
                        <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                          Ukuran: {poster.fileSize}
                        </span>
                        <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                          {poster.uploadDate}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2.5 line-clamp-2">
                        {poster.title}
                      </h3>

                      {/* Description with tidy paragraphs & flexible expanding */}
                      <div className="mb-4">
                        {expandedCardIds[poster.id] ? (
                          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-left my-2 space-y-1">
                            {renderStructuredParagraphs(poster.description)}
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm text-white/70 leading-relaxed line-clamp-2">
                            {poster.description.split('\n')[0] || poster.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCardExpanded(poster.id);
                            }}
                            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>
                              {expandedCardIds[poster.id]
                                ? 'Ringkas Keterangan'
                                : 'Lihat Rincian & Poin Lengkap'}
                            </span>
                            {expandedCardIds[poster.id] ? (
                              <ChevronUp size={13} />
                            ) : (
                              <ChevronDown size={13} />
                            )}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFullscreenPoster(poster);
                              setZoomLevel(1);
                              setRotation(0);
                            }}
                            className="text-[11px] text-white/60 hover:text-amber-300 flex items-center gap-1 transition-colors cursor-pointer px-2 py-0.5 rounded-lg hover:bg-white/10"
                            title="Buka Layar Penuh Tanpa Terpotong"
                          >
                            <Maximize2 size={12} />
                            <span>Layar Penuh</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-amber-300/80 mb-2 font-mono">
                        <FileCheck size={14} className="text-emerald-400" />
                        <span className="truncate">{poster.fileName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Buttons: Admin CRUDE vs Visitor View Only */}
                  <div className="p-6 pt-0">
                    {isAdmin ? (
                      /* Admin Actions (CRUDE: Read, Update, Delete, Export) */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPoster(poster)}
                          className="flex-1 py-2.5 px-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                          title="Lihat Pratinjau (Read)"
                        >
                          <Eye size={14} />
                          <span>Pratinjau</span>
                        </button>

                        <button
                          onClick={() => {
                            setFullscreenPoster(poster);
                            setZoomLevel(1);
                            setRotation(0);
                          }}
                          className="p-2.5 rounded-xl bg-white/10 hover:bg-amber-400/20 text-white/80 hover:text-amber-300 transition-colors cursor-pointer border border-white/15 shrink-0"
                          title="Layar Penuh (Read)"
                        >
                          <Maximize2 size={14} />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPoster({ ...poster });
                          }}
                          className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 transition-colors cursor-pointer border border-amber-400/30 shrink-0"
                          title="Edit Poster (Update)"
                        >
                          <Edit3 size={14} />
                        </button>

                        <button
                          onClick={(e) => confirmDeletePoster(poster, e)}
                          className="p-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer border border-rose-500/30 shrink-0"
                          title="Hapus Poster (Delete)"
                        >
                          <Trash2 size={14} />
                        </button>

                        <button
                          onClick={() => handleDownload(poster)}
                          className="flex-1 py-2.5 px-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer truncate"
                          title="Unduh Berkas Master (Export)"
                        >
                          <ArrowDownToLine size={14} className="shrink-0" />
                          <span className="truncate">Unduh ({poster.format})</span>
                        </button>
                      </div>
                    ) : (
                      /* Pengunjung Actions (Hanya Lihat Saja) */
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedPoster(poster)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-400/40 shadow-sm"
                        >
                          <Eye size={14} />
                          <span>Pratinjau Brosur</span>
                        </button>

                        <button
                          onClick={() => {
                            setFullscreenPoster(poster);
                            setZoomLevel(1);
                            setRotation(0);
                          }}
                          className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/15"
                          title="Lihat Layar Penuh Tanpa Terpotong"
                        >
                          <Maximize2 size={14} />
                          <span className="hidden xs:inline">Layar Penuh</span>
                        </button>

                        <a
                          href={`https://wa.me/6281310508974?text=Assalamualaikum%20Mba%20Indri,%20saya%20tertarik%20mengenai%20brosur%20${encodeURIComponent(
                            poster.title
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-emerald-100 transition-colors cursor-pointer border border-emerald-500/30 shrink-0 flex items-center gap-1.5"
                          title="Tanya Brosur Ini ke WhatsApp Resmi"
                        >
                          <Share2 size={14} />
                        </a>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom Dots Indicator */}
          {filteredPosters.length > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2 pb-4 overflow-x-auto max-w-full">
              {filteredPosters.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => handleScrollToIndex(idx)}
                  className={`h-2 transition-all rounded-full cursor-pointer ${
                    activeCardIndex === idx
                      ? 'w-7 bg-amber-400 shadow-sm shadow-amber-400/50'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  title={`Lompat ke: ${p.title}`}
                  aria-label={`Poster ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {filteredPosters.length === 0 && (
          <div className="text-center py-16 liquid-glass rounded-3xl border border-white/10 my-6 max-w-xl mx-auto px-6">
            <AlertCircle size={40} className="mx-auto text-amber-400/80 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">
              {posters.length === 0 ? 'Belum Ada Poster Tersedia' : 'Tidak ada poster ditemukan'}
            </h4>
            <p className="text-xs text-white/60 mb-5 leading-relaxed">
              {posters.length === 0
                ? 'Semua materi poster telah dihapus. Anda dapat memulihkan contoh poster resmi bawaan atau mengunggah materi baru.'
                : 'Silakan periksa kata kunci pencarian atau kategori filter Anda.'}
            </p>

            {posters.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {isAdmin ? (
                  <>
                    <button
                      onClick={handleRestoreDefaultPosters}
                      className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <RotateCcw size={14} />
                      <span>Pulihkan Poster Bawaan</span>
                    </button>
                    <button
                      onClick={() => setShowUploadModal(true)}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
                    >
                      <Upload size={14} />
                      <span>+ Unggah Poster Baru (C)</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setAdminPinError('');
                      setShowAdminLoginModal(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer border border-white/15"
                  >
                    <Lock size={14} />
                    <span>Masuk Admin untuk Mengelola Poster</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Admin Login Modal */}
      <AnimatePresence>
        {showAdminLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md liquid-glass bg-slate-950/95 border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <button
                onClick={() => setShowAdminLoginModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Verifikasi Akses Admin</h3>
                <p className="text-xs text-white/60">
                  Masukkan PIN Pengelola untuk membuka izin unggah dan ubah konten poster.
                </p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    PIN / Kata Sandi Admin:
                  </label>
                  <input
                    type="password"
                    autoFocus
                    value={adminPinInput}
                    onChange={(e) => {
                      setAdminPinInput(e.target.value);
                      setAdminPinError('');
                    }}
                    placeholder="Masukkan PIN Admin..."
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400 text-center tracking-widest font-mono"
                  />
                  {adminPinError && (
                    <p className="text-rose-400 text-xs mt-2 text-center">{adminPinError}</p>
                  )}
                  <p className="text-[11px] text-white/40 mt-2 text-center">
                    Petunjuk: PIN default adalah <span className="text-amber-300 font-mono font-bold">admin09</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminLoginModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
                  >
                    Masuk Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Section Text Edit Modal */}
      <AnimatePresence>
        {showSectionTextEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg liquid-glass bg-slate-950/95 border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <button
                onClick={() => setShowSectionTextEditModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-4 border-b border-white/10 pb-3">
                <Edit3 size={18} />
                <span>Edit Teks Section Poster &amp; Brosur</span>
              </div>

              <form onSubmit={handleSaveSectionTexts} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Label Badge Atas:
                  </label>
                  <input
                    type="text"
                    value={tempSectionTexts.badge}
                    onChange={(e) =>
                      setTempSectionTexts({ ...tempSectionTexts, badge: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Judul Bagian 1:
                    </label>
                    <input
                      type="text"
                      value={tempSectionTexts.titlePrefix}
                      onChange={(e) =>
                        setTempSectionTexts({ ...tempSectionTexts, titlePrefix: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Judul Emas (Italic):
                    </label>
                    <input
                      type="text"
                      value={tempSectionTexts.titleHighlight}
                      onChange={(e) =>
                        setTempSectionTexts({ ...tempSectionTexts, titleHighlight: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Teks Paragraf Deskripsi:
                  </label>
                  <textarea
                    rows={3}
                    value={tempSectionTexts.subtitle}
                    onChange={(e) =>
                      setTempSectionTexts({ ...tempSectionTexts, subtitle: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTempSectionTexts(DEFAULT_SECTION_TEXTS)}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/70 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw size={13} />
                    <span>Reset Default</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSectionTextEditModal(false)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5"
                    >
                      <Save size={13} />
                      <span>Simpan Teks</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Edit Poster Modal */}
      <AnimatePresence>
        {editingPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg liquid-glass bg-slate-950/95 border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <button
                onClick={() => setEditingPoster(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 text-amber-300 font-bold text-base mb-4 border-b border-white/10 pb-3">
                <Edit3 size={18} />
                <span>Edit Informasi Poster (Admin)</span>
              </div>

              <form onSubmit={handleSavePosterEdit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1">
                    Judul Poster:
                  </label>
                  <input
                    type="text"
                    value={editingPoster.title}
                    onChange={(e) =>
                      setEditingPoster({ ...editingPoster, title: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Kategori:
                    </label>
                    <select
                      value={editingPoster.category}
                      onChange={(e) =>
                        setEditingPoster({
                          ...editingPoster,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Umroh">Umroh</option>
                      <option value="Haji">Haji</option>
                      <option value="Wisata Halal">Wisata Halal</option>
                      <option value="Panduan">Panduan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-white/80 mb-1">
                      Nama Berkas Unduhan:
                    </label>
                    <input
                      type="text"
                      value={editingPoster.fileName}
                      onChange={(e) =>
                        setEditingPoster({ ...editingPoster, fileName: e.target.value })
                      }
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                      <AlignLeft size={13} className="text-amber-400" />
                      <span>Deskripsi Keterangan Poster (Tersusun Rapi):</span>
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPoster({
                            ...editingPoster,
                            description: editingPoster.description
                              ? `${editingPoster.description}\n• `
                              : '• ',
                          })
                        }
                        className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-white/80 hover:text-amber-300 border border-white/15 transition-all cursor-pointer"
                        title="Tambah poin bertitik"
                      >
                        + Poin (•)
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPoster({
                            ...editingPoster,
                            description: editingPoster.description
                              ? `${editingPoster.description}\n\n`
                              : '',
                          })
                        }
                        className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-white/80 hover:text-amber-300 border border-white/15 transition-all cursor-pointer"
                        title="Buat paragraf baru"
                      >
                        + Paragraf Baru
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPoster({
                            ...editingPoster,
                            description: SAMPLE_POSTER_DESCRIPTION_TEMPLATE,
                          })
                        }
                        className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 font-medium transition-all cursor-pointer"
                        title="Gunakan contoh format rapi"
                      >
                        Format Rapi
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    value={editingPoster.description}
                    onChange={(e) =>
                      setEditingPoster({ ...editingPoster, description: e.target.value })
                    }
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                    placeholder="Tulis kalimat dan paragraf secara rapi..."
                  />

                  {/* Real-time Live Preview of Formatted Description */}
                  <div className="mt-3 p-3.5 rounded-xl bg-black/40 border border-white/10">
                    <div className="text-[11px] font-semibold text-amber-300/80 mb-2 flex items-center gap-1.5 border-b border-white/5 pb-1.5">
                      <Eye size={12} className="text-amber-400" />
                      <span>Pratinjau Kerapian Paragraf (Real-Time):</span>
                    </div>
                    <div className="max-h-36 overflow-y-auto pr-1">
                      {renderStructuredParagraphs(editingPoster.description || 'Belum ada deskripsi.')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => confirmDeletePoster(editingPoster)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Hapus poster ini secara permanen"
                  >
                    <Trash2 size={13} />
                    <span>Hapus Poster</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPoster(null)}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save size={13} />
                      <span>Simpan Perubahan</span>
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Full Preview Modal (Public) */}
      <AnimatePresence>
        {selectedPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl liquid-glass bg-slate-950/95 border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-black/40">
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                      selectedPoster.format === 'PDF'
                        ? 'bg-rose-600 text-white'
                        : 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {selectedPoster.format}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-white truncate max-w-xs sm:max-w-md">
                    {selectedPoster.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      setFullscreenPoster(selectedPoster);
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title="Buka tampilan layar penuh tanpa terpotong"
                  >
                    <Maximize2 size={13} />
                    <span className="hidden sm:inline">Layar Penuh</span>
                  </button>

                  <button
                    onClick={() => setSelectedPoster(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Modal Preview Body */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
                {/* Visual Preview Box (Clickable to open Fullscreen) */}
                <div
                  onClick={() => {
                    setFullscreenPoster(selectedPoster);
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className="w-full max-h-[52vh] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center relative mb-4 cursor-pointer group/previmg"
                  title="Klik untuk melihat layar penuh tanpa terpotong"
                >
                  <img
                    src={selectedPoster.thumbnailUrl}
                    alt={selectedPoster.title}
                    className="max-h-[52vh] w-auto object-contain transition-transform duration-300 group-hover/previmg:scale-[1.01]"
                  />

                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover/previmg:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/60 text-amber-300 text-xs font-bold flex items-center gap-2 shadow-2xl">
                      <Maximize2 size={14} />
                      <span>Klik untuk Layar Penuh (Tanpa Terpotong)</span>
                    </span>
                  </div>

                  {selectedPoster.format === 'PDF' && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 text-white pointer-events-none">
                      <FileText size={48} className="text-rose-500 mb-3" />
                      <p className="text-sm font-bold mb-1">Dokumen Resmi E-Brosur PDF</p>
                      <p className="text-xs text-white/70 max-w-sm">
                        Dokumen siap cetak dan dibagikan secara digital. Klik tombol unduh di bawah untuk
                        menyimpan berkas PDF lengkap ke perangkat Anda.
                      </p>
                    </div>
                  )}
                </div>

                <div className="w-full space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/10">
                    <div>
                      <span className="text-white/40">Nama Berkas:</span>{' '}
                      <span className="text-white font-mono">{selectedPoster.fileName}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Ukuran:</span>{' '}
                      <span className="text-amber-300 font-semibold">{selectedPoster.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-white/40">Kategori:</span>{' '}
                      <span className="text-white">{selectedPoster.category}</span>
                    </div>
                  </div>

                  {/* Formatted Paragraphs & Sentences */}
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-left">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center justify-between pb-2 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <AlignLeft size={14} className="text-amber-400" />
                        <span>Deskripsi &amp; Rincian Keterangan Poster</span>
                      </div>
                      <button
                        onClick={() => {
                          setFullscreenPoster(selectedPoster);
                          setZoomLevel(1);
                          setRotation(0);
                        }}
                        className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Maximize2 size={11} />
                        <span>Mode Layar Penuh</span>
                      </button>
                    </div>

                    <div className="space-y-1">
                      {renderStructuredParagraphs(selectedPoster.description)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/6281310508974?text=Assalamualaikum%20Mba%20Indri,%20saya%20tertarik%20mengenai%20${encodeURIComponent(
                      selectedPoster.title
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>Konsultasi Poster via WA</span>
                  </a>

                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        onClick={() => {
                          const posterToEdit = selectedPoster;
                          setSelectedPoster(null);
                          setEditingPoster({ ...posterToEdit });
                        }}
                        className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Edit poster ini (Admin - Update)"
                      >
                        <Edit3 size={14} />
                        <span>Edit (U)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => confirmDeletePoster(selectedPoster)}
                        className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Hapus poster ini (Admin - Delete)"
                      >
                        <Trash2 size={14} />
                        <span>Hapus (D)</span>
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedPoster(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Tutup
                  </button>
                  {isAdmin ? (
                    <button
                      onClick={() => handleDownload(selectedPoster)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
                      title="Unduh Berkas Master (Admin - Export)"
                    >
                      <Download size={14} />
                      <span>Unduh {selectedPoster.format} ({selectedPoster.fileSize})</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-white/50 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                      Mode Pengunjung (Hanya Lihat)
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DEDICATED FULL SCREEN MODAL (Tanpa Terpotong) */}
      <AnimatePresence>
        {fullscreenPoster && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/98 backdrop-blur-xl text-white select-none">
            {/* Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between bg-black/70 shrink-0 z-10">
              <div className="flex items-center gap-3 min-w-0 pr-3">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                    fullscreenPoster.format === 'PDF'
                      ? 'bg-rose-600 text-white'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                >
                  {fullscreenPoster.format}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-medium text-white/80 shrink-0 hidden sm:inline-block">
                  {fullscreenPoster.category}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-white truncate">
                  {fullscreenPoster.title}
                </h3>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Zoom & Rotation Controls */}
                <div className="flex items-center bg-white/10 rounded-xl p-1 border border-white/15">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.75, Number((z - 0.25).toFixed(2))))}
                    className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Perkecil (-)"
                  >
                    <ZoomOut size={15} />
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className="px-2 py-1 text-xs font-mono font-semibold text-amber-300 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
                    title="Reset ke Ukuran Pas Layar (100%)"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))))}
                    className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer"
                    title="Perbesar (+)"
                  >
                    <ZoomIn size={15} />
                  </button>
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 hover:bg-white/15 rounded-lg text-white/80 hover:text-white transition-colors cursor-pointer border-l border-white/10 ml-0.5 pl-1.5"
                    title="Putar 90 Derajat"
                  >
                    <RotateCcw size={15} />
                  </button>
                </div>

                <button
                  onClick={() => {
                    setFullscreenPoster(null);
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-white/80 hover:text-rose-300 border border-white/15 transition-colors cursor-pointer"
                  title="Tutup Layar Penuh (Esc)"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Poster Stage Viewport (100% visible, uncropped object-contain) */}
            <div className="flex-1 w-full h-full relative overflow-auto flex items-center justify-center p-3 sm:p-6">
              <div
                className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transformOrigin: 'center center',
                }}
              >
                <img
                  src={fullscreenPoster.downloadUrl || fullscreenPoster.thumbnailUrl}
                  alt={fullscreenPoster.title}
                  className="max-h-[82vh] sm:max-h-[86vh] max-w-[95vw] w-auto h-auto object-contain rounded-2xl shadow-2xl border border-white/20 select-none"
                />
              </div>

              {/* Reset to fit indicator if zoomed */}
              {zoomLevel !== 1 && (
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20">
                  <button
                    onClick={() => {
                      setZoomLevel(1);
                      setRotation(0);
                    }}
                    className="px-4 py-2 rounded-full bg-slate-900/90 text-amber-300 text-xs font-semibold border border-amber-400/40 shadow-xl backdrop-blur-md flex items-center gap-1.5 cursor-pointer hover:bg-slate-800"
                  >
                    <RotateCcw size={13} />
                    <span>Kembalikan Pas Layar (100%)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Bar */}
            <div className="px-4 sm:px-6 py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 bg-black/75 shrink-0 z-10">
              <div className="text-xs text-white/70 flex items-center gap-3">
                <span>
                  Berkas: <strong className="text-white font-mono">{fullscreenPoster.fileName}</strong>
                </span>
                <span className="hidden sm:inline-block">•</span>
                <span className="hidden sm:inline-block">
                  Ukuran: <strong className="text-amber-300">{fullscreenPoster.fileSize}</strong>
                </span>
                <span className="hidden md:inline-block">•</span>
                <span className="hidden md:inline-block text-emerald-400">
                  ✓ Mode Layar Penuh Utuh Tanpa Terpotong
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                {isAdmin && (
                  <button
                    onClick={() => confirmDeletePoster(fullscreenPoster)}
                    className="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 text-rose-300 hover:text-rose-100 border border-rose-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Hapus Poster Ini (Admin - Delete)"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Hapus Poster (D)</span>
                  </button>
                )}

                <a
                  href={`https://wa.me/6281310508974?text=Assalamualaikum%20Mba%20Indri,%20saya%20tertarik%20dengan%20${encodeURIComponent(
                    fullscreenPoster.title
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                >
                  <Share2 size={14} />
                  <span>Konsultasi WA</span>
                </a>

                {isAdmin && (
                  <button
                    onClick={() => handleDownload(fullscreenPoster)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    title="Unduh Berkas Master (Admin - Export)"
                  >
                    <Download size={14} />
                    <span>Unduh {fullscreenPoster.format} (E)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setFullscreenPoster(null);
                    setZoomLevel(1);
                    setRotation(0);
                  }}
                  className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom In-App Delete Confirmation Modal (Active & Accessible) */}
      <AnimatePresence>
        {posterToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md liquid-glass bg-slate-950/95 border border-rose-500/40 rounded-3xl overflow-hidden shadow-2xl p-6"
            >
              <button
                onClick={() => setPosterToDelete(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="text-center mb-5">
                <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-rose-500/10">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Hapus Poster &amp; Brosur?</h3>
                <p className="text-xs text-white/60">
                  Poster ini akan dihapus dari daftar materi resmi Arminareka. Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>

              {/* Selected poster preview item */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-5 flex items-center gap-3">
                <img
                  src={posterToDelete.thumbnailUrl}
                  alt={posterToDelete.title}
                  className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0 bg-black/40"
                />
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white/90">
                      {posterToDelete.format}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-semibold">
                      {posterToDelete.category}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{posterToDelete.title}</h4>
                  <p className="text-[11px] text-white/50 font-mono truncate">{posterToDelete.fileName}</p>
                </div>
              </div>

              {/* If not logged in as Admin, show PIN verification */}
              {!isAdmin ? (
                <div className="space-y-3 mb-5 text-left">
                  <label className="block text-xs font-semibold text-white/80">
                    Otorisasi Pengelola (Masukkan PIN Admin):
                  </label>
                  <input
                    type="password"
                    autoFocus
                    value={deletePinInput}
                    onChange={(e) => {
                      setDeletePinInput(e.target.value);
                      setDeletePinError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        executeDeletePoster();
                      }
                    }}
                    placeholder="Masukkan PIN Admin..."
                    className="w-full bg-black/60 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:border-rose-400 text-center tracking-widest font-mono"
                  />
                  {deletePinError ? (
                    <p className="text-rose-400 text-xs text-center">{deletePinError}</p>
                  ) : (
                    <p className="text-[11px] text-white/40 text-center">
                      Petunjuk: PIN default adalah <span className="text-amber-300 font-mono font-bold">admin09</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300/90 text-center mb-5">
                  <span className="font-semibold">Mode Admin Aktif:</span> Anda memiliki izin penuh untuk menghapus berkas ini.
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPosterToDelete(null)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={executeDeletePoster}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  <Trash2 size={14} />
                  <span>{!isAdmin ? 'Verifikasi & Hapus' : 'Ya, Hapus Sekarang'}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Poster Modal (Admin Only - Opens only when Admin clicks "Unggah Poster") */}
      <AnimatePresence>
        {isAdmin && showUploadModal && (
          <div className="fixed inset-0 z-[115] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl liquid-glass bg-slate-950/95 border border-amber-400/40 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowUploadModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2.5 text-amber-300 font-bold text-base sm:text-lg border-b border-white/10 pb-4 mb-5">
                <Upload size={20} />
                <span>Unggah Poster / E-Brosur Baru</span>
              </div>

              {/* Poster Details Form Prior to Upload */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Judul Poster / Brosur:
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Contoh: Brosur Umroh Awal Musim Syawal 1446 H"
                    className="w-full bg-black/50 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/80 mb-1.5">
                    Kategori Paket:
                  </label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value as any)}
                    className="w-full bg-slate-900 border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Umroh">Umroh</option>
                    <option value="Haji">Haji</option>
                    <option value="Wisata Halal">Wisata Halal</option>
                    <option value="Panduan">Panduan Ibadah</option>
                  </select>
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center justify-between mb-1.5 flex-wrap gap-2">
                    <label className="text-xs font-semibold text-white/80 flex items-center gap-1.5">
                      <AlignLeft size={13} className="text-amber-400" />
                      <span>Deskripsi Keterangan Poster (Tersusun Rapi):</span>
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => setCustomDescription((prev) => (prev ? `${prev}\n• ` : '• '))}
                        className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-white/80 hover:text-amber-300 border border-white/15 transition-all cursor-pointer"
                        title="Tambah poin bertitik"
                      >
                        + Poin (•)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomDescription((prev) => (prev ? `${prev}\n\n` : ''))}
                        className="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-amber-400/20 text-white/80 hover:text-amber-300 border border-white/15 transition-all cursor-pointer"
                        title="Buat paragraf baru"
                      >
                        + Paragraf Baru
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomDescription(SAMPLE_POSTER_DESCRIPTION_TEMPLATE)}
                        className="px-2 py-0.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 font-medium transition-all cursor-pointer"
                        title="Gunakan contoh format rapi"
                      >
                        Format Rapi
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={4}
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Tulis kalimat dan paragraf secara rapi... Gunakan tombol di atas untuk menambah poin atau paragraf baru."
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                  />
                  <p className="text-[11px] text-white/40 mt-1">
                    Tips: Kalimat dan paragraf akan tersusun rapi otomatis dengan spasi proporsional dan poin bertitik yang fleksibel.
                  </p>
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div
                id="poster-upload-dropzone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`rounded-2xl p-6 border-2 transition-all text-center flex flex-col items-center justify-center cursor-pointer group ${
                  isDragging
                    ? 'border-amber-400 bg-amber-500/15 scale-[1.01]'
                    : 'border-dashed border-amber-400/30 hover:border-amber-400/70 hover:bg-white/5'
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleFileProcess(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-all shadow-md">
                  <Upload size={26} className={isUploading ? 'animate-bounce' : ''} />
                </div>

                <h4 className="text-sm sm:text-base font-bold text-white mb-1">
                  {isUploading ? 'Sedang Memproses Berkas...' : 'Pilih Berkas atau Tarik File ke Sini'}
                </h4>

                <p className="text-xs text-white/60 mb-3">
                  Maksimal ukuran berkas 25 MB (JPG, PNG, atau PDF).
                </p>

                <button
                  type="button"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold text-xs shadow-md pointer-events-none"
                >
                  Pilih Berkas Poster / PDF
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

