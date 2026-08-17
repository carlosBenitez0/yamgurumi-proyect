import React from 'react';
import { MdStar } from 'react-icons/md';

export default function AdminReviewsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white border border-stone-200/90 p-6 rounded-2xl shadow-xs space-y-1">
        <h2 className="font-headline font-bold text-xl sm:text-2xl text-stone-800 flex items-center gap-2">
          <MdStar className="text-[#72594e]" />
          <span>Moderación de Reseñas</span>
        </h2>
        <p className="text-xs text-stone-500">
          Aprueba, oculta o responde a las valoraciones y comentarios enviados por compradores de la tienda.
        </p>
      </div>

      <div className="p-8 text-center bg-white border border-stone-200/90 rounded-2xl shadow-xs space-y-2">
        <div className="w-10 h-10 rounded-xl bg-amber-100/60 text-amber-800 flex items-center justify-center mx-auto text-xl">
          ⭐
        </div>
        <h3 className="font-headline font-bold text-base text-stone-800">
          Módulo de Reseñas Listo
        </h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Podrás moderar comentarios de compradores y publicar respuestas oficiales.
        </p>
      </div>
    </div>
  );
}
