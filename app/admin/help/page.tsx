import Link from 'next/link';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            ← Voltar ao Painel
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            Como Criar Templates Profissionais
          </h1>
          <p className="mt-2 text-gray-600">
            Guia completo para criar templates personalizados focados em nome e
            foto
          </p>
        </div>

        <div className="space-y-8">
          {/* Seção 1: Visão Geral */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎯 Visão Geral do Sistema
            </h2>
            <div className="prose max-w-none">
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      <strong>Importante:</strong> O sistema agora foca apenas
                      em <strong>NOME</strong> e <strong>FOTO</strong>. Empresa
                      e campos extras são coletados mas não aparecem no template
                      final.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                O sistema permite controle total sobre:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>
                  <strong>Posicionamento da Foto:</strong> Arraste e
                  redimensione com o mouse
                </li>
                <li>
                  <strong>Formato da Foto:</strong> Escolha entre quadrada ou
                  circular
                </li>
                <li>
                  <strong>Posicionamento do Nome:</strong> Controle preciso da
                  posição
                </li>
                <li>
                  <strong>Tipografia do Nome:</strong> Tamanho de 12px até 200px
                  e escolha da fonte
                </li>
                <li>
                  <strong>Fontes Disponíveis:</strong> 10 opções profissionais
                  incluindo Arial, Helvetica, Times, etc.
                </li>
              </ul>
            </div>
          </div>

          {/* Seção 2: Preparando o Template */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🖼️ Preparando seu Template
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Especificações Técnicas
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Formato:</strong> PNG, JPG ou JPEG
                  </li>
                  <li>
                    <strong>Resolução:</strong> Mínimo 800x600px
                  </li>
                  <li>
                    <strong>Qualidade:</strong> Alta resolução (300 DPI
                    recomendado)
                  </li>
                  <li>
                    <strong>Tamanho:</strong> Máximo 10MB
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Dicas de Design
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Deixe espaço para foto e nome apenas</li>
                  <li>Use cores contrastantes para o texto do nome</li>
                  <li>Considere o formato final (digital/impresso)</li>
                  <li>Teste com nomes longos e curtos</li>
                  <li>Lembre-se: apenas nome e foto aparecerão</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">
                ✨ Novo: Foco Simplificado
              </h4>
              <p className="text-green-700">
                O template agora é mais limpo e focado. Apenas o nome da pessoa
                e sua foto aparecerão no card final, criando um design mais
                elegante e profissional. Empresa e outros dados são coletados
                para controle interno.
              </p>
            </div>
          </div>

          {/* Seção 3: Configuração Interativa */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🎮 Configuração Interativa
            </h2>

            <div className="space-y-6">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="text-lg font-semibold text-red-700 mb-2">
                  📸 Configuração da Foto
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Posicionamento:</strong> Clique e arraste a área
                    vermelha
                  </li>
                  <li>
                    <strong>Redimensionamento:</strong> Arraste a alça no canto
                    inferior direito
                  </li>
                  <li>
                    <strong>Formato:</strong> Escolha entre quadrada ou circular
                    no dropdown
                  </li>
                  <li>
                    <strong>Ajuste Fino:</strong> Use os campos numéricos para
                    precisão pixel-perfect
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="text-lg font-semibold text-green-700 mb-2">
                  ✏️ Configuração do Nome
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Posicionamento:</strong> Clique e arraste a área
                    verde
                  </li>
                  <li>
                    <strong>Tamanho da Fonte:</strong> De 12px até 200px
                    (arraste a alça ou use o campo numérico)
                  </li>
                  <li>
                    <strong>Família da Fonte:</strong> 10 opções profissionais
                    disponíveis
                  </li>
                  <li>
                    <strong>Centralização:</strong> O texto é automaticamente
                    centralizado na posição
                  </li>
                </ul>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="text-lg font-semibold text-purple-700 mb-2">
                  🎨 Fontes Disponíveis
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <div>• Arial (padrão)</div>
                  <div>• Helvetica</div>
                  <div>• Times New Roman</div>
                  <div>• Georgia</div>
                  <div>• Verdana</div>
                  <div>• Trebuchet MS</div>
                  <div>• Impact</div>
                  <div>• Comic Sans MS</div>
                  <div>• Courier New</div>
                  <div>• Lucida Console</div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">
                🎯 Preview em Tempo Real
              </h4>
              <p className="text-blue-700">
                Todas as alterações são mostradas instantaneamente no preview.
                Você pode ver exatamente como o nome ficará com a fonte e
                tamanho escolhidos antes de salvar o evento.
              </p>
            </div>
          </div>

          {/* Seção 4: Exemplos Práticos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📋 Exemplos de Layouts Simplificados
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Layout Clássico
                </h3>
                <div className="bg-gray-100 h-32 rounded mb-2 relative">
                  <div className="absolute top-2 left-2 w-8 h-8 bg-red-300 rounded"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-4 bg-green-300 rounded"></div>
                </div>
                <p className="text-sm text-gray-600">
                  Foto no canto superior, nome na parte inferior
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Layout Centralizado
                </h3>
                <div className="bg-gray-100 h-32 rounded mb-2 relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-red-300 rounded-full"></div>
                  <div className="absolute bottom-2 left-2 right-2 h-4 bg-green-300 rounded"></div>
                </div>
                <p className="text-sm text-gray-600">
                  Foto circular centralizada, nome embaixo
                </p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Layout Lateral
                </h3>
                <div className="bg-gray-100 h-32 rounded mb-2 relative">
                  <div className="absolute top-2 left-2 w-8 h-12 bg-red-300 rounded"></div>
                  <div className="absolute top-2 left-12 right-2 h-4 bg-green-300 rounded"></div>
                </div>
                <p className="text-sm text-gray-600">
                  Foto à esquerda, nome à direita
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                💡 Dica de Design
              </h4>
              <p className="text-yellow-700">
                Com apenas nome e foto, você tem mais liberdade criativa.
                Considere usar fontes maiores (até 200px) para criar impacto
                visual, especialmente em templates para eventos corporativos ou
                conferências.
              </p>
            </div>
          </div>

          {/* Seção 5: Checklist Final */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              ✅ Checklist Final
            </h2>

            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Template em alta resolução (mínimo 800x600px)
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Área da foto posicionada e dimensionada corretamente
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Formato da foto escolhido (quadrada/circular)
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Posição e tamanho do nome configurados
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Fonte do nome selecionada adequadamente
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Preview testado com diferentes tamanhos de nome
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Contraste adequado entre texto e fundo
                </span>
              </label>

              <label className="flex items-center space-x-3">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-700">
                  Confirmado que apenas nome e foto aparecerão no template
                </span>
              </label>
            </div>
          </div>

          {/* Seção 6: Solução de Problemas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🔧 Solução de Problemas
            </h2>

            <div className="space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-700">
                  Foto não aparece no card final
                </h3>
                <p className="text-gray-700">
                  Verifique se as coordenadas estão dentro dos limites do
                  template e se a área não é muito pequena (mínimo 50x50px).
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-700">
                  Nome cortado ou ilegível
                </h3>
                <p className="text-gray-700">
                  Ajuste o tamanho da fonte (12-200px) ou reposicione o texto.
                  Considere o contraste com o fundo do template.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-700">
                  Fonte não aparece como esperado
                </h3>
                <p className="text-gray-700">
                  Algumas fontes podem não estar disponíveis em todos os
                  sistemas. Arial é sempre seguro como fallback.
                </p>
              </div>

              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-yellow-700">
                  Template muito grande
                </h3>
                <p className="text-gray-700">
                  Comprima a imagem ou reduza a resolução. O sistema aceita até
                  10MB, mas recomendamos 2-5MB para melhor performance.
                </p>
              </div>
            </div>
          </div>

          {/* Seção 7: Recursos Avançados */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🚀 Recursos Avançados
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Tipografia Avançada
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Tamanhos de fonte de 12px até 200px</li>
                  <li>10 famílias de fonte profissionais</li>
                  <li>Centralização automática do texto</li>
                  <li>Preview em tempo real da tipografia</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Controle Visual
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>Drag-and-drop para posicionamento</li>
                  <li>Redimensionamento com alças visuais</li>
                  <li>Controles numéricos precisos</li>
                  <li>Preview instantâneo das mudanças</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">
                🎨 Dica Profissional
              </h4>
              <p className="text-purple-700">
                Para eventos corporativos, use fontes como Arial ou Helvetica
                com tamanhos entre 32-48px. Para eventos criativos, experimente
                Impact ou Trebuchet MS com tamanhos maiores (60-100px) para mais
                impacto visual.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            href="/admin"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Começar a Criar Template
          </Link>
        </div>
      </div>
    </div>
  );
}
