'use client';

import { useState, useEffect } from 'react';
import { Database, Link2, Search, Play, CheckCircle2, AlertCircle, Loader2, Download, Terminal, UploadCloud, Globe, BrainCircuit, X } from 'lucide-react';

export default function VIPScrapeData() {
  const [url, setUrl] = useState('https://gjepc.org/iijs-premiere/exhibitor-list.php');
  const [rawText, setRawText] = useState('7R JEWELS\nA GEMAWAT & SONS\nA.B. GEMS\nAADEY JEWELS\nAADISH GOLD LLP');
  const [isScraping, setIsScraping] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [extractedData, setExtractedData] = useState<any[]>([]);
  const [totalTargets, setTotalTargets] = useState(0);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Modal State for row detail logo popup
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [isAskingGemini, setIsAskingGemini] = useState(false);
  const [manualInsta, setManualInsta] = useState('');

  const handleAskGeminiForInsta = async () => {
    if (!selectedBrand) return;
    setIsAskingGemini(true);
    try {
      const res = await fetch('http://localhost:5055/api/osint/logo-and-insta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: selectedBrand.company,
          logo: selectedBrand.logo,
          city: selectedBrand.city
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedBrand((prev: any) => ({ ...prev, logo: data.logo, insta: data.insta }));
        setManualInsta(data.insta);
        
        // Also update the brand in the main list
        setExtractedData(prev => prev.map(d => 
          d.company === selectedBrand.company 
            ? { ...d, logo: data.logo, insta: data.insta, status: 'Extracted' } 
            : d
        ));
      } else {
        alert("Failed to get Instagram handle: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error querying Gemini.");
    } finally {
      setIsAskingGemini(false);
    }
  };

  const handleSaveModalChanges = () => {
    if (!selectedBrand) return;
    setExtractedData(prev => prev.map(d => 
      d.company === selectedBrand.company 
        ? { ...d, insta: manualInsta.replace('@', '').trim() } 
        : d
    ));
    setSelectedBrand(null);
  };

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('vipScraperData');
    if (savedData) {
      try {
        setExtractedData(JSON.parse(savedData));
      } catch (e) {}
    }
    const savedLogs = localStorage.getItem('vipScraperLogs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (extractedData.length > 0) {
      localStorage.setItem('vipScraperData', JSON.stringify(extractedData));
    }
  }, [extractedData]);

  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem('vipScraperLogs', JSON.stringify(logs));
    }
  }, [logs]);

  const handleRestoreSaved = () => {
    const savedData = localStorage.getItem('vipScraperData');
    if (savedData) {
      try {
        setExtractedData(JSON.parse(savedData));
      } catch (e) {}
    }
    const savedLogs = localStorage.getItem('vipScraperLogs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {}
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data and logs?")) {
      setExtractedData([]);
      setLogs([]);
      setRawText('');
      localStorage.removeItem('vipScraperData');
      localStorage.removeItem('vipScraperLogs');
    }
  };

  const handleSyncFromLocal = async () => {
    setIsScraping(true);
    setLogs(prev => [...prev, '[SYSTEM] Syncing with locally analyzed logos database...']);
    try {
      const res = await fetch('http://localhost:5055/api/osint/load-analyzed-logos');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Create lookup map by normalized company name
        const lookup = new Map();
        data.data.forEach((item: any) => {
          const key = item.company.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          lookup.set(key, item);
        });

        setExtractedData(prev => {
          // 1. Update existing matching rows, preserving other fields
          const updated = prev.map(row => {
            const key = row.company.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            const match = lookup.get(key);
            if (match) {
              return {
                ...row,
                logo: match.logo,
                insta: match.insta,
                status: match.insta && match.insta !== 'Not Found' ? 'Extracted' : row.status
              };
            }
            return row;
          });

          return updated;
        });

        setLogs(prev => [...prev, `[SYSTEM] Successfully mapped logos to ${data.data.length} records from local database!`]);
      } else {
        alert('Failed to load analyzed logos: ' + (data.error || 'Invalid response format'));
      }
    } catch (err: any) {
      console.error(err);
      alert('Network error syncing: ' + err.message);
    } finally {
      setIsScraping(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target?.result as string;
      if (!csvData) return;

      const lines = csvData.split('\n');
      if (lines.length < 2) return;

      const parsedData = [];
      // Skip header, assuming: Company Name,Location,Instagram,Email,Phone,Status
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Basic CSV parsing handling quotes
        const values = [];
        let inQuotes = false;
        let currentValue = '';
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          if (char === '"' && line[j+1] === '"') {
            currentValue += '"'; // escaped quote
            j++;
          } else if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            values.push(currentValue);
            currentValue = '';
          } else {
            currentValue += char;
          }
        }
        values.push(currentValue);

        if (values.length >= 6) {
          const hasOwner = values.length >= 7;
          parsedData.push({
            company: values[0],
            city: values[1],
            owner: hasOwner ? values[2] : 'Pending AI',
            insta: hasOwner ? values[3] : values[2],
            email: hasOwner ? values[4] : values[3],
            phone: hasOwner ? values[5] : values[4],
            status: hasOwner ? values[6] : values[5]
          });
        }
      }

      setExtractedData(parsedData);
      setTotalTargets(parsedData.length);
      setLogs(prev => [...prev, `[SYSTEM] Uploaded ${parsedData.length} leads from CSV.`]);
    };
    reader.readAsText(file);
    // clear input
    e.target.value = '';
  };

  const handleStop = () => {
    if (abortController) {
      abortController.abort();
      setLogs(prev => [...prev, '[SYSTEM] Abort signal sent. Halting extraction...']);
      setIsScraping(false);
    }
  };

  const handleScrape = async () => {
    if (!rawText.trim()) return;
    setIsScraping(true);
    setLogs(['[SYSTEM] Initializing parallel OSINT extraction engine...']);
    setExtractedData([]);

    let companies: any[] = [];
    
    // Check if the user pasted HTML from GJEPC
    if (rawText.includes('data-name="') || rawText.includes('<table')) {
      setLogs(prev => [...prev, '[DOM] Detected raw HTML table structure. Parsing data attributes & locations...']);
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(rawText, 'text/html');
      const rows = doc.querySelectorAll('tr[data-name]');
      
      const uniqueNames = new Set();
      rows.forEach(row => {
          const name = row.getAttribute('data-name');
          if (name && !uniqueNames.has(name)) {
            uniqueNames.add(name);
            const cityTd = row.querySelector('td[data-column="City"]') || row.querySelector('td:nth-child(5)');
            const city = cityTd ? (cityTd.textContent || '').trim() : '';
            companies.push({ name: name.trim(), city });
          }
      });
    } else {
      // Handle plain text line-by-line
      companies = rawText.split('\n').map(c => c.trim()).filter(c => c).map(name => ({ name, city: '' }));
    }

    if (companies.length === 0) {
      setLogs(prev => [...prev, '[ERROR] No company names found in input.']);
      setIsScraping(false);
      return;
    }

    setLogs(prev => [...prev, `[SYSTEM] Target acquired: ${companies.length} companies to process.`]);
    setTotalTargets(companies.length);
    
    // Pre-populate the table
    setExtractedData(companies.map(c => ({
      company: c.name || c,
      city: c.city || '',
      owner: 'Pending AI',
      insta: 'Pending AI',
      email: 'Pending AI',
      phone: 'Pending AI',
      status: 'Pending AI'
    })));
  };

  const handleDeepScrape = async () => {
    if (!url) return;
    setIsScraping(true);
    setLogs(['[SYSTEM] Initializing Headless Browser Cluster...']);
    setExtractedData([]);

    try {
      setLogs(prev => [...prev, `[PUPPETEER] Navigating to ${url}`]);
      setLogs(prev => [...prev, '[PUPPETEER] Bypassing DataTables pagination automatically...']);

      const res = await fetch('http://localhost:5055/api/osint/deep-scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      const json = await res.json();
      
      if (json.success && json.companies) {
        setLogs(prev => [...prev, `[SYSTEM] Deep scrape finished! Found ${json.companies.length} unique companies.`]);
        setTotalTargets(json.companies.length);
        
        // Pre-populate the table
        setExtractedData(json.companies.map((c: any) => ({
          company: c.name || c,
          city: c.city || '',
          owner: 'Pending AI',
          insta: 'Pending AI',
          email: 'Pending AI',
          phone: 'Pending AI',
          status: 'Pending AI'
        })));
      } else {
        setLogs(prev => [...prev, `[ERROR] Deep scrape failed: ${json.error}`]);
        setIsScraping(false);
      }
    } catch (err) {
      setLogs(prev => [...prev, '[ERROR] Network connection failed.']);
    } finally {
      setIsScraping(false);
    }
  };

  const handleEnrichWithAI = async () => {
    const pending = extractedData.filter(d => d.status === 'Pending AI');
    if (pending.length === 0) {
      alert("No pending companies to enrich!");
      return;
    }
    
    // Map them back to the {name, city} structure the backend expects
    const companiesToProcess = pending.map(d => ({ name: d.company, city: d.city }));
    await processCompanies(companiesToProcess);
  };

  const processCompanies = async (companiesToProcess: any[], mode?: string) => {
    const controller = new AbortController();
    setAbortController(controller);
    setIsScraping(true);

    try {
      setLogs(prev => [...prev, '[SCRAPER] Launching multi-threaded OSINT bots...']);
      
      const res = await fetch('http://localhost:5055/api/osint/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ companies: companiesToProcess, mode }),
        signal: controller.signal
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }
      
      if (!res.body) throw new Error("No readable stream available");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;
      let buffer = '';
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          
          // The last element might be an incomplete JSON string chunk, so keep it in the buffer for the next read
          buffer = lines.pop() || ''; 
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            try {
              const event = JSON.parse(trimmedLine);
              if (event.type === 'log' || event.type === 'done' || event.type === 'error') {
                setLogs(prev => [...prev, event.message]);
              } else if (event.type === 'data') {
                // Update the matching row (case+trim insensitive match)
                setExtractedData(prev => {
                  const normalize = (s: string) => (s || '').trim().toLowerCase();
                  const matched = prev.some(row => normalize(row.company) === normalize(event.data.company));
                  if (!matched) {
                    // No match found — append as a new row
                    return [...prev, { ...event.data, status: 'Extracted' }];
                  }
                  return prev.map(row =>
                    normalize(row.company) === normalize(event.data.company)
                      ? { ...row, owner: event.data.owner, insta: event.data.insta, email: event.data.email, phone: event.data.phone, status: 'Extracted' }
                      : row
                  );
                });
              }
            } catch (e) {
              if (trimmedLine.length > 2) {
                console.warn("Stream parse error:", trimmedLine.substring(0, 100));
              }
            }
          }
        }
      }
      
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setLogs(prev => [...prev, '[SYSTEM] Extraction forcefully aborted by user.']);
      } else {
        setLogs(prev => [...prev, '[ERROR] Network connection failed or OSINT server is down.']);
      }
    } finally {
      setIsScraping(false);
      setAbortController(null);
    }
  };

  const handlePushToVIP = async () => {
    const hasValue = (val: string | null) => val && val !== 'Not Found' && val !== 'Pending AI' && val !== '-';
    const validLeads = extractedData.filter(d => 
      hasValue(d.insta) || hasValue(d.email) || hasValue(d.phone)
    );
    if (validLeads.length === 0) {
      alert("No valid contact information (Instagram, Email, or Phone) found to push.");
      return;
    }
    
    if (!confirm(`Are you sure you want to push ${validLeads.length} leads to the VIP pipeline? This will process them one by one in the background.`)) return;

    setIsScraping(true);
    setLogs(prev => [...prev, `[SYSTEM] Pushing ${validLeads.length} leads to VIP Pipeline...`]);
    
    try {
      const payload = validLeads.map(lead => ({
          instagram_id: lead.insta.replace('@', ''),
          scraped_email: lead.email,
          scraped_phone: lead.phone,
          scraped_brand: lead.company
      }));

      const response = await fetch('http://localhost:5055/api/vip/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates: payload })
      });
      
      if (response.ok) {
         setLogs(prev => [...prev, `[SYSTEM] Successfully pushed all ${validLeads.length} leads to the background worker!`]);
         setExtractedData(prev => prev.filter(d => !validLeads.includes(d)));
         alert(`Success! ${validLeads.length} leads have been pushed and are processing in the background.`);
      } else {
         const rawText = await response.text();
         let result = { error: rawText };
         try { result = JSON.parse(rawText); } catch(e) {}
         setLogs(prev => [...prev, `[ERROR] Push failed: ${result.error}`]);
      }
    } catch (err: any) {
      setLogs(prev => [...prev, `[ERROR] Network error: ${err.message}`]);
    }
    
    setIsScraping(false);
  };

  const handleRetryFallbacks = () => {
    let count = 0;
    setExtractedData(prev => prev.map(d => {
      const hasFallbackEmail = d.email && d.email.startsWith('info@');
      const hasNoPhone = !d.phone || d.phone === 'Not Found' || d.phone === 'Pending AI';
      const isBadInsta = typeof d.insta === 'string' && (d.insta.includes('.com') || d.insta.includes('.in') || d.insta.includes('.net') || d.insta.includes('.org') || d.insta.includes('.co') || d.insta.includes(' '));
      const hasNoInsta = !d.insta || d.insta === 'Not Found' || d.insta === 'Pending AI' || isBadInsta;

      if ((hasFallbackEmail || hasNoPhone || hasNoInsta) && d.status === 'Extracted') {
        count++;
        return { ...d, status: 'Pending AI', email: 'Pending AI', insta: 'Pending AI', phone: 'Pending AI', owner: 'Pending AI' };
      }
      return d;
    }));
    if (count > 0) {
      setLogs(prev => [...prev, `[SYSTEM] Re-queued ${count} broken leads for re-extraction.`]);
    } else {
      alert("No broken leads found to retry.");
    }
  };

  const handleInstaScrape = async () => {
    const pending = extractedData.filter(d => {
      const isBadInsta = typeof d.insta === 'string' && (d.insta.includes('.com') || d.insta.includes('.in') || d.insta.includes('.net') || d.insta.includes('.org') || d.insta.includes('.co') || d.insta.includes(' '));
      const hasNoInsta = !d.insta || d.insta === 'Not Found' || d.insta === 'Pending AI' || isBadInsta;
      return hasNoInsta;
    });

    if (pending.length === 0) {
      alert("No missing Instagram handles found to scrape.");
      return;
    }

    setExtractedData(prev => prev.map(d => pending.find(p => p.company === d.company) ? { ...d, status: 'Pending AI', insta: 'Pending AI' } : d));
    
    setLogs(prev => [...prev, `[SYSTEM] Launching ${pending.length} leads for Instagram-only extraction...`]);
    const companiesToProcess = pending.map(d => ({ name: d.company, city: d.city, mode: 'insta-only' }));
    await processCompanies(companiesToProcess, 'insta-only');
  };

  const handleExportCSV = () => {
    if (extractedData.length === 0) return;
    
    // Define headers
    const headers = ['Company Name', 'Location', 'Owner', 'Instagram', 'Email', 'Phone', 'Status'];
    
    // Helper to safely escape CSV fields
    const escapeCsv = (val: string) => {
      if (!val) return '""';
      const str = String(val).replace(/"/g, '""'); // Escape inner quotes
      return `"${str}"`; // Wrap in quotes
    };

    const generateCsvString = (dataList: any[]) => {
      return [
        headers.join(','),
        ...dataList.map(d => [
          escapeCsv(d.company),
          escapeCsv(d.city),
          escapeCsv(d.owner),
          escapeCsv(d.insta),
          escapeCsv(d.email),
          escapeCsv(d.phone),
          escapeCsv(d.status)
        ].join(','))
      ].join('\n');
    };
    
    // Separate data into Successful and Missing
    const successfulLeads = extractedData.filter(d => 
      d.email !== 'Not Found' && !d.email?.startsWith('info@') &&
      d.phone !== 'Not Found' && 
      d.insta !== 'Not Found' &&
      d.status === 'Extracted'
    );

    const missingLeads = extractedData.filter(d => 
      d.email === 'Not Found' || d.email?.startsWith('info@') ||
      d.phone === 'Not Found' || 
      d.insta === 'Not Found' ||
      d.status !== 'Extracted'
    );
    
    const downloadCsv = (dataRows: any[], filename: string) => {
      if (dataRows.length === 0) return;
      const rows = dataRows.map(d => [
        escapeCsv(d.company),
        escapeCsv(d.city),
        escapeCsv(d.owner),
        escapeCsv(d.insta),
        escapeCsv(d.email),
        escapeCsv(d.phone),
        escapeCsv(d.status)
      ]);
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const dateStr = new Date().toISOString().split('T')[0];
    if (successfulLeads.length > 0) downloadCsv(successfulLeads, `VIP_Leads_Successful_${dateStr}.csv`);
    if (missingLeads.length > 0) downloadCsv(missingLeads, `VIP_Leads_MissingInfo_${dateStr}.csv`);
  };

  return (
    <div className="font-sans animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-display font-bold flex items-center gap-4 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
          <Database className="text-amber-400 size-10" />
          Data Scraping Engine
        </h1>
        <p className="text-white/40 mt-3 text-sm tracking-widest uppercase">
          Extract VIP Leads from Directories & Exhibitor Lists
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input & Terminal Area */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none" />
            
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <Link2 className="size-5 text-amber-400" />
              Target Source URL
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-xs uppercase tracking-widest text-white/40 mb-2 block">Exhibitor Source (Paste Raw HTML or Text)</label>
                <textarea 
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors resize-none"
                  placeholder='Paste plain text names OR raw HTML (e.g. <tr data-name="7R JEWELS"...>)'
                />
              </div>
              
              <div className="flex gap-4">
                <button 
                  onClick={handleScrape}
                  disabled={isScraping || !rawText}
                  className="flex-1 py-4 rounded-xl border border-amber-500/50 text-amber-500 font-bold flex items-center justify-center gap-2 hover:bg-amber-500/10 disabled:opacity-50 transition-all"
                >
                  <Play className="size-5" /> Parse Text
                </button>

                <button 
                  onClick={handleDeepScrape}
                  disabled={isScraping || !url}
                  className="flex-1 py-4 rounded-xl bg-amber-500 text-black font-bold flex items-center justify-center gap-2 hover:bg-amber-400 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                >
                  {isScraping ? (
                    <><Loader2 className="size-5 animate-spin" /> Extracting...</>
                  ) : (
                    <><Globe className="size-5 fill-black" /> Deep Auto-Scrape URL</>
                  )}
                </button>
              </div>

              <div className="flex gap-4 mt-2">
                <button 
                  onClick={handleRestoreSaved}
                  disabled={isScraping}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-white/70 font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                >
                  <Database className="size-4" /> Restore Saved File
                </button>

                <label className={`flex-1 py-3 rounded-xl border border-white/10 text-white/70 font-semibold flex items-center justify-center gap-2 transition-all ${isScraping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`}>
                  <UploadCloud className="size-4" /> Upload CSV
                  <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} disabled={isScraping} />
                </label>

                <button 
                  onClick={handleClearAll}
                  disabled={isScraping}
                  className="flex-1 py-3 rounded-xl border border-red-500/20 text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all"
                >
                  <X className="size-4" /> Clear All
                </button>
              </div>

              {isScraping && (
                <button 
                  onClick={handleStop}
                  className="w-full mt-2 py-3 rounded-xl border border-red-500/50 text-red-400 font-bold flex items-center justify-center gap-2 hover:bg-red-500/10 transition-all"
                >
                  <AlertCircle className="size-5" /> Stop Extraction
                </button>
              )}
            </div>
          </div>

          {/* Terminal / Live Logs */}
          <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
                <Terminal className="size-4" /> Live Extraction Logs
              </h3>
              {isScraping && <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />}
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 font-mono text-xs mb-4">
              {logs.length === 0 && !isScraping && (
                <p className="text-white/20 italic">Awaiting target execution...</p>
              )}
              {logs.map((log, i) => {
                if (!log) return null;
                return (
                  <div key={i} className={`
                    ${log.includes('[ERROR]') ? 'text-red-400' : ''}
                    ${log.includes('[SYSTEM]') ? 'text-blue-400' : ''}
                    ${log.includes('[SCRAPER]') ? 'text-amber-400' : ''}
                    ${log.includes('[DOM]') ? 'text-purple-400' : ''}
                    ${log.includes('[OSINT]') ? 'text-emerald-400' : ''}
                    ${log.includes('[THREAD') ? 'text-cyan-400' : ''}
                    ${log.includes('[EXTRACT]') ? 'text-pink-400' : ''}
                    ${!log.includes('[') ? 'text-white/60' : ''}
                  `}>
                    <span className="text-white/20 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                    {log}
                  </div>
                );
              })}
            </div>

            {/* Progress Bar */}
            {(totalTargets > 0) && (
              <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/60 font-medium">Extraction Progress</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {extractedData.filter(d => d.status === 'Extracted').length} / {totalTargets} ({Math.round((extractedData.filter(d => d.status === 'Extracted').length / totalTargets) * 100)}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 ease-out relative"
                    style={{ width: `${Math.min((extractedData.filter(d => d.status === 'Extracted').length / totalTargets) * 100, 100)}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden h-full flex flex-col">
            <div className="p-6 md:p-8 border-b border-white/[0.05] flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="size-5 text-amber-400" />
                Extracted VIP Leads
              </h3>
              <div className="flex gap-2">
                <span className="text-xs bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20 font-medium">
                  {extractedData.length} Records Found
                </span>
              </div>
            </div>

            <div className="flex-1 p-0 overflow-x-auto">
              {extractedData.length === 0 ? (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-white/40 p-12 text-center">
                  <Database className="size-16 text-white/10 mb-4" />
                  <p>Run the scraper to populate data.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-black/40 text-white/40 uppercase tracking-wider text-[10px] border-b border-white/[0.05]">
                    <tr>
                      <th className="px-8 py-4 font-medium">Logo</th>
                      <th className="px-8 py-4 font-medium">Company Name</th>
                      <th className="px-8 py-4 font-medium">Location</th>
                      <th className="px-8 py-4 font-medium">Owner</th>
                      <th className="px-8 py-4 font-medium">Contact Details</th>
                      <th className="px-8 py-4 font-medium">Instagram ID</th>
                      <th className="px-8 py-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.02]">
                    {extractedData.map((data, i) => (
                      <tr 
                        key={i} 
                        onClick={() => {
                          setSelectedBrand(data);
                          setManualInsta(data.insta && data.insta !== 'Pending AI' && data.insta !== 'Not Found' ? `@${data.insta.replace('@', '')}` : '');
                        }}
                        className="hover:bg-white/[0.04] cursor-pointer transition-colors"
                      >
                        <td className="px-8 py-5">
                          {data.logo ? (
                            <img 
                              src={data.logo.startsWith('/') ? `http://localhost:5055${data.logo}` : data.logo}
                              alt="Logo"
                              className="w-10 h-10 object-contain rounded border border-white/10 bg-white/5"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-[10px] text-white/20">
                              No Logo
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-5 font-semibold text-white">{data.company}</td>
                        <td className="px-8 py-5 text-white/60 text-xs">{data.city || '-'}</td>
                        <td className="px-8 py-5 text-amber-400/80 font-medium text-xs">{data.owner && data.owner !== 'Pending AI' ? data.owner : '-'}</td>
                        <td className="px-8 py-5">
                          <div className="text-white/80 whitespace-normal break-words max-w-[250px]">{data.email}</div>
                          <div className="text-white/40 text-xs mt-1 whitespace-normal break-words max-w-[250px]">{data.phone}</div>
                        </td>
                        <td className="px-8 py-5 text-amber-400 font-mono text-xs">
                          {data.insta === 'Pending AI' ? <span className="text-white/30 italic text-xs"></span> : (data.insta === 'Not Found' ? <span className="text-white/30 text-xs">-</span> : `@${data.insta.replace('@', '')}`)}
                        </td>
                        <td className="px-8 py-5">
                          {data.status === 'Extracted' ? (
                            <span className="flex items-center gap-1 text-emerald-400 text-xs">
                              <CheckCircle2 className="size-3" /> Extracted
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-400/70 text-xs">
                              <Loader2 className="size-3 animate-spin" /> Pending AI
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {extractedData.length > 0 && (
              <div className="p-6 border-t border-white/[0.05] bg-black/20 flex gap-4 flex-wrap">
                <button 
                  onClick={handleExportCSV}
                  className="flex-1 min-w-[150px] py-4 rounded-xl border border-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors"
                >
                  <Download className="size-5" /> Export to CSV
                </button>
                <button 
                  onClick={handleSyncFromLocal}
                  disabled={isScraping}
                  className="flex-1 min-w-[150px] py-4 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold flex items-center justify-center gap-2 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                >
                  <BrainCircuit className="size-5" /> Sync from Local JSON
                </button>
                <button 
                  onClick={handleRetryFallbacks}
                  disabled={isScraping}
                  className="flex-1 min-w-[150px] py-4 rounded-xl border border-amber-500/50 text-amber-500 font-semibold flex items-center justify-center gap-2 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
                >
                  <Search className="size-5" /> Retry Fallbacks
                </button>
                <button 
                  onClick={handleEnrichWithAI}
                  disabled={isScraping || extractedData.filter(d => d.status === 'Pending AI').length === 0}
                  className={`flex-1 min-w-[200px] py-4 rounded-xl text-black font-bold flex items-center justify-center gap-2 transition-all ${isScraping || extractedData.filter(d => d.status === 'Pending AI').length === 0 ? 'bg-amber-500/50 cursor-not-allowed opacity-50' : 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'}`}
                >
                  <BrainCircuit className="size-5" /> Enrich {extractedData.filter(d => d.status === 'Pending AI').length} Leads
                </button>
                <button 
                  onClick={handleInstaScrape}
                  disabled={isScraping}
                  className="flex-1 min-w-[150px] py-4 rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/20 font-bold flex items-center justify-center gap-2 hover:bg-pink-500/20 transition-all disabled:opacity-50"
                >
                  <Search className="size-5" /> Insta Scrape
                </button>
                <button 
                  onClick={handlePushToVIP}
                  className="flex-1 min-w-[200px] py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <UploadCloud className="size-5" /> Push to VIP Pipeline
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Brand Detail Modal Popup */}
      {selectedBrand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-[#0f0f15] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-black/40">
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                {selectedBrand.company}
              </h3>
              <button 
                onClick={() => setSelectedBrand(null)}
                className="p-2 rounded-lg hover:bg-white/5 text-white/50 hover:text-white transition-colors"
              >
                <X className="size-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-8">
                {/* Logo Section */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 border border-white/5 bg-black/20 rounded-2xl">
                  <span className="text-xs uppercase tracking-widest text-white/40 mb-4 block">Captured Logo</span>
                  {selectedBrand.logo ? (
                    <img 
                      src={selectedBrand.logo.startsWith('/') ? `http://localhost:5055${selectedBrand.logo}` : selectedBrand.logo}
                      alt="Brand Logo"
                      className="max-h-48 max-w-full object-contain rounded-xl shadow-lg bg-white/5 border border-white/10 p-2"
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-xl border border-dashed border-white/10 bg-white/5 flex items-center justify-center text-white/20 text-center p-4">
                      No logo captured yet. Run scraper to gather logos automatically.
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Location</label>
                    <div className="text-white font-medium">{selectedBrand.city || 'Not Specified'}</div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-widest text-white/40 mb-1.5 block">Instagram Handle</label>
                    <input 
                      type="text"
                      value={manualInsta}
                      onChange={(e) => setManualInsta(e.target.value)}
                      placeholder="@handle"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400/50 transition-colors"
                    />
                  </div>

                  <button
                    onClick={handleAskGeminiForInsta}
                    disabled={isAskingGemini}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                  >
                    {isAskingGemini ? (
                      <>
                        <Loader2 className="animate-spin size-5" />
                        Asking Gemini...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="size-5" />
                        Ask Gemini for Insta
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-4">
              <button 
                onClick={() => setSelectedBrand(null)}
                className="px-6 py-3 rounded-xl border border-white/10 text-white/70 font-semibold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveModalChanges}
                className="px-6 py-3 rounded-xl bg-amber-500 text-black font-bold hover:bg-amber-400 transition-all"
              >
                Save Handle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
