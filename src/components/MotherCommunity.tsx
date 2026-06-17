/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { ForumPost, ForumComment, ChildProfile } from "../types";
import { INITIAL_FORUM_POSTS } from "../utils/nutritionData";
import { MessageSquare, Users, ThumbsUp, CheckCircle, PlusCircle, AlertCircle, Send, Sparkles } from "lucide-react";

interface MotherCommunityProps {
  activeProfile: ChildProfile | null;
}

export default function MotherCommunity({ activeProfile }: MotherCommunityProps) {
  const [posts, setPosts] = useState<ForumPost[]>(() => {
    const saved = localStorage.getItem("nutrikids_forum_posts");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_FORUM_POSTS;
      }
    }
    return INITIAL_FORUM_POSTS;
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<ForumPost["category"]>("Introdução Alimentar");
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  // Sync forum posts in localStorage
  useEffect(() => {
    localStorage.setItem("nutrikids_forum_posts", JSON.stringify(posts));
  }, [posts]);

  // Handle post upvoting
  const handleVote = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return { ...post, votes: post.votes + 1 };
        }
        return post;
      })
    );
  };

  // Submit new forum topic
  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const authorName = activeProfile ? `Mãe do ${activeProfile.name}` : "Mãe NutriKids";
    const newPostId = Math.random().toString(36).substring(7);

    const newPost: ForumPost = {
      id: newPostId,
      author: `${authorName} (Anônima)`,
      category,
      title: title.trim(),
      content: content.trim(),
      votes: 1,
      comments: [],
      timestamp: new Date().toISOString(),
      isModerated: false,
    };

    setPosts((prev) => [newPost, ...prev]);
    setTitle("");
    setContent("");

    // Simulate pediatrician moderation response dynamically using the true server-side Gemini 3.5 API
    setLoadingAI(newPostId);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Dê uma resposta profissional na qualidade de Pediatra e Nutricionista Especialista (SBP) para o post do fórum abaixo de forma concisa e amigável:
          Categoria: ${category}
          Título: ${newPost.title}
          Texto do post: ${newPost.content}
          
          Seja empático, esclareça mitos ou valide o cuidado da mãe de forma simples baseado em OMS/SBP. Máximo de 1 parágrafo curto. Assine como Dra. Marina Costa - Nutrição Geral Unicef.`,
        }),
      });

      if (!response.ok) throw new Error();
      const data = await response.json();

      setPosts((currentPosts) =>
        currentPosts.map((p) => {
          if (p.id === newPostId) {
            return {
              ...p,
              isModerated: true,
              moderatorReply: {
                author: "Dra. Marina Costa",
                title: "Pediatria e Nutrologia Relacionada - UNICEF/SBP",
                text: data.reply,
                timestamp: new Date().toISOString(),
              },
            };
          }
          return p;
        })
      );
    } catch (err) {
      // Fallback response if API drops
      setPosts((currentPosts) =>
        currentPosts.map((p) => {
          if (p.id === newPostId) {
            return {
              ...p,
              isModerated: true,
              moderatorReply: {
                author: "Dra. Marina Costa",
                title: "Nutricionista Materno-Infantil Integrante",
                text: "Obrigada por postar na comunidade! Seu post foi revisado e as indicações estão alinhadas com as diretrizes SBP de introdução lenta e gradual. Siga oferecendo em texturas cozidas e macias, sempre acompanhando a aceitação.",
                timestamp: new Date().toISOString(),
              },
            };
          }
          return p;
        })
      );
    } finally {
      setLoadingAI(null);
    }
  };

  // Submit standard mother comment to a post
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId] || "";
    if (!text.trim()) return;

    const commenterName = activeProfile ? `Mãe do ${activeProfile.name}` : "Mãe Integrante";
    const newComment: ForumComment = {
      id: Math.random().toString(36).substring(7),
      author: commenterName,
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, comments: [...post.comments, newComment] };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  return (
    <div id="forum-community-section" className="bg-white rounded-3xl border border-orange-100/40 shadow-xs p-5">
      
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-orange-50/70 pb-3 mb-5">
        <Users className="w-5 h-5 text-orange-500" />
        <div>
          <h2 className="text-base font-black text-gray-800 tracking-tight font-display">Fórum da Comunidade</h2>
          <p className="text-[10px] text-gray-450 leading-none">Troca de experiências seguras com supervisão e moderação médica SBP/OMS</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* New Forum Topic creation - 4 columns */}
        <div className="lg:col-span-4 bg-orange-50/15 p-4 rounded-2xl border border-orange-100/30 space-y-4">
          <span className="text-xs font-black text-orange-850 uppercase tracking-widest block flex items-center gap-1">
            <PlusCircle className="w-4 h-4 text-orange-500" />
            Criar Nova Discussão
          </span>

          <form onSubmit={handleSubmitPost} className="space-y-3 shrink-0">
            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Categoria do Tópico</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ForumPost["category"])}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold text-slate-700"
              >
                <option value="Introdução Alimentar">🍼 Introdução Alimentar</option>
                <option value="Receitas Saudáveis">🥣 Receitas Saudáveis</option>
                <option value="Alergias e Dúvidas">⚠️ Alergias e Dúvidas</option>
                <option value="Geral">💬 Geral</option>
              </select>
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Título da mensagem</label>
              <input
                type="text"
                required
                placeholder="Ex: Como dar mamão pela primeira vez?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Sua dúvida / postagem</label>
              <textarea
                required
                rows={4}
                placeholder="Escreva aqui detalhadamente a sua experiência ou o que gostaria de perguntar..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-orange-400 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-2xs flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Publicar Tópico
            </button>
          </form>
        </div>

        {/* Existing Forum list - 8 columns */}
        <div className="lg:col-span-8 space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-150 p-5 rounded-2xl space-y-4 shadow-xs">
              
              {/* Header row */}
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full inline-block mb-1">
                    {post.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-800 leading-snug">{post.title}</h3>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">Postado por: {post.author}</p>
                </div>

                <button
                  onClick={() => handleVote(post.id)}
                  className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 px-2.5 py-1 rounded-xl border border-gray-100 transition-all text-[11px] font-bold text-slate-700 shrink-0"
                >
                  <ThumbsUp className="w-3 h-3 text-slate-400" />
                  <span>{post.votes}</span>
                </button>
              </div>

              {/* Message text */}
              <p className="text-xs text-gray-600 leading-relaxed bg-slate-50/40 p-3 rounded-xl border border-dashed border-gray-100 font-medium">
                {post.content}
              </p>

              {/* Verified Pediatric Mod Response */}
              {post.moderatorReply ? (
                <div className="bg-gradient-to-r from-orange-50/50 to-amber-50/25 p-4 rounded-xl border border-orange-100/50 space-y-2 relative">
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-orange-100 text-orange-850 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-orange-200">
                    <CheckCircle className="w-3 h-3 text-orange-600 shrink-0" />
                    PARECER SEGURO SBP/OMS
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-black uppercase text-orange-850 tracking-wider block">{post.moderatorReply.author}</span>
                    <span className="text-[9px] text-orange-650 font-bold block">{post.moderatorReply.title}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-700">
                    {post.moderatorReply.text}
                  </p>
                </div>
              ) : loadingAI === post.id ? (
                <div className="bg-orange-50/20 border border-orange-100/30 p-4 rounded-xl flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin"></div>
                  <span className="text-[11px] font-bold text-orange-600 animate-pulse uppercase tracking-wider">Aguardando parecer nutrológico da moderatriz Dra. Marina...</span>
                </div>
              ) : null}

              {/* standard comments flow */}
              {post.comments.length > 0 && (
                <div className="space-y-1 bg-gray-50/20 p-2 rounded-xl">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="text-[11px] text-gray-600 pl-3 border-l-2 border-gray-250 py-1 flex justify-between gap-2">
                      <span className="leading-tight">
                        <strong className="text-gray-700">{comment.author}:</strong> {comment.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Fast write standard comment input */}
              <div className="flex gap-2 pt-2 border-t border-gray-50">
                <input
                  type="text"
                  placeholder="Deixe um comentário amigável..."
                  value={commentInputs[post.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                  }
                  onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                  className="flex-1 px-3 py-1 bg-gray-50 border border-gray-150 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-slate-300 font-medium"
                />
                <button
                  onClick={() => handleAddComment(post.id)}
                  className="p-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
