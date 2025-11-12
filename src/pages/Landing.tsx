import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Grid3x3,
  Library,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  CalendarClock,
  Download,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: '5 Categorías de Tareas',
      description: 'Organiza por diaria, semanal, mensual, eventual y urgente',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      title: '4 Tipos de Asignación',
      description: 'Distribuye tareas entre ayudante, esposa, esposo o compartido',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Grid3x3,
      title: '3 Vistas Flexibles',
      description: 'Alterna entre vista semanal, cuadrícula y vista diaria',
      gradient: 'from-indigo-500 to-blue-500'
    },
    {
      icon: Library,
      title: '143+ Plantillas',
      description: 'Biblioteca completa de tareas predefinidas listas para usar',
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Zap,
      title: 'Drag & Drop',
      description: 'Arrastra, suelta y redimensiona tareas con facilidad',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Download,
      title: 'Exportar/Importar',
      description: 'Guarda y comparte tus planes en formato JSON',
      gradient: 'from-violet-500 to-purple-500'
    }
  ];

  const benefits = [
    'Generación automática de planes semanales inteligentes',
    'Detección de conflictos de horarios en tiempo real',
    'Guardado automático en tu navegador',
    'Interfaz moderna y responsive para móvil y web',
    'Sin necesidad de registro o cuenta',
    'Totalmente gratis y de código abierto'
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-float" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
          <div className="text-center animate-slide-down">
            {/* Logo Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-glow-strong mb-8 animate-bounce-gentle">
              <CalendarClock className="h-12 w-12 text-white" />
            </div>

            {/* Main Title */}
            <h1 id="landing-hero-title-049" className="text-5xl sm:text-6xl md:text-7xl font-display font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 leading-tight">
              Planificador de<br />Tareas del Hogar
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium">
              Organiza tu hogar con elegancia y eficiencia
            </p>
            <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
              La herramienta definitiva para planificar, asignar y gestionar todas las tareas domésticas de manera visual e intuitiva
            </p>

            {/* CTA Button */}
            <Button
              id="landing-cta-button-050"
              onClick={() => navigate('/app')}
              size="lg"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-6 rounded-2xl text-lg font-semibold shadow-strong hover:shadow-glow-strong transition-all duration-300 hover:scale-105"
            >
              Comenzar Ahora
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  143+
                </div>
                <div className="text-sm text-gray-600 font-medium">Plantillas Listas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  3
                </div>
                <div className="text-sm text-gray-600 font-medium">Vistas Diferentes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  100%
                </div>
                <div className="text-sm text-gray-600 font-medium">Gratis y Open Source</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Características Principales</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
              Todo lo que necesitas
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una solución completa para gestionar las tareas de tu hogar de forma profesional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group bg-white/70 backdrop-blur-md border-white/20 shadow-soft hover:shadow-strong transition-all duration-500 hover:scale-105 overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                  <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-soft mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
                <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white/70 backdrop-blur-md border-white/20 shadow-strong rounded-3xl p-8 sm:p-12 animate-slide-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
                ¿Por qué elegir nuestro planificador?
              </h2>
              <p className="text-lg text-gray-600">
                Diseñado para hacer tu vida más fácil y organizada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium leading-relaxed">{benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 pb-24">
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-strong overflow-hidden">
            <div className="absolute inset-0 bg-mesh-gradient opacity-10"></div>
            <div className="relative px-8 py-16 sm:px-12 sm:py-20 text-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
                Empieza a organizar tu hogar hoy
              </h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Sin registro, sin suscripciones, sin complicaciones. Solo tú y tu plan perfecto.
              </p>
              <Button
                id="landing-final-cta-051"
                onClick={() => navigate('/app')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 rounded-2xl text-lg font-semibold shadow-strong hover:shadow-glow transition-all duration-300 hover:scale-105 group"
              >
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <CalendarClock className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">TidyHome</p>
                <p className="text-xs text-gray-500">Planificador de Tareas del Hogar</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-600">
                Hecho con amor para hogares organizados
              </p>
              <p className="text-xs text-gray-500 mt-1">
                2025 - Todos los datos se guardan localmente en tu navegador
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
