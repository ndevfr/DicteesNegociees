//import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import { createContext, useContext, useState, useEffect } from "react";

const DisplayContext = createContext();
const CopiesContext = createContext();

const LOCALSTORAGE_PREFIX = "AppDicteeNegociee-";

const EXEMPLES = {
  ANALYSE: [
    "Le programme analyse les différentes copies puis il crée une dictée négociée à partir des différences trouvées en se basant sur le nombre de mots.",
    "Le programme analise les diférentes copies puis il craie une dictée négocier à partir des différences trouvées en se basant sur le nombre de maux.",
    "Le pro_gramme analyse les différentes copies puis il crée une dictée négociée à partir des différences trouver en se basant sur le nombre de mots.",
  ],
  MULTIPLE: [
    "Le programme {génère ; genere ; j'ai nerfs} une dictée {négociée ; négocier ; négocié} à partir des choix multiples renseignés entre {accolades ; acollades}.",
  ],
};

const saveToLocalStorage = (name, value) => {
  localStorage.setItem(LOCALSTORAGE_PREFIX + name, JSON.stringify(value));
};

const loadFromLocalStorage = (name, defaultValue) => {
  if (localStorage.getItem(LOCALSTORAGE_PREFIX + name)) {
    return JSON.parse(localStorage.getItem(LOCALSTORAGE_PREFIX + name));
  } else {
    return defaultValue;
  }
};

