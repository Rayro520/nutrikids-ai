/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { MOCK_PRESET_SCANS } from "../utils/nutritionData";
import { ProductScanResult, ChildProfile } from "../types";
import { Camera, RefreshCw, UploadCloud, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, FileText, LucideIcon } from "lucide-react";

interface ProductScannerProps {
  activeProfile: ChildProfile | null;
}

export default function ProductScanner({ activeProfile }: ProductScannerProps) {
  const [selectedPresetId, setSelectedPresetId] = useState("");
  const [scanResult, setScanResult] = useState<ProductScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Real Camera capture states
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getAgeInMonths = (): number => {
    if (!activeProfile || !activeProfile.birthDate) return 12;
    const dob = new Date(activeProfile.birthDate);
    const now = new Date();
    return Math.max(1, (now.getFullYear() - dob.getFullYear()) * 12 + now.getMonth() - dob.getMonth());
  };

  // Start webcam
  const startCamera = async () => {
    setUseRealCamera(true);
    setStreamActive(false);
    setError(null);
    try {
      const constraints = { video: { facingMode: "environment" } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Não foi possível acessar a câmera do dispositivo. Usando modo de simulação de alta fidelidade.");
      setUseRealCamera(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    setUseRealCamera(false);
  };

  // Capture photo from video and send to Gemini server
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setError(null);
    setScanResult(null);

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        const base64Data = dataUrl.split(",")[1];

        // Send to backend Gemini multimodal analysis
        const response = await fetch("/api/scan-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: "image/jpeg",
            ageMonths: getAgeInMonths(),
          }),
        });

        if (!response.ok) {
          throw new Error("Falha ao analisar a imagem do lote nutricional.");
        }

        const data: ProductScanResult = await response.json();
        setScanResult(data);
        stopCamera();
      }
    } catch (err: any) {
      console.error(err);
      setError("Erro ao analisar imagem com a IA. Tente carregar um arquivo ou selecionar nossos presets interativos.");
    } finally {
      setLoading(false);
    }
  };

  // File Upload scanner handler
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setScanResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Data = (reader.result as string).split(",")[1];
        const response = await fetch("/api/scan-product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type,
            ageMonths: getAgeInMonths(),
          }),
        });

        if (!response.ok) {
          throw new Error("Erro de processamento no servidor.");
        }

        const data: ProductScanResult = await response.json();
        setScanResult(data);
      } catch (err: any) {
        console.error(err);
        setError("Erro ao enviar a imagem para análise da tabela de ingredientes. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Run presets scan simulation (immediately responsive)
  const handlePresetScan = (presetId: string) => {
    const preset = MOCK_PRESET_SCANS.find((p) => p.id === presetId);
    if (!preset) return;
    
    setSelectedPresetId(presetId);
    setLoading(true);
    setError(null);
    setScanResult(null);

    // Simulated short analysis for pleasant interactive flow
    setTimeout(() => {
      setScanResult(preset.analysis as ProductScanResult);
      setLoading(false);
    }, 1200);
  };

  // Helper for ratings
  const badgeColors = (ratingName: string) => {
    const raw = ratingName.toLowerCase();
    if (raw.includes("não") || raw.includes("proibido") || raw.includes("ruim") || raw.includes("rec")) {
      if (raw.includes("não") || raw.includes("proibido")) {
        return {
          bg: "bg-rose-50 border-rose-200 text-rose-700",
          dots: "🔴 Não recomendado",
          text: "text-rose-700"
        };
      }
    }
    if (raw.includes("moderado") || raw.includes("atenção")) {
      return {
        bg: "bg-amber-50 border-amber-200 text-amber-700",
        dots: "🟡 Consumo moderado",
        text: "text-amber-700"
      };
    }
    return {
      bg: "bg-orange-50 border-orange-150 text-orange-850",
      dots: "🟢 Saudável e Seguro",
      text: "text-orange-750"
    };
  };

  const getHighlightColor = (level: string) => {
    const txt = level.toLowerCase();
    if (txt.includes("alto") || txt.includes("exced")) return "text-rose-600 bg-rose-50 border-rose-100";
    if (txt.includes("mod")) return "text-amber-600 bg-amber-50 border-amber-100";
    return "text-orange-650 bg-orange-50 border-orange-100/40";
  };

  return (
    <div id="product-scanner-section" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-orange-500" />
          <h2 className="text-base font-black text-gray-800 tracking-tight font-display">Varredura de Rótulos</h2>
        </div>
        <span className="text-[9px] bg-orange-50 text-orange-800 font-extrabold px-2 py-0.5 rounded-md border border-orange-100/40">
          IA Multimodal Ativa
        </span>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Fotografe o rótulo de leites, papinhas, sucos e biscoitos infantis usando a câmera do seu celular, ou faça upload de uma foto com ingredientes para que nossa IA faça a varredura crítica de açúcares, conservantes e gorduras.
      </p>

      {/* Primary Scanner Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Scanner Controller Column */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Active Camera Window simulated or real */}
          <div className="aspect-video sm:aspect-[4/3] bg-slate-950 rounded-2xl relative overflow-hidden border border-slate-800 flex flex-col items-center justify-center text-white">
            
            {useRealCamera ? (
              <video
                ref={videoRef}
                playsInline
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <div className="text-center p-6 flex flex-col items-center">
                <Camera className="w-10 h-10 text-slate-600 mb-2 animate-gentle-pulse" />
                <p className="text-xs text-slate-400 font-medium">Câmera em modo Standby</p>
                <p className="text-[10px] text-slate-500 mt-1">Toque para ativar câmera traseira ou envie uma foto do rótulo</p>
              </div>
            )}

            {/* Visual Laser/Scan overlay */}
            {(loading || (useRealCamera && streamActive)) && (
              <div className="absolute left-0 right-0 h-0.5 bg-orange-400 opacity-80 shadow-[0_0_15px_rgba(249,115,22,1)] animate-[bounce_2s_infinite]"></div>
            )}

            {/* Status tags */}
            {useRealCamera && streamActive && (
              <span className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                AO VIVO
              </span>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {!useRealCamera ? (
              <button
                onClick={startCamera}
                className="flex-1 py-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
              >
                <Camera className="w-4 h-4 text-orange-400" />
                Ativar Câmera
              </button>
            ) : (
              <div className="flex gap-2 w-full">
                <button
                  onClick={captureAndScan}
                  disabled={loading || !streamActive}
                  className="flex-1 py-2 bg-orange-500 text-white font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-1 active:scale-95 shadow-xs"
                >
                  Escanear Rótulo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-3.5 py-2 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            )}

            {/* Real File Upload button */}
            <label className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1 cursor-pointer text-center active:scale-95">
              <UploadCloud className="w-4 h-4 text-slate-500" />
              <span>Enviar Foto</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Hidden Canvas for captures */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Preset scan selectors */}
          <div className="border border-orange-100/30 p-3.5 rounded-2xl bg-orange-50/10">
            <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">Simulador de rótulo para testes:</h3>
            <div className="space-y-1.5">
              {MOCK_PRESET_SCANS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetScan(preset.id)}
                  className={`w-full p-2.5 rounded-xl border text-left bg-white transition-all text-xs flex gap-2 items-center ${
                    selectedPresetId === preset.id
                      ? "border-orange-500 bg-orange-50/45 ring-1 ring-orange-500"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <span className="text-base shrink-0 ">{preset.imgUrl}</span>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-800 truncate">{preset.label}</p>
                    <p className="text-[9px] text-gray-400 truncate leading-none">Toque para analisar</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scan Results Panel */}
        <div className="lg:col-span-7">
          {loading ? (
            <div className="h-full min-h-[220px] bg-orange-50/10 rounded-2xl border border-dashed border-orange-100/40 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-8 h-8 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mb-3"></div>
              <h3 className="font-black text-gray-800 text-xs uppercase tracking-wider">Leitura de nutrientes ativa...</h3>
              <p className="text-[10px] text-gray-400 mt-2 max-w-xs">
                O OCR inteligente está extraindo açúcar total, conservantes nocivos, amido modificado e sódio...
              </p>
            </div>
          ) : error ? (
            <div className="h-full bg-rose-50 border border-rose-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-8 h-8 text-rose-500 mb-2" />
              <h3 className="font-bold text-rose-850 text-xs">Erro ao escanear</h3>
              <p className="text-[10px] text-rose-600 mt-1">{error}</p>
            </div>
          ) : scanResult ? (
            <div className={`p-5 rounded-3xl border transition-all ${badgeColors(scanResult.rating).bg}`}>
              <div className="flex gap-3 items-start border-b border-orange-100/30 pb-3 mb-3">
                <span className="w-10 h-10 bg-white/80 rounded-xl flex items-center justify-center text-2xl border shadow-xs">
                  🔎
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white px-2 py-0.5 rounded-md border text-slate-700">
                    Resultado da Varredura
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 font-display mt-1">{scanResult.productName}</h3>
                  <p className="text-xs font-semibold uppercase tracking-wider mt-1 flex items-center gap-1.5">
                    {badgeColors(scanResult.rating).dots}
                  </p>
                </div>
              </div>

              {/* Analysis Checklist */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-2">Composição Analisada</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2.5 rounded-xl border text-xs ${getHighlightColor(scanResult.highlights.sugar)}`}>
                      <span className="block font-medium text-gray-500 text-[10px]">Açúcar adicionado</span>
                      <strong className="block text-sm font-bold">{scanResult.highlights.sugar}</strong>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-xs ${getHighlightColor(scanResult.highlights.sodium)}`}>
                      <span className="block font-medium text-gray-500 text-[10px]">Sódio (Sal de adição)</span>
                      <strong className="block text-sm font-bold">{scanResult.highlights.sodium}</strong>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-xs ${getHighlightColor(scanResult.highlights.additives)}`}>
                      <span className="block font-medium text-gray-500 text-[10px]">Conservantes / Corantes</span>
                      <strong className="block text-sm font-bold">{scanResult.highlights.additives}</strong>
                    </div>
                    <div className={`p-2.5 rounded-xl border text-xs ${getHighlightColor(scanResult.highlights.fats)}`}>
                      <span className="block font-medium text-gray-500 text-[10px]">Gorduras ruins (Trans)</span>
                      <strong className="block text-sm font-bold">{scanResult.highlights.fats}</strong>
                    </div>
                  </div>
                </div>

                {/* Pediatric Evaluation */}
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-gray-400" />
                    Parecer do Nutropediatra Digital
                  </h4>
                  <p className="text-xs leading-relaxed text-gray-600 bg-white/70 p-3 rounded-xl border border-gray-100/50">
                    {scanResult.evaluation}
                  </p>
                </div>

                {/* Risks list */}
                {scanResult.risks && (
                  <div className="bg-rose-50/50 border border-rose-100/30 p-3 rounded-xl text-xs text-rose-800">
                    <span className="font-bold block mb-1">⚠️ Perigos e Danos:</span>
                    <p>{scanResult.risks}</p>
                  </div>
                )}

                {/* Healthy alternatives */}
                {scanResult.alternatives && scanResult.alternatives.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">Alternativas Saudáveis Indicadas</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {scanResult.alternatives.map((alt, idx) => (
                        <span key={idx} className="bg-orange-50 border border-orange-100 text-orange-850 px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs">
                          {alt}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources info */}
                <div className="pt-3 border-t border-orange-100/30 text-[9px] text-gray-400 flex justify-between items-center bg-gray-50/30 px-2.5 py-1.5 rounded-lg">
                  <span>Diretrizes {scanResult.source || "SBP / Anvisa"}</span>
                  <span>Atualizado 2026</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[300px] border border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-6 text-center bg-gray-50/20">
              <Camera className="w-10 h-10 text-gray-300 mb-2" />
              <h3 className="font-extrabold text-gray-700 text-xs uppercase tracking-wider">Nenhum rótulo lido</h3>
              <p className="text-[11px] text-gray-400 mt-2 max-w-xs leading-normal">
                Selecione um simulador de rótulo acima ou ative sua câmera para obter o laudo da IA imediatamente.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
