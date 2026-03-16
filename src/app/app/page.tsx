"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Users, ChevronUp, ChevronDown, Plus, X, Minus, Zap, CheckCircle2, Copy, Download, RefreshCw, Share2, Edit2, Check, Crown, Coffee } from 'lucide-react';
import Link from 'next/link';
import LogoBrand from '@/components/LogoBrand';
import SocialLinks from '@/components/SocialLinks';

export default function CoreApp() {
  const [players, setPlayers] = useState<string[]>(['Alex', 'Jordan', 'Sam', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn', 'Jamie', 'Drew', 'Avery', 'Cameron']);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [numTeams, setNumTeams] = useState(3);
  const [teams, setTeams] = useState<string[][]>([]);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [serialNumber, setSerialNumber] = useState('');
  const [isSquadExpanded, setIsSquadExpanded] = useState(true);
  
  // Squad editing state
  const [editingPlayerIndex, setEditingPlayerIndex] = useState<number | null>(null);
  const [editingPlayerValue, setEditingPlayerValue] = useState('');

  // Teams editing state
  const [isEditingTeams, setIsEditingTeams] = useState(false);
  const [newTeamPlayerNames, setNewTeamPlayerNames] = useState<{[key: number]: string}>({});
  const [editingTeamPlayer, setEditingTeamPlayer] = useState<{teamIdx: number, playerIdx: number} | null>(null);
  const [editingTeamPlayerValue, setEditingTeamPlayerValue] = useState('');

  // Customization state
  const [teamColorsMap, setTeamColorsMap] = useState<Record<number, string>>({});
  const [teamNamesMap, setTeamNamesMap] = useState<Record<number, string>>({});
  const [showTipJarModal, setShowTipJarModal] = useState(false);

  const logoImgRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = "https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png";
    img.onload = () => { logoImgRef.current = img; };
  }, []);

  const addPlayer = () => {
    if (newPlayerName.trim() && !players.includes(newPlayerName.trim())) {
      setPlayers([...players, newPlayerName.trim()]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (nameToRemove: string) => {
    setPlayers(players.filter(name => name !== nameToRemove));
  };

  const startEditingSquadPlayer = (index: number, name: string) => {
    setEditingPlayerIndex(index);
    setEditingPlayerValue(name);
  };

  const saveSquadPlayerEdit = (index: number) => {
    const trimmed = editingPlayerValue.trim();
    if (trimmed) {
      const newPlayers = [...players];
      newPlayers[index] = trimmed;
      setPlayers(newPlayers);
    }
    setEditingPlayerIndex(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      saveSquadPlayerEdit(index);
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
      const temp = shuffledPlayers[i];
      shuffledPlayers[i] = shuffledPlayers[j];
      shuffledPlayers[j] = temp;
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
    setIsEditingTeams(false);
    setNewTeamPlayerNames({});
  };

  // Team Management Functions
  const removePlayerFromTeam = (teamIndex: number, playerIndex: number) => {
    const newTeams = [...teams];
    newTeams[teamIndex] = [...newTeams[teamIndex]];
    newTeams[teamIndex].splice(playerIndex, 1);
    setTeams(newTeams);
  };

  const addPlayerToTeam = (teamIndex: number) => {
    const name = newTeamPlayerNames[teamIndex];
    if (!name || !name.trim()) return;
    
    const newTeams = [...teams];
    newTeams[teamIndex] = [...newTeams[teamIndex], name.trim()];
    setTeams(newTeams);
    
    setNewTeamPlayerNames(prev => ({...prev, [teamIndex]: ''}));
  };

  const startEditingTeamPlayer = (teamIdx: number, playerIdx: number, name: string) => {
    setEditingTeamPlayer({ teamIdx, playerIdx });
    setEditingTeamPlayerValue(name);
  };

  const saveTeamPlayerEdit = () => {
    if (!editingTeamPlayer) return;
    const { teamIdx, playerIdx } = editingTeamPlayer;
    const trimmed = editingTeamPlayerValue.trim();
    
    if (trimmed) {
      const newTeams = [...teams];
      newTeams[teamIdx] = [...newTeams[teamIdx]];
      newTeams[teamIdx][playerIdx] = trimmed;
      setTeams(newTeams);
    }
    
    setEditingTeamPlayer(null);
  };

  const DEFAULT_COLORS = ['#3b82f6', '#f97316', '#22c55e', '#a855f7', '#ec4899', '#eab308', '#06b6d4', '#f43f5e'];
  const getTeamColor = (index: number) => teamColorsMap[index] || DEFAULT_COLORS[index % DEFAULT_COLORS.length];
  const getTeamName = (index: number) => teamNamesMap[index] !== undefined ? teamNamesMap[index] : `Team ${String.fromCharCode(65 + (index % 26))}${index >= 26 ? Math.floor(index/26) + 1 : ''}`;

  const downloadTeamCard = (teamIndex: number) => {
    const team = teams[teamIndex];
    const teamColor = getTeamColor(teamIndex);
    const teamName = getTeamName(teamIndex);
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions — height scales with team size to prevent content overflow
    const width = 800;
    const height = Math.max(1000, 480 + team.length * 90);
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#1e293b'; // slate-800
    ctx.fillRect(0, 0, width, height);

    // Top color bar
    ctx.fillStyle = teamColor;
    ctx.fillRect(0, 0, width, 20);

    // Header (Team Name)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px Lexend, sans-serif';
    ctx.fillText(teamName, 60, 120);

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
    
    const logoImg = logoImgRef.current;
    if (logoImg) {
      ctx.drawImage(logoImg, 60, height - 120, 40, 40);
      ctx.fillText('TeamShuffle', 110, height - 90);
    } else {
      ctx.fillText('TeamShuffle', 60, height - 90);
    }

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
    link.download = `TeamShuffle-${teamName.replaceAll(' ', '')}-${serialNumber}.png`;
    link.href = dataUrl;
    link.click();
  };

  const shareToWhatsApp = () => {
    let text = `*TeamShuffle Results* (Shuffle #${shuffleCount})\nSerial: ${serialNumber}\n\n`;
    
    teams.forEach((team, index) => {
      const teamName = getTeamName(index);
      text += `*${teamName}*\n`;
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
          <Link href="/" className="cursor-pointer hover:text-[#192643] transition-colors">
            <ArrowLeft className="size-6" />
          </Link>
          <LogoBrand size="md" />
        </div>
        <Link href="/global" className="text-sm font-bold text-slate-400 hover:text-[#dc2626] transition-colors">
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
                  <div key={`${name}-${i}`} className="flex items-center gap-2 bg-slate-800 border border-[#192643]/30 py-1.5 px-3 rounded-full text-sm font-medium shadow-sm">
                    {editingPlayerIndex === i ? (
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">{i + 1}.</span>
                        <input 
                          type="text"
                          value={editingPlayerValue}
                          onChange={(e) => setEditingPlayerValue(e.target.value)}
                          onKeyDown={(e) => handleEditKeyDown(e, i)}
                          onBlur={() => saveSquadPlayerEdit(i)}
                          autoFocus
                          className="bg-transparent border-b border-[#dc2626] outline-none text-white w-20"
                        />
                      </div>
                    ) : (
                      <>
                        <span className="text-slate-400">{i + 1}.</span> 
                        <span 
                          className="cursor-pointer hover:text-white border-b border-dashed border-transparent hover:border-slate-400 transition-colors" 
                          onClick={() => startEditingSquadPlayer(i, name)}
                          title="Click to edit"
                        >
                          {name}
                        </span>
                        <X 
                          className="size-3 cursor-pointer hover:text-[#dc2626] transition-colors ml-1" 
                          onClick={() => removePlayer(name)}
                        />
                      </>
                    )}
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
              onClick={() => setNumTeams(numTeams + 1)}
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
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="bg-green-500/10 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Shuffled {shuffleCount} time{shuffleCount !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">Serial: {serialNumber}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowTipJarModal(true)}
                    className="text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1 border bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30"
                  >
                    <Coffee className="size-3" />
                    Tip Jar
                  </button>
                  <button 
                    onClick={() => setIsEditingTeams(!isEditingTeams)}
                    className={`text-xs font-bold px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${isEditingTeams ? 'bg-[#dc2626] text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {isEditingTeams ? <Check className="size-3" /> : <Edit2 className="size-3" />}
                    {isEditingTeams ? 'Done' : 'Edit Teams'}
                  </button>
                  <button 
                    onClick={() => navigator.clipboard.writeText(serialNumber)}
                    className="text-slate-400 hover:text-white transition-colors"
                    title="Copy Serial Number"
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Team Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {teams.map((team, index) => {
                const teamColor = getTeamColor(index);
                const teamName = getTeamName(index);
                return (
                  <div key={index} className="bg-slate-900 rounded-xl overflow-hidden border border-[#192643]/30 shadow-sm">
                    <div className="h-1.5 w-full" style={{ backgroundColor: teamColor }}></div>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {isEditingTeams && (
                            <input 
                              type="color" 
                              value={teamColor}
                              onChange={(e) => setTeamColorsMap({...teamColorsMap, [index]: e.target.value})}
                              className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                              title="Change team color"
                            />
                          )}
                          {isEditingTeams ? (
                            <input
                              type="text"
                              value={teamName}
                              onChange={(e) => setTeamNamesMap({...teamNamesMap, [index]: e.target.value})}
                              className="font-bold text-sm bg-slate-800 border border-slate-600 rounded px-1 outline-none w-full max-w-[150px]"
                              style={{ color: teamColor }}
                              placeholder="Team Name"
                            />
                          ) : (
                            <h4 className="font-bold text-sm" style={{ color: teamColor }}>{teamName}</h4>
                          )}
                        </div>
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
                          <li key={`${name}-${i}`} className={`text-xs font-medium py-1 flex items-center justify-between ${i < team.length - 1 ? 'border-b border-white/5' : ''}`}>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-slate-400">{i + 1}.</span> 
                              {editingTeamPlayer?.teamIdx === index && editingTeamPlayer?.playerIdx === i ? (
                                <input 
                                  type="text"
                                  value={editingTeamPlayerValue}
                                  onChange={(e) => setEditingTeamPlayerValue(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && saveTeamPlayerEdit()}
                                  onBlur={saveTeamPlayerEdit}
                                  autoFocus
                                  className="bg-slate-800 border border-slate-600 rounded px-1 outline-none text-white w-full max-w-[120px]"
                                />
                              ) : (
                                <span 
                                  className={isEditingTeams ? "cursor-pointer hover:text-[#dc2626] border-b border-dashed border-transparent hover:border-[#dc2626] transition-colors" : ""} 
                                  onClick={() => isEditingTeams && startEditingTeamPlayer(index, i, name)}
                                  title={isEditingTeams ? "Click to edit" : ""}
                                >
                                  {name}
                                </span>
                              )}
                            </div>
                            {isEditingTeams && (
                              <button onClick={() => removePlayerFromTeam(index, i)} className="text-slate-500 hover:text-[#dc2626] ml-2 p-1">
                                <X className="size-3" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                      {isEditingTeams && (
                        <div className="mt-3 flex gap-2">
                          <input 
                            type="text"
                            placeholder="Add player..."
                            value={newTeamPlayerNames[index] || ''}
                            onChange={(e) => setNewTeamPlayerNames({...newTeamPlayerNames, [index]: e.target.value})}
                            onKeyDown={(e) => e.key === 'Enter' && addPlayerToTeam(index)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs outline-none focus:border-[#dc2626] text-white"
                          />
                          <button 
                            onClick={() => addPlayerToTeam(index)}
                            className="bg-slate-700 hover:bg-slate-600 text-white rounded px-2 py-1.5 transition-colors"
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                      )}
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

      <footer className="mt-12 mb-8 text-center flex flex-col items-center gap-4">
        <SocialLinks iconClassName="size-5" linkClassName="text-slate-500" />
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">TeamShuffle • Fair Teams. One Tap.</p>
      </footer>

      {/* Tip Jar Modal */}
      {showTipJarModal && (
        <div className="fixed inset-0 z-[200] bg-[#0F1520]/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-4 mx-auto">
              <Coffee className="size-6" />
            </div>
            <h3 className="text-xl font-black text-center text-white mb-2">Support TeamShuffle</h3>
            <p className="text-slate-400 text-sm text-center mb-6">If you find this app helpful for your games, consider buying us a coffee to keep the servers running!</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  alert("Thanks for your support! (Tip functionality coming soon)");
                  setShowTipJarModal(false);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-black py-3 rounded-xl transition-colors"
              >
                Buy us a Coffee ☕
              </button>
              <button
                onClick={() => setShowTipJarModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