const DisplayProvider = ({ children }) => {
  const [zoom, setZoom] = useState(() => loadFromLocalStorage("zoom", false));
  const [separe, setSepare] = useState(() =>
    loadFromLocalStorage("separe", false)
  );
  const [fontSize, setFontSize] = useState(() =>
    loadFromLocalStorage("fontSize", 16)
  );

  useEffect(() => {
    saveToLocalStorage("fontSize", fontSize);
  }, [fontSize]);

  useEffect(() => {
    saveToLocalStorage("zoom", zoom);
  }, [zoom]);

  useEffect(() => {
    saveToLocalStorage("separe", separe);
  }, [separe]);

  const changeFontSize = (event) => {
    setFontSize(event.target.value);
  };

  const toggleZoom = () => {
    setZoom((current) => !current);
  };

  const toggleSepare = () => {
    setSepare((current) => !current);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.getElementById("root").requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const values = {
    zoom,
    separe,
    fontSize,
    changeFontSize,
    toggleZoom,
    toggleSepare,
    toggleFullScreen,
  };

  return (
    <DisplayContext.Provider value={values}>{children}</DisplayContext.Provider>
  );
};

const CopiesProvider = ({ children }) => {
  const [copies, setCopies] = useState(() =>
    loadFromLocalStorage("copies", [""])
  );
  const [exemple, setExemple] = useState("");

  useEffect(() => {
    saveToLocalStorage("copies", copies);
  }, [copies]);

  const forceExempleAnalyse = () => {
    setExemple("ANALYSE");
  };

  const forceExempleMultiple = () => {
    setExemple("MULTIPLE");
  };

  const cancelExemple = () => {
    setExemple("");
  };

  const changeGroupedCopies = (value) => {
    setCopies(value.split("\n@\n"));
  };

  const changeOneCopie = (index, value) => {
    setCopies((current) => [
      ...current.slice(0, index),
      value,
      ...current.slice(index + 1, current.length),
    ]);
  };

  const addCopie = () => {
    setCopies((current) => [...current, ""]);
  };

  const delCopie = () => {
    setCopies((current) => current.slice(0, current.length - 1));
  };

  const clearCopies = () => {
    if (
      window.confirm("Êtes-vous certain de vouloir effacer toutes les copies ?")
    ) {
      setCopies([""]);
    }
  };

  const values = {
    copies,
    addCopie,
    delCopie,
    clearCopies,
    forceExempleAnalyse,
    forceExempleMultiple,
    cancelExemple,
    changeGroupedCopies,
    changeOneCopie,
    exemple,
  };

  return (
    <CopiesContext.Provider value={values}>{children}</CopiesContext.Provider>
  );
};

const useDisplayContext = () => {
  const context = useContext(DisplayContext);
  if (!context) {
    throw new Error("useDiplayContext must be used within a DisplayProvider");
  }
  return context;
};

const useCopiesContext = () => {
  const context = useContext(CopiesContext);
  if (!context) {
    throw new Error("useDiplayContext must be used within a DisplayProvider");
  }
  return context;
};

const Header = () => {
  const {
    zoom,
    separe,
    fontSize,
    toggleZoom,
    toggleSepare,
    changeFontSize,
    toggleFullScreen,
  } = useDisplayContext();
  const { addCopie, delCopie, clearCopies, exemple } = useCopiesContext();

  return (
    <>
      <div className="row">
        <div className="d-flex flex-wrap align-items-center">
          <img
            src="./logo192.png"
            alt="Logo de Dictées Négociées Webapp"
            className="m-2"
            style={{ height: 38 }}
          />
          <button
            className="btn btn-primary m-2"
            onClick={toggleZoom}
            title={
              !zoom ? "Afficher la dictée négociée" : "Modifier les copies"
            }
          >
            {!zoom ? "Afficher" : "Modifier"}
          </button>
          <button
            className="btn btn-info m-2"
            onClick={toggleFullScreen}
            title={"Plein-écran"}
          >
            Plein-écran
          </button>
          <div className="d-flex flex-nowrap align-items-center m-2">
            <input
              id="fontSizeRange"
              type="range"
              min="10"
              max="40"
              step="1"
              onChange={changeFontSize}
              defaultValue="16"
              className="form-range"
              style={{ width: "200px" }}
              title={"Taille de la police : " + fontSize}
            />
            <p className="m-2">Police : {fontSize} pt</p>
          </div>
        </div>
      </div>
      {!zoom && (
        <>
          <div className="row">
            <div className="d-flex flex-wrap align-items-center">
              <p className="m-2">Copies :</p>
              <button
                className="btn btn-dark m-2"
                onClick={toggleSepare}
                title={separe ? "Regrouper les copies" : "Séparer les copies"}
              >
                {separe ? "Regrouper les copies" : "Séparer les copies"}
              </button>
              {separe && exemple === "" && (
                <button
                  className="btn btn-danger m-2"
                  onClick={delCopie}
                  title="Supprimer la dernière copie"
                >
                  -
                </button>
              )}
              {separe && exemple === "" && (
                <button
                  className="btn btn-success m-2"
                  onClick={addCopie}
                  title="Ajouter une copie"
                >
                  +
                </button>
              )}
              {exemple === "" && (
                <button
                  className="btn btn-danger m-2"
                  onClick={clearCopies}
                  title="Tout supprimer"
                >
                  Tout supprimer
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

const ExempleBar = () => {
  const { zoom } = useDisplayContext();
  const { forceExempleAnalyse, forceExempleMultiple, cancelExemple, exemple } =
    useCopiesContext();

  return (
    <>
      {!zoom && (
        <div className="row">
          <div className="d-flex flex-wrap align-items-center">
            <p className="m-2">Exemples :</p>
            {exemple === "" && (
              <button
                className="btn btn-secondary m-2"
                onClick={forceExempleAnalyse}
                title="Exemple avec analyse de copies"
              >
                Analyse de copies
              </button>
            )}
            {exemple === "" && (
              <button
                className="btn btn-secondary m-2"
                onClick={forceExempleMultiple}
                title="Exemple avec choix multiple"
              >
                Choix multiple
              </button>
            )}
            {exemple !== "" && (
              <button
                className="btn btn-secondary m-2"
                onClick={cancelExemple}
                title="Quitter le mode Exemple"
              >
                Quitter le mode Exemple
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

const EditorGrouped = () => {
  const { zoom, separe } = useDisplayContext();
  const { copies, changeGroupedCopies, exemple } = useCopiesContext();

  if (zoom || separe) {
    return;
  }

  return (
    <div className="row">
      <div className="col-12">
        <div
          id="single-frame"
          className="row m-2 border border-dark rounded-top p-0 box-shadow shadow"
        >
          <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
            <div className="col">
              <strong>Copies (séparées par un @)</strong>
            </div>
          </div>
          <div className="d-block p-0" style={{ marginBottom: "-5px" }}>
            {exemple === "" && (
              <textarea
                id="single-input"
                rows={separe ? "5" : "15"}
                className="w-100 m-0 border-0 bg-light"
                onChange={(event) => changeGroupedCopies(event.target.value)}
                value={copies.join("\n@\n")}
              />
            )}
            {exemple !== "" && (
              <textarea
                id="single-input"
                rows={separe ? "5" : "15"}
                className="w-100 m-0 border-0 bg-light"
                value={EXEMPLES[exemple].join("\n@\n")}
                disabled
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EditorSepared = () => {
  const { zoom, separe } = useDisplayContext();
  const { copies, exemple } = useCopiesContext();

  if (zoom || !separe) {
    return;
  }

  const tabTxt = exemple === "" ? copies : EXEMPLES[exemple];

  const allInputs = tabTxt.map((value, index) => (
    <InputCopie key={"multiple-frame-" + index} index={index} />
  ));

  return <>{allInputs}</>;
};

const InputCopie = ({ index }) => {
  const { copies, changeOneCopie, exemple } = useCopiesContext();

  return (
    <div className="row">
      <div className="col-12">
        <div
          id="multiple-frame-{i}"
          className="row m-2 border border-dark rounded-top p-0 box-shadow shadow"
        >
          <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
            <div className="col">
              <strong>Copie {index + 1}</strong>
            </div>
          </div>
          <div className="d-block p-0" style={{ marginBottom: "-5px" }}>
            {exemple === "" && (
              <textarea
                id={"multiple-input-" + index}
                rows="5"
                className="w-100 m-0 border-0 bg-light"
                onChange={(event) => changeOneCopie(index, event.target.value)}
                value={copies[index]}
              />
            )}
            {exemple !== "" && (
              <textarea
                id={"multiple-input-" + index}
                rows="5"
                className="w-100 m-0 border-0 bg-light"
                value={EXEMPLES[exemple][index]}
                disabled
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultDisplay = () => {
  const { fontSize } = useDisplayContext();
  const { exemple, copies } = useCopiesContext();

  const tabTxt = exemple === "" ? copies : EXEMPLES[exemple];
  const copiesGrouped = tabTxt.join("\n@\n");

  const cssFontSize = fontSize + "pt";

  let texte = copiesGrouped;

  let wordscopie = [];
  let affichage = [];
  let erreursHtml = [];
  let maxWords = 0;
  if (texte.length > 0) {
    let matches = texte.match(/\{([^{^}]*)\}/g);
    if (matches != null) {
      matches.forEach((item) => {
        let replaceStr = item
          .replace(/{(.*)}/, "$1")
          .replace(/[ ]*;[ ]*/g, "|")
          .replace(/[ ]+/g, "_");
        texte = texte.replace(item, replaceStr);
      });
    }
    let exemplaires = texte
      .replace(/\{(.*)\}/g, "$1")
      .replace(/\{(^s)\s(^s)\}/g, "{$1$2}")
      .split("\n@\n");
    for (let i = 0; i < exemplaires.length; i++) {
      if (exemplaires[i].length > 0) {
        wordscopie[i] = exemplaires[i]
          .replace(/([,.!?:()])/g, " $1 ")
          .replace(/[ ]+/g, " ")
          .replace(/(\r\n|\r|\n)/g, " # ")
          .split(" ");
        if (wordscopie[i].length > maxWords) {
          maxWords = wordscopie[i].length;
        }
      } else {
        wordscopie[i] = [];
      }
    }
    for (let i = 0; i < maxWords; i++) {
      let erreurs = [];
      for (let j = 0; j < wordscopie.length; j++) {
        if (wordscopie[j][i] !== undefined) {
          if (wordscopie[j][i].indexOf("|") >= 0) {
            let arrwordscopie = wordscopie[j][i].split("|");
            if (arrwordscopie.length > 0) {
              arrwordscopie.forEach((item) => {
                let word = item.replace(/_+/g, "\u00A0\u00A0\u00A0\u00A0");
                if (!erreurs.includes(word) && word !== "*") {
                  erreurs.push(word);
                }
              });
            }
          } else {
            let word = wordscopie[j][i].replace(
              /_+/g,
              "\u00A0\u00A0\u00A0\u00A0"
            );
            if (!erreurs.includes(word) && word !== "*") {
              erreurs.push(word);
            }
          }
        }
      }
      if (erreurs.length === 1 && erreurs[0] === "#") {
        affichage.push(<span className="w-100" key={affichage.length}></span>);
      } else if (erreurs.length === 1) {
        affichage.push(
          <span className="correct text-center p-2" key={affichage.length}>
            {erreurs[0]}
          </span>
        );
      } else {
        erreursHtml = erreurs.map((elem, errindex) => (
          <span className="" key={affichage.length + "-" + errindex}>
            {elem}
            <br />
          </span>
        ));
        affichage.push(
          <span className="incorrect text-center p-2" key={affichage.length}>
            {erreursHtml}{" "}
          </span>
        );
      }
    }
  }

  return (
    <div className="row">
      <div className="col-12">
        <div
          id="resul-frame"
          className="row border border-dark rounded-top m-2 p-0 box-shadow shadow"
        >
          <div className="d-flex justify-content-between align-items-center p-2 bg-dark text-white">
            <div className="col">
              <strong>Dictée négociée</strong>
            </div>
          </div>
          <div className="d-block bg-white p-2">
            <div
              id="result"
              style={{ fontSize: cssFontSize }}
              className="d-flex flex-wrap align-items-center align-content-center"
            >
              {affichage}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <DisplayProvider>
      <CopiesProvider>
        <Header />
        <ExempleBar />
        <EditorSepared />
        <EditorGrouped />
        <ResultDisplay />
      </CopiesProvider>
    </DisplayProvider>
  );
};

export default App;
