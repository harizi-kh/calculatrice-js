import { useState } from "react";
import { Clock } from "akar-icons";
import Button from "../components/Button";


const ERROR = "Erreur";

// Calcule a (op) b. Renvoie null si division par zéro.
const compute = (a, b, op) => {
  const x = parseFloat(a);
  const y = parseFloat(b);
  let result;

  switch (op) {
    case "+":
      result = x + y;
      break;
    case "−":
      result = x - y;
      break;
    case "×":
      result = x * y;
      break;
    case "÷":
      if (y === 0) return null;
      result = x / y;
      break;
    default:
      return b;
  }

  // évite 0.1 + 0.2 = 0.30000000000000004
  return String(parseFloat(result.toFixed(10)));
};

export default function Calculator({ onAddHistory, onOpenHistory }) {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState("");
  const [previous, setPrevious] = useState(null);
  const [operator, setOperator] = useState(null);
  const [overwrite, setOverwrite] = useState(false); // le prochain chiffre remplace l'écran

  const isError = display === ERROR;
  const isPristine = display === "0" && !history && !operator;

  const clear = () => {
    setDisplay("0");
    setHistory("");
    setPrevious(null);
    setOperator(null);
    setOverwrite(false);
  };

  const showError = (expression) => {
    setDisplay(ERROR);
    setHistory(expression);
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
    onAddHistory?.({ id: Date.now(), expression, result: ERROR });
  };

  const handleDigit = (digit) => {
    if (isError) {
      clear();
      setDisplay(digit);
      return;
    }
    if (overwrite) {
      setDisplay(digit);
      setOverwrite(false);
      return;
    }
    if (display.replace(/[-.]/g, "").length >= 9) return;
    setDisplay(display === "0" ? digit : display + digit);
  };

  const handleDecimal = () => {
    if (isError) {
      clear();
      setDisplay("0.");
      return;
    }
    if (overwrite) {
      setDisplay("0.");
      setOverwrite(false);
      return;
    }
    if (!display.includes(".")) setDisplay(display + ".");
  };

  const handleBackspace = () => {
    if (isError) return clear();
    if (overwrite) return;
    if (display.length <= 1 || (display.length === 2 && display.startsWith("-"))) {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleSign = () => {
    if (isError || display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
  };

  const handlePercent = () => {
    if (isError) return;
    setDisplay(String(parseFloat((parseFloat(display) / 100).toFixed(10))));
  };

  const handleOperator = (op) => {
    if (isError) return;

    // Opérateur changé juste après un opérateur : on remplace seulement
    if (operator && overwrite) {
      setOperator(op);
      setHistory(`${previous} ${op}`);
      return;
    }

    // Calcul enchaîné : 12 + 5 + ... → on calcule d'abord 12 + 5
    if (operator) {
      const result = compute(previous, display, operator);
      if (result === null) return showError(`${previous} ${operator} ${display} =`);
      onAddHistory?.({
        id: Date.now(),
        expression: `${previous} ${operator} ${display} =`,
        result,
      });
      setPrevious(result);
      setDisplay(result);
      setHistory(`${result} ${op}`);
    } else {
      setPrevious(display);
      setHistory(`${display} ${op}`);
    }

    setOperator(op);
    setOverwrite(true);
  };

  const handleEquals = () => {
    if (isError || !operator) return;

    const expression = `${previous} ${operator} ${display} =`;
    const result = compute(previous, display, operator);

    if (result === null) return showError(expression);

    onAddHistory?.({ id: Date.now(), expression, result });
    setHistory(expression);
    setDisplay(result);
    setPrevious(null);
    setOperator(null);
    setOverwrite(true);
  };

  // Taille du texte qui rétrécit quand le nombre est long
  const fontSize =
    display.length > 11
      ? "text-4xl"
      : display.length > 8
      ? "text-5xl"
      : display.length > 6
      ? "text-6xl"
      : "text-7xl";

  // Opérateur "sélectionné" (fond blanc) comme sur iPhone
  const opVariant = (op) =>
    operator === op && overwrite ? "operatorActive" : "operator";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4">
      <div className="w-full max-w-sm">
        {/* Barre du haut : bouton historique */}
        <div className="mb-2 flex justify-start">
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenHistory}
            label="Ouvrir l'historique"
          >
            <Clock strokeWidth={2} size={24} />
          </Button>
        </div>

        {/* Écran */}
        <div className="flex flex-col items-end px-2 pb-3" aria-live="polite">
          <div className="h-6 max-w-full truncate text-lg text-[#A5A5A5]">
            {history}
          </div>
          <div
            className={`max-w-full truncate font-light leading-tight ${fontSize} ${
              isError ? "text-[#FF9F0A]" : "text-white"
            }`}
          >
            {display}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackspace}
            label="Retour arrière"
            className="mt-1 self-start"
          >
            ⌫
          </Button>
        </div>

        {/* Touches */}
        <div className="grid grid-cols-4 justify-items-center gap-3">
          <Button variant="func" onClick={clear} label="Effacer">
            {isPristine ? "AC" : "C"}
          </Button>
          <Button variant="func" onClick={handleSign} label="Changer le signe">
            ±
          </Button>
          <Button variant="func" onClick={handlePercent} label="Pourcentage">
            %
          </Button>
          <Button variant={opVariant("÷")} onClick={() => handleOperator("÷")} label="Diviser">
            ÷
          </Button>

          <Button onClick={() => handleDigit("7")}>7</Button>
          <Button onClick={() => handleDigit("8")}>8</Button>
          <Button onClick={() => handleDigit("9")}>9</Button>
          <Button variant={opVariant("×")} onClick={() => handleOperator("×")} label="Multiplier">
            ×
          </Button>

          <Button onClick={() => handleDigit("4")}>4</Button>
          <Button onClick={() => handleDigit("5")}>5</Button>
          <Button onClick={() => handleDigit("6")}>6</Button>
          <Button variant={opVariant("−")} onClick={() => handleOperator("−")} label="Soustraire">
            −
          </Button>

          <Button onClick={() => handleDigit("1")}>1</Button>
          <Button onClick={() => handleDigit("2")}>2</Button>
          <Button onClick={() => handleDigit("3")}>3</Button>
          <Button variant={opVariant("+")} onClick={() => handleOperator("+")} label="Additionner">
            +
          </Button>

          <Button size="wide" onClick={() => handleDigit("0")} className="col-span-2">
            0
          </Button>
          <Button onClick={handleDecimal} label="Virgule">
            .
          </Button>
          <Button variant="operator" onClick={handleEquals} label="Calculer">
            =
          </Button>
        </div>
      </div>
    </div>
  );
}
