import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowLeft, Moon, Sun, Image, Save, RotateCcw } from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState('');
  const [tempBackgroundUrl, setTempBackgroundUrl] = useState('');

  // Verificar tema atual e URL de fundo ao carregar
  useEffect(() => {
    const currentTheme = document.documentElement.classList.contains('dark');
    setIsDarkMode(currentTheme);

    const savedBackgroundUrl = localStorage.getItem('background-url') || '';
    setBackgroundUrl(savedBackgroundUrl);
    setTempBackgroundUrl(savedBackgroundUrl);
  }, []);

  // Alternar modo escuro
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Salvar URL de fundo
  const saveBackgroundUrl = () => {
    setBackgroundUrl(tempBackgroundUrl);
    localStorage.setItem('background-url', tempBackgroundUrl);
    
    // Aplicar a nova imagem de fundo
    if (tempBackgroundUrl) {
      document.body.style.backgroundImage = `url('${tempBackgroundUrl}')`;
      document.body.style.backgroundRepeat = 'repeat';
    } else {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundRepeat = '';
    }
  };

  // Resetar para fundo padrão
  const resetToDefault = () => {
    const defaultUrl = 'https://cdn.artstation.com/p/thumbnails/001/253/239/thumb.jpg';
    setTempBackgroundUrl(defaultUrl);
    setBackgroundUrl(defaultUrl);
    localStorage.setItem('background-url', defaultUrl);
    
    document.body.style.backgroundImage = `url('${defaultUrl}')`;
    document.body.style.backgroundRepeat = 'repeat';
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-700 to-indigo-800 text-white p-6">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 text-white border-orange-500 hover:border-orange-600"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Configurações</h1>
              <p className="text-sm opacity-90">Personalize sua experiência</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="bg-white/20 dark:bg-black/50 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/20">
          <div className="space-y-6">
            
            {/* Tema */}
            <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-indigo-100/30 dark:from-purple-900/20 dark:to-indigo-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-purple-700 dark:text-purple-300 flex items-center gap-3">
                  {isDarkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  Tema
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Modo Escuro</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Alterne entre tema claro e escuro
                    </p>
                  </div>
                  <Button
                    onClick={toggleDarkMode}
                    variant={isDarkMode ? "default" : "outline"}
                    size="sm"
                    className={`min-w-[100px] ${
                      isDarkMode 
                        ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                        : 'border-purple-300 text-purple-600 hover:bg-purple-50'
                    }`}
                  >
                    {isDarkMode ? (
                      <><Moon className="h-4 w-4 mr-2" /> Escuro</>
                    ) : (
                      <><Sun className="h-4 w-4 mr-2" /> Claro</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Imagem de Fundo */}
            <Card className="glass-card shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-green-100/30 dark:from-blue-900/20 dark:to-green-800/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="text-lg text-blue-700 dark:text-blue-300 flex items-center gap-3">
                  <Image className="h-5 w-5" />
                  Imagem de Fundo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">URL da Imagem</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Cole o link de uma imagem para personalizar o fundo da ficha
                  </p>
                  <Input
                    type="url"
                    value={tempBackgroundUrl}
                    onChange={(e) => setTempBackgroundUrl(e.target.value)}
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="mb-3"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={saveBackgroundUrl}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      size="sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Fundo
                    </Button>
                    
                    <Button
                      onClick={resetToDefault}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/30"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Padrão Oceano
                    </Button>
                  </div>
                  
                  {backgroundUrl && (
                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Fundo atual:</p>
                      <p className="text-sm font-mono text-gray-800 dark:text-gray-200 break-all">
                        {backgroundUrl}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {tempBackgroundUrl && tempBackgroundUrl !== backgroundUrl && (
              <Card className="glass-card shadow-xl border-yellow-200 dark:border-yellow-600">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-700 dark:text-yellow-300">
                    Preview da Nova Imagem
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-cover bg-center bg-repeat"
                    style={{ backgroundImage: `url('${tempBackgroundUrl}')` }}
                  >
                    <div className="w-full h-full bg-black/20 rounded-lg flex items-center justify-center">
                      <p className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded">
                        Preview do Fundo
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Clique em "Salvar Fundo" para aplicar esta imagem
                  </p>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;