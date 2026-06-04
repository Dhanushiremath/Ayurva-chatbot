import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, X, Camera, Microscope, AlertTriangle, CheckCircle,
  Clock, Zap, Info, ChevronDown, ChevronUp, RotateCcw,
  Stethoscope, Shield, FileImage, Activity, Volume2, VolumeX
} from 'lucide-react';
import { useVoice } from '../hooks/useVoice';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ── Urgency styling config ───────────────────────────────────────────────────
const URGENCY_CONFIG = {
  Emergency: {
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    badge: 'bg-red-600 text-white',
    icon: AlertTriangle,
  },
  Urgent: {
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    badge: 'bg-orange-500 text-white',
    icon: Zap,
  },
  Soon: {
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    badge: 'bg-yellow-500 text-white',
    icon: Clock,
  },
  Routine: {
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    badge: 'bg-green-500 text-white',
    icon: CheckCircle,
  },
  Informational: {
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    badge: 'bg-blue-500 text-white',
    icon: Info,
  },
};

const CONFIDENCE_COLORS = {
  High: 'text-green-600 bg-green-50 border-green-200',
  Moderate: 'text-yellow-600 bg-yellow-50 border-yellow-200',
  Low: 'text-red-600 bg-red-50 border-red-200',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function UploadZone({ onImageSelected, isDragging, setIsDragging }) {
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => onImageSelected(reader.result, file.name);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    processFile(file);
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`upload-zone p-10 text-center ${isDragging ? 'dragging' : ''}`}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => processFile(e.target.files?.[0])}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => processFile(e.target.files?.[0])}
      />

      <div className="flex flex-col items-center gap-4">
        <div className={`p-5 rounded-2xl transition-all duration-300 ${isDragging ? 'bg-[#2D4F46] shadow-glow-green scale-110' : 'bg-white shadow-card border border-slate-100'}`}>
          <FileImage size={36} className={isDragging ? 'text-[#E8B67D]' : 'text-[#2D4F46]'} />
        </div>

        <div>
          <p className="text-lg font-bold text-slate-700 mb-1">
            {isDragging ? '✦ Drop image here' : 'Upload a health image'}
          </p>
          <p className="text-sm text-slate-400">Drag & drop, click to browse, or use camera</p>
        </div>

        <div className="flex flex-wrap gap-2 justify-center mt-1">
          {['Skin Rash', 'Eye Condition', 'Wound', 'X-Ray', 'Medical Report', 'Oral Health'].map((label) => (
            <span key={label} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 shadow-sm hover:border-[#2D4F46]/30 hover:text-[#2D4F46] transition-colors">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Camera button */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); cameraInputRef.current?.click(); }}
        className="absolute bottom-4 right-4 flex items-center gap-2 bg-[#2D4F46] text-[#E8B67D] px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all shadow-lg"
      >
        <Camera size={14} />
        Camera
      </button>
    </div>
  );
}

function ImagePreview({ image, imageName, onClear }) {
  return (
    <div className="relative rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-200">
      <img
        src={image}
        alt="Health image for analysis"
        className="w-full max-h-72 object-contain"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex items-end justify-between">
        <p className="text-white text-xs font-semibold truncate max-w-[70%]">{imageName}</p>
        <button
          onClick={onClear}
          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full transition-all hover:scale-110 shadow-md"
        >
          <X size={12} />
        </button>
      </div>
    </div>
  );
}

function AnalysisResult({ analysis, onSpeak, onStop, isSpeaking }) {
  const [showDetails, setShowDetails] = useState(true);
  const urgencyConfig = URGENCY_CONFIG[analysis.urgency] || URGENCY_CONFIG.Informational;
  const UrgencyIcon = urgencyConfig.icon;

  // Build a clean speech summary of the analysis
  const buildSpeechText = () => {
    const parts = [];
    if (analysis.primaryCondition) parts.push(`Analysis result: ${analysis.primaryCondition}.`);
    if (analysis.confidence) parts.push(`Confidence level: ${analysis.confidence}.`);
    if (analysis.description) parts.push(analysis.description);
    if (analysis.urgency) parts.push(`Urgency: ${analysis.urgency}.`);
    if (analysis.specialistType) parts.push(`You should see a ${analysis.specialistType}.`);
    if (analysis.recommendedActions?.length) {
      parts.push('Recommended actions: ' + analysis.recommendedActions.join('. '));
    }
    if (analysis.warningSigns?.length) {
      parts.push('Warning signs to watch for: ' + analysis.warningSigns.join('. '));
    }
    parts.push(analysis.disclaimer || 'This is AI analysis and cannot replace professional medical diagnosis.');
    return parts.join(' ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-4"
    >
      {/* Primary Result Card */}
      <div className={`rounded-3xl p-6 border-2 ${urgencyConfig.bg} ${urgencyConfig.border}`}>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${urgencyConfig.badge}`}>
                {analysis.urgency}
              </span>
              {analysis.confidence && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${CONFIDENCE_COLORS[analysis.confidence] || CONFIDENCE_COLORS.Moderate}`}>
                  {analysis.confidence} Confidence
                </span>
              )}
              {analysis.category && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white border border-slate-200 text-slate-600">
                  {analysis.category}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold text-slate-800 leading-tight">
              {analysis.identified === false ? 'Unable to Identify' : (analysis.primaryCondition || 'Analysis Complete')}
            </h3>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-2xl ${urgencyConfig.bg} border ${urgencyConfig.border}`}>
              <UrgencyIcon size={24} className={urgencyConfig.color} />
            </div>
            {/* TTS button */}
            <button
              onClick={() => isSpeaking ? onStop() : onSpeak(buildSpeechText())}
              title={isSpeaking ? 'Stop reading' : 'Read analysis aloud'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                isSpeaking
                  ? 'bg-[#2D4F46] text-[#E8B67D] border-[#2D4F46]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-[#2D4F46]/40 hover:text-[#2D4F46]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <div className="voice-wave">
                    <span></span><span></span><span></span><span></span>
                  </div>
                  Stop
                </>
              ) : (
                <><Volume2 size={11} /> Read Aloud</>
              )}
            </button>
          </div>
        </div>

        {analysis.description && (
          <p className="text-sm text-slate-600 leading-relaxed">{analysis.description}</p>
        )}
      </div>

      {/* Specialist Recommendation */}
      {analysis.specialistType && (
        <div className="flex items-center gap-4 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <div className="bg-[#2D4F46]/10 p-3 rounded-xl">
            <Stethoscope size={20} className="text-[#2D4F46]" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Recommended Specialist</p>
            <p className="font-bold text-slate-800">{analysis.specialistType}</p>
          </div>
        </div>
      )}

      {/* Toggle Details Button */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full flex items-center justify-between bg-white border border-slate-200 hover:border-[#2D4F46]/30 rounded-2xl p-4 transition-all shadow-sm font-bold text-slate-600 text-sm"
      >
        <span>Full Analysis Details</span>
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 overflow-hidden"
          >
            {/* Possible Conditions */}
            {analysis.possibleConditions?.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Microscope size={14} />
                  Possible Conditions
                </h4>
                <div className="space-y-3">
                  {analysis.possibleConditions.map((cond, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#2D4F46] text-[#E8B67D] flex items-center justify-center text-[10px] font-black mt-0.5">
                        {i + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-700 text-sm">{cond.name}</span>
                          {cond.probability && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${CONFIDENCE_COLORS[cond.probability] || CONFIDENCE_COLORS.Moderate}`}>
                              {cond.probability}
                            </span>
                          )}
                        </div>
                        {cond.description && (
                          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{cond.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Visible Symptoms */}
            {analysis.symptoms?.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Activity size={14} />
                  Visible Symptoms Detected
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.symptoms.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Recommended Actions */}
            {analysis.recommendedActions?.length > 0 && (
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <CheckCircle size={14} />
                  Recommended Actions
                </h4>
                <ol className="space-y-2">
                  {analysis.recommendedActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#2D4F46] text-[#E8B67D] flex items-center justify-center text-[10px] font-black mt-0.5">
                        {i + 1}
                      </span>
                      {action}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Home Remedies */}
            {analysis.homeRemedies?.length > 0 && (
              <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-green-600 mb-3">
                  🌿 Home Remedies (Supportive Care)
                </h4>
                <ul className="space-y-1.5">
                  {analysis.homeRemedies.map((remedy, i) => (
                    <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span>
                      {remedy}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warning Signs */}
            {analysis.warningSigns?.length > 0 && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                <h4 className="text-xs font-black uppercase tracking-widest text-red-600 mb-3 flex items-center gap-2">
                  <AlertTriangle size={12} />
                  Warning Signs — Seek Immediate Help If:
                </h4>
                <ul className="space-y-1.5">
                  {analysis.warningSigns.map((sign, i) => (
                    <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">⚠</span>
                      {sign}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disclaimer */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <Shield size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-500 leading-relaxed">
          {analysis.disclaimer || 'This is AI-generated analysis and cannot replace professional medical diagnosis. Always consult a qualified healthcare provider.'}
        </p>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

const ImageAnalyzer = ({ language = 'en' }) => {
  const [image, setImage] = useState(null);
  const [imageName, setImageName] = useState('');
  const [context, setContext] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const { speak, stopSpeaking, isSpeaking, ttsSupported } = useVoice(language);

  const handleImageSelected = (base64, name) => {
    setImage(base64);
    setImageName(name || 'image.jpg');
    setAnalysis(null);
    setError(null);
  };

  const handleClear = () => {
    setImage(null);
    setImageName('');
    setAnalysis(null);
    setError(null);
    setContext('');
    stopSpeaking();
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await axios.post(`${API_URL}/image-analyze`, {
        image,
        context: context.trim() || undefined
      });

      if (response.data.success && response.data.analysis) {
        setAnalysis(response.data.analysis);
      } else {
        setError('Analysis returned no results. Please try a clearer image.');
      }
    } catch (err) {
      console.error('Image analysis error:', err);
      const msg = err.response?.data?.error || 'Failed to analyze the image. Please try again.';
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto gradient-mesh">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-5 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-teal-500 to-primary p-3 rounded-2xl shadow-lg shadow-teal-500/25">
              <Microscope size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gradient leading-tight">Disease Image Analyzer</h2>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mt-0.5">AI-Powered Visual Diagnosis</p>
            </div>
          </div>
        </div>

        {/* Rainbow divider */}
        <hr className="divider-rainbow" />

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-teal-50 via-green-50 to-emerald-50 border border-teal-100 rounded-2xl p-4 flex gap-3">
          <div className="icon-teal p-1.5 rounded-lg flex-shrink-0">
            <Info size={14} />
          </div>
          <p className="text-xs text-teal-800 leading-relaxed">
            Upload a photo of a <strong>skin condition, eye problem, wound, rash</strong>, or any health concern.
            Our AI analyzes the image and identifies possible diseases with recommendations.
          </p>
        </div>

        {/* Upload or Preview */}
        {!image ? (
          <UploadZone
            onImageSelected={handleImageSelected}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
          />
        ) : (
          <ImagePreview image={image} imageName={imageName} onClear={handleClear} />
        )}

        {/* Context Input */}
        {image && !analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="relative">
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Optional: Describe your symptoms or give context (e.g. 'This rash appeared 3 days ago and is itchy')"
                rows={3}
                className="w-full bg-white border-2 border-transparent rounded-2xl px-5 py-4 text-sm font-medium focus:border-[#2D4F46]/20 outline-none transition-all resize-none placeholder:text-slate-400 shadow-sm"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="btn-primary w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#E8B67D]/30 border-t-[#E8B67D] rounded-full animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Microscope size={18} />
                  Analyze for Diseases
                </>
              )}
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-card overflow-hidden relative"
          >
            {/* shimmer top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2D4F46] via-[#E8B67D] to-[#C16A46] animate-pulse rounded-t-3xl" />

            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#2D4F46]/10 flex items-center justify-center">
                  <Microscope size={28} className="text-[#2D4F46]" />
                </div>
                <div className="absolute inset-0 rounded-full border-4 border-[#2D4F46]/15 border-t-[#2D4F46] animate-spin" />
              </div>
            </div>
            <h3 className="font-bold text-slate-700 mb-1">AI is analyzing your image</h3>
            <p className="text-sm text-slate-400 mb-4">Examining patterns, symptoms, and visual indicators...</p>

            {/* Typing dots */}
            <div className="flex justify-center gap-2 mb-4">
              <div className="typing-dot" />
              <div className="typing-dot" />
              <div className="typing-dot" />
            </div>

            <div className="flex justify-center gap-2 flex-wrap">
              {['Scanning image', 'Pattern detection', 'Cross-referencing database'].map((step, i) => (
                <span
                  key={step}
                  className="skeleton px-3 py-1.5 text-transparent text-[10px] font-semibold rounded-full"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {step}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-3"
          >
            <AlertTriangle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-red-700 text-sm mb-1">Analysis Failed</p>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
            <button
              onClick={() => { setError(null); }}
              className="text-red-400 hover:text-red-600 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}

        {/* Analysis Result */}
        {analysis && (
          <AnalysisResult
            analysis={analysis}
            onSpeak={speak}
            onStop={stopSpeaking}
            isSpeaking={isSpeaking}
          />
        )}

        {/* Analyze Again button */}
        {analysis && (
          <button
            onClick={handleClear}
            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-[#2D4F46]/30 text-slate-600 py-4 rounded-2xl font-bold text-sm transition-all"
          >
            <RotateCcw size={16} />
            Analyze Another Image
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;
