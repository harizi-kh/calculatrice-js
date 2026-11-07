import { ChevronLeft, TrashCan } from "akar-icons";
import Button from "../components/Button";

export default function History({ history = [], onBack, onDelete, onClear }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="flex h-[80vh] w-full max-w-sm flex-col">
        {/* En-tête */}
        <div className="mb-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={onBack} label="Retour à la calculatrice">
            <ChevronLeft strokeWidth={2} size={24} />
          </Button>

          <h1 className="text-lg font-semibold text-white">Historique</h1>

          {/* Tout supprimer */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            label="Vider tout l'historique"
            disabled={history.length === 0}
            className="disabled:opacity-30"
          >
            <TrashCan strokeWidth={2} size={22} />
          </Button>
        </div>

        {/* Liste */}
        {history.length === 0 ? (
          <p className="mt-16 text-center text-[#A5A5A5]">
            Aucun calcul pour le moment.
          </p>
        ) : (
          <ul className="flex-1 divide-y divide-[#333333] overflow-y-auto">
            {[...history].reverse().map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-2 py-4">
                {/* Supprimer cette ligne seulement */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete?.(item.id)}
                  label={`Supprimer ${item.expression} ${item.result}`}
                  className="shrink-0"
                >
                  <TrashCan strokeWidth={2} size={18} />
                </Button>

                <div className="flex min-w-0 flex-1 flex-col items-end">
                  <span className="max-w-full truncate text-sm text-[#A5A5A5]">
                    {item.expression}
                  </span>
                  <span
                    className={`max-w-full truncate text-4xl font-light ${
                      item.result === "Erreur" ? "text-[#FF9F0A]" : "text-white"
                    }`}
                  >
                    {item.result}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}