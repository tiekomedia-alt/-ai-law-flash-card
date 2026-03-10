import React, { useState, useRef } from 'react';
import { ArrowLeft, Users, ChevronUp, ChevronDown, Plus, X, Minus, Zap, CheckCircle2, Copy, Download, RefreshCw, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoreApp() {
  const [players, setPlayers] = useState<string[]>(['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn', 'Jamie', 'Drew', 'Avery', 'Cameron']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [numTeams, setNumTeams] = useState(3);
  const [teams, setTeams] = useState<string[][]>([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [serialNumber, setSerialNumber] = useState('');
  const [isSquadExpanded, setIsSquadExpanded] = useState(true);

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (nameToRemove: string) => {
    setPlayers(players.filter(name => name !== nameToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const generateSerialNumber = () => {
    const date = new Date();
    const yymmdd = `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TS-${yymmdd}-${randomStr}`;
  };

  const shuffleTeams = () => {
    if (players.length === 0 || numTeams <= 0) return;
    
    // Fisher-Yates shuffle
    const shuffledPlayers = [...players];
    for (let i = shuffledPlayers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
    }

    // Distribute into teams
    const newTeams: string[][] = Array.from({ length: numTeams }, () => []);
    shuffledPlayers.forEach((player, index) => {
      newTeams[index % numTeams].push(player);
    });

    setTeams(newTeams);
    setShuffleCount(prev => prev + 1);
    setSerialNumber(generateSerialNumber());
    setIsSquadExpanded(false);
  };

  const teamColors = [
    { bg: 'bg-blue-500', hex: '#3b82f6', icon: '🔵', name: 'Team A' },
    { bg: 'bg-orange-500', hex: '#f97316', icon: '🟠', name: 'Team B' },
    { bg: 'bg-green-500', hex: '#22c55e', icon: '🟢', name: 'Team C' },
    { bg: 'bg-purple-500', hex: '#a855f7', icon: '🟣', name: 'Team D' },
    { bg: 'bg-pink-500', hex: '#ec4899', icon: '🔴', name: 'Team E' },
  ];

  const downloadTeamCard = (teamIndex: number) => {
    const team = teams[teamIndex];
    const colorConfig = teamColors[teamIndex % teamColors.length];
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (high resolution for crisp text)
    const width = 800;
    const height = 1000;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, width, height);

    // Top color bar
    ctx.fillStyle = colorConfig.hex;
    ctx.fillRect(0, 0, width, 20);

    // Header (Team Name)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Lexend, sans-serif';
    ctx.fillText(`${colorConfig.icon} ${colorConfig.name}`, 60, 120);

    // Player Count Subtitle
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = 'bold 24px Lexend, sans-serif';
    ctx.fillText(`${team.length} PLAYERS`, 60, 170);

    // Divider
    ctx.strokeStyle = '#334155'; // slate-700
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 210);
    ctx.lineTo(width - 60, 210);
    ctx.stroke();

    // Players List
    let yPos = 280;
    team.forEach((player, i) => {
      ctx.fillStyle = '#94a3b8'; // slate-400
      ctx.font = 'bold 36px Lexend, sans-serif';
      ctx.fillText(`${i + 1}.`, 60, yPos);
      
      ctx.fillStyle = '#f8fafc'; // slate-50
      ctx.font = '500 36px Lexend, sans-serif';
      ctx.fillText(player, 120, yPos);
      
      // Line separator
      if (i < team.length - 1) {
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(60, yPos + 30);
        ctx.lineTo(width - 60, yPos + 30);
        ctx.stroke();
      }
      
      yPos += 90;
    });

    // Footer Background
    ctx.fillStyle = '#0f172a'; // slate-900
    ctx.fillRect(0, height - 160, width, 160);

    // Footer Branding
    ctx.fillStyle = '#dc2626'; // accent
    ctx.font = 'bold 32px Lexend, sans-serif';
    ctx.fillText('TeamShuffle', 60, height - 90);

    // Footer Details
    ctx.fillStyle = '#94a3b8'; // slate-400
    ctx.font = '20px Lexend, sans-serif';
    ctx.fillText(`Serial: ${serialNumber}`, 60, height - 50);
    
    const dateStr = new Date().toLocaleString();
    ctx.textAlign = 'right';
    ctx.fillText(`Shuffle #${shuffleCount} • ${dateStr}`, width - 60, height - 50);

    // Trigger download
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `TeamShuffle-${colorConfig.name.replace(' ', '')}-${serialNumber}.png`;
    link.href = dataUrl;
    link.click();
  };

  const shareToWhatsApp = () => {
    let text = `*TeamShuffle Results* (Shuffle #${shuffleCount})\nSerial: ${serialNumber}\n\n`;
    
    teams.forEach((team, index) => {
      const colorConfig = teamColors[index % teamColors.length];
      text += `*${colorConfig.icon} ${colorConfig.name}*\n`;
      team.forEach((player, i) => {
        text += `${i + 1}. ${player}\n`;
      });
      text += '\n';
    });
    
    text += `Verify at: ${window.location.origin}/verify`;
    
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#14171e] text-slate-100 font-display pb-24">
      {/* Top Bar */}
      <nav className="sticky top-0 z-50 bg-[#14171e]/80 backdrop-blur-md border-b border-[#192643]/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="cursor-pointer hover:text-[#192643] transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="bg-[#dc2626] p-1 rounded">
              <Users className="text-white size-4" />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight">TeamShuffle</h1>
          </div>
        </div>
        <Link to="/global" className="text-sm font-bold text-slate-400 hover:text-[#dc2626] transition-colors">
          Dashboard
        </Link>
      </nav>

      <main className="p-4 max-w-2xl mx-auto space-y-6">
        {/* Squad Section */}
        <section className="bg-[#192643]/20 border border-[#192643]/40 rounded-xl overflow-hidden transition-all duration-300">
          <div 
            className="p-4 flex items-center justify-between border-b border-[#192643]/30 cursor-pointer hover:bg-[#192643]/30 transition-colors"
            onClick={() => setIsSquadExpanded(!isSquadExpanded)}
          >
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">Squad</h2>
              <span className="bg-[#192643] text-white text-xs px-2 py-0.5 rounded-full">{players.length}</span>
            </div>
            {isSquadExpanded ? <ChevronUp className="text-slate-400 size-6" /> : <ChevronDown className="text-slate-400 size-6" />}
          </div>
          
          {isSquadExpanded && (
            <div className="p-4 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Enter player name..." 
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-slate-900 border border-[#192643]/40 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#192643] outline-none text-sm"
                  />
                </div>
                <button 
                  onClick={addPlayer}
                  className="bg-[#192643] text-white px-4 py-3 rounded-lg font-bold flex items-center gap-1 hover:bg-opacity-90 transition-all active:scale-95"
                >
                  <Plus className="size-4" /> Add
                </button>
              </div>
              
              {/* Player Chips */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {players.map((name, i) => (
                  <div key={name} className="flex items-center gap-2 bg-slate-800 border border-[#192643]/30 py-1.5 px-3 rounded-full text-sm font-medium shadow-sm">
                    <span className="text-slate-400">{i + 1}.</span> {name} 
                    <X 
                      className="size-3 cursor-pointer hover:text-[#dc2626] transition-colors" 
                      onClick={() => removePlayer(name)}
                    />
                  </div>
                ))}
                {players.length === 0 && (
                  <p className="text-sm text-slate-500 italic w-full text-center py-4">No players added yet. Add some players to start shuffling!</p>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Team Control */}
        <section className="flex flex-col items-center gap-4 py-4">
          <h3 className="text-xs font-black tracking-[0.2em] text-slate-500 uppercase">Teams</h3>
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setNumTeams(Math.max(2, numTeams - 1))}
              className="size-12 rounded-full border-2 border-[#192643]/20 flex items-center justify-center hover:bg-[#192643]/10 transition-colors active:scale-95"
            >
              <Minus className="size-6 font-bold" />
            </button>
            <div className="text-6xl font-black text-[#dc2626] drop-shadow-sm">{numTeams}</div>
            <button 
              onClick={() => setNumTeams(Math.min(10, numTeams + 1))}
              className="size-12 rounded-full border-2 border-[#192643]/20 flex items-center justify-center hover:bg-[#192643]/10 transition-colors active:scale-95"
            >
              <Plus className="size-6 font-bold" />
            </button>
          </div>
        </section>

        {/* Shuffle Button */}
        <button 
          onClick={shuffleTeams}
          disabled={players.length < 2}
          className="w-full bg-gradient-to-r from-[#dc2626] to-red-700 text-white py-5 rounded-xl font-black text-xl tracking-tight shadow-lg shadow-[#dc2626]/20 active:translate-y-1 transition-transform flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0"
        >
          <Zap className="size-6 fill-current" /> SHUFFLE TEAMS
        </button>

        {/* Results Section */}
        {teams.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Results Section Header */}
            <div className="space-y-3 pt-4 border-t border-[#192643]/30 mb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="bg-[#192643]/40 px-3 py-1 rounded-full text-xs font-bold border border-[#192643]/20">
                  Shuffle #{shuffleCount} — {players.length} players → {numTeams} teams
                </div>
                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Shuffled {shuffleCount} time{shuffleCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Serial: {serialNumber}</span>
                <button 
                  onClick={() => navigator.clipboard.writeText(serialNumber)}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Copy Serial Number"
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team, index) => {
                const colorConfig = teamColors[index % teamColors.length];
                return (
                  <div key={index} className="bg-slate-900 rounded-xl overflow-hidden border border-[#192643]/30 shadow-sm">
                    <div className={`h-1.5 ${colorConfig.bg} w-full`}></div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">{colorConfig.icon} {colorConfig.name}</h4>
                        <button 
                          onClick={() => downloadTeamCard(index)}
                          className="text-slate-400 hover:text-white transition-colors" 
                          title="Download Team Card"
                        >
                          <Download className="size-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-bold mb-3 uppercase">{team.length} Players</p>
                      <ul className="space-y-1.5">
                        {team.map((name, i) => (
                          <li key={name} className={`text-xs font-medium py-1 flex gap-2 ${i < team.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <span className="text-slate-400">{i + 1}.</span> {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6">
              <button 
                onClick={shuffleTeams}
                className="flex-1 border-2 border-[#192643]/40 text-slate-300 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-[#192643]/10 transition-colors active:scale-95"
              >
                <RefreshCw className="size-5" /> Reshuffle
              </button>
              <button 
                onClick={shareToWhatsApp}
                className="flex-1 bg-[#25D366] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
              >
                <Share2 className="size-5" /> WhatsApp
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-12 mb-8 text-center">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">TeamShuffle • Fair Teams. One Tap.</p>
      </footer>
    </div>
  );
}
