import React, { useEffect, useRef, useState } from 'react';
import { 
  ScanSearch, 
  Upload, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  Target, 
  Camera,
  Layers,
  Crosshair,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

type Detection = {
  label: string;
  confidence: number;
};

type AnalysisResults = {
  detections: Detection[];
  hazards: string[];
  severity: number;
  zone: string;
  response: string;
};

export default function Analysis() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const analysisTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setPreviewUrl = (url: string) => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
    objectUrlRef.current = url;
    setImageSrc(url);
    setResults(null);
  };

  useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (analysisTimerRef.current) {
        clearTimeout(analysisTimerRef.current);
      }
    },
    [],
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const selectScenario = (scenario: string) => {
    // Generate a simulated placeholder SVG for the scenario
    const svg = `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0B0F19"/>
      <g opacity="0.1">
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#26B2E6" stroke-width="1"/>
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </g>
      <text x="50%" y="45%" font-family="monospace" font-size="28" fill="#26B2E6" text-anchor="middle" font-weight="bold">SCENARIO: ${scenario.toUpperCase()}</text>
      <text x="50%" y="55%" font-family="monospace" font-size="16" fill="#A1A9BA" text-anchor="middle">SATELLITE / DRONE UPLINK SIMULATION</text>
      <path d="M 0 0 L 800 600 M 800 0 L 0 600" stroke="#1A2235" stroke-width="2"/>
    </svg>`;
    const blob = new Blob([svg], {type: 'image/svg+xml'});
    setPreviewUrl(URL.createObjectURL(blob));
  };

  const runAnalysis = () => {
    if (!imageSrc) return;
    setIsAnalyzing(true);
    setResults(null);
    
    // Simulate deterministic network delay
    analysisTimerRef.current = setTimeout(() => {
      setIsAnalyzing(false);
      setResults({
        detections: [
          { label: 'Flooded road', confidence: 94 },
          { label: 'Damaged structure', confidence: 87 },
          { label: 'Person detected', confidence: 91 },
          { label: 'Vehicle detected', confidence: 89 },
          { label: 'Debris', confidence: 84 },
        ],
        hazards: ['Active water current', 'Unstable foundation', 'Exposed electrical'],
        severity: 8.5,
        zone: 'Sector 7 - Alpha',
        response: 'Immediate water rescue dispatch required. Deploy Swift Water Team 2. Isolate power grid in Sector 7.'
      });
      analysisTimerRef.current = null;
    }, 2500);
  };

  return (
    <div className="min-h-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-mono-ui flex items-center text-foreground">
            <ScanSearch className="w-6 h-6 mr-3 text-primary" />
            AI IMAGE ANALYSIS
          </h1>
          <div className="text-sm text-muted-foreground mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
            <Badge variant="outline" className="text-[10px] font-mono-ui border-primary text-primary bg-primary/10 w-fit">
              SIMULATED CV MODULE
            </Badge>
            <span>Deterministic vision pipeline for hazard assessment. No external vision model or LLM is connected.</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 lg:min-h-0 pb-6 lg:pb-0">
        
        {/* Left Col: Upload & Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4 h-[500px] lg:h-auto">
          <div className="border border-border bg-card rounded-md shadow-sm flex flex-col flex-1 min-h-[400px]">
            <div className="p-3 border-b border-border bg-secondary/30 flex justify-between items-center shrink-0">
              <span className="font-mono-ui text-sm font-bold flex items-center">
                <Camera className="w-4 h-4 mr-2 text-primary" /> UPLINK_PREVIEW
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[10px] sm:text-xs font-mono-ui" onClick={() => selectScenario('Flood Survey')}>
                  LOAD SCENARIO
                </Button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <Button size="sm" className="h-8 text-[10px] sm:text-xs font-mono-ui gap-1 sm:gap-2" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="w-3 h-3" /> <span className="hidden sm:inline">UPLOAD FILE</span>
                </Button>
              </div>
            </div>
            
            <div className="flex-1 bg-background/50 relative overflow-hidden flex items-center justify-center p-4 min-h-0">
              {!imageSrc ? (
                <div className="text-center text-muted-foreground flex flex-col items-center">
                  <Layers className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-mono-ui text-sm">AWAITING VISUAL TELEMETRY...</p>
                  <p className="text-xs mt-2 opacity-70">Upload a local image or load a scenario.</p>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={imageSrc} alt="Preview" className="max-w-full max-h-full object-contain rounded border border-border shadow-lg" />
                  
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center rounded">
                      <ScanSearch className="w-12 h-12 text-primary animate-ping mb-4" />
                      <div className="font-mono-ui text-primary font-bold tracking-widest text-sm">
                        ANALYZING VECTORS...
                      </div>
                      <div className="w-48 h-1 bg-secondary mt-4 overflow-hidden rounded-full">
                        <div className="h-full bg-primary animate-pulse w-full origin-left" style={{ animationDuration: '1s' }} />
                      </div>
                    </div>
                  )}

                  {results && !isAnalyzing && (
                    <div className="absolute inset-0 pointer-events-none border-2 border-primary/50 rounded z-10 p-4">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-border bg-secondary/10 shrink-0">
              <Button 
                onClick={runAnalysis} 
                disabled={!imageSrc || isAnalyzing}
                className="w-full font-mono-ui font-bold tracking-wider"
                size="lg"
              >
                {isAnalyzing ? 'PROCESSING...' : 'EXECUTE DETERMINISTIC ANALYSIS'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Col: Results */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="border border-border bg-card rounded-md shadow-sm flex-1 flex flex-col overflow-hidden min-h-[400px]">
            <div className="p-3 border-b border-border bg-secondary/30 shrink-0">
              <span className="font-mono-ui text-sm font-bold flex items-center">
                <Activity className="w-4 h-4 mr-2 text-primary" /> ANALYSIS_OUTPUT
              </span>
            </div>
            
            <div className="flex-1 overflow-auto p-4">
              {!results && !isAnalyzing ? (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                  <Target className="w-12 h-12 mb-4" />
                  <span className="font-mono-ui text-xs">STANDING BY</span>
                </div>
              ) : isAnalyzing ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </div>
              ) : results ? (
                <div className="animate-in slide-in-from-right-4 fade-in duration-300 space-y-6">
                  
                  <div>
                    <h4 className="text-[10px] font-mono-ui text-muted-foreground mb-3 flex items-center">
                      <Crosshair className="w-3 h-3 mr-1 text-primary" /> OBJECT_DETECTIONS
                    </h4>
                    <div className="space-y-2">
                      {results.detections.map((det) => (
                        <div key={det.label} className="flex items-center justify-between text-sm bg-secondary/20 p-2.5 rounded border border-border">
                          <span className="font-medium text-foreground">{det.label}</span>
                          <span className="font-mono-ui text-primary font-bold">{det.confidence}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-mono-ui text-muted-foreground mb-3 flex items-center">
                      <AlertTriangle className="w-3 h-3 mr-1 text-destructive" /> IDENTIFIED_HAZARDS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {results.hazards.map((hazard) => (
                        <Badge key={hazard} variant="destructive" className="bg-destructive/10 text-destructive border-destructive/30 text-xs">
                          {hazard}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/20 p-3 rounded border border-border">
                      <div className="text-[10px] font-mono-ui text-muted-foreground mb-1">EST. SEVERITY</div>
                      <div className="text-xl font-bold text-high">{results.severity} / 10</div>
                    </div>
                    <div className="bg-secondary/20 p-3 rounded border border-border">
                      <div className="text-[10px] font-mono-ui text-muted-foreground mb-1">RESCUE ZONE</div>
                      <div className="text-sm font-bold text-foreground mt-1">{results.zone}</div>
                    </div>
                  </div>

                  <div className="bg-primary/5 p-4 rounded border border-primary/30">
                    <h4 className="text-[10px] font-mono-ui text-primary mb-2 flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> RECOMMENDED_RESPONSE
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {results.response}
                    </p>
                  </div>
                  
                </div>
              ) : null}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
