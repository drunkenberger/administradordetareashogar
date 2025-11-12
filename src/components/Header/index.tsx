import { useNavigate } from 'react-router-dom';
import { CalendarClock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Header() {
  const navigate = useNavigate();

  const handleContact = () => {
    const subject = encodeURIComponent('Solicitud de aplicación personalizada - TidyHome');
    const body = encodeURIComponent('Hola,\n\nEstoy interesado en crear una aplicación similar a TidyHome.\n\nPor favor, contáctame para discutir los detalles.\n\nGracias.');
    window.location.href = `mailto:info@waza.baby?subject=${subject}&body=${body}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-white/20 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            id="header-brand-052"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-105">
              <CalendarClock className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                TidyHome
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Planificador de Tareas</p>
            </div>
          </div>

          {/* Contact Action */}
          <div className="flex items-center">
            <Button
              id="header-contact-button-055"
              size="sm"
              onClick={handleContact}
              className="gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Contáctanos para crear aplicaciones como esta</span>
              <span className="sm:hidden">Contáctanos</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
